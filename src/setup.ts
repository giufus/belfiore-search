import { create, insertMultiple } from '@orama/orama'
import { persistToFile } from '@orama/plugin-data-persistence/server'
import { parse } from 'csv'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { CSV_FILE_NAME, Comune, DB_PATH, interval, timeString, ARCHIVE_CSV } from './commons.js'
import fetch from 'node-fetch'


const downloadFileToPathOrGetDefault = async (url: string): Promise<[string, boolean]> => {
    const downloadPath = path.resolve(`/tmp/${CSV_FILE_NAME}`)
    const downloaded = await fetch(url)
    
    const archivedPath = path.resolve(CSV_FILE_NAME); // curr dir
    const archived = fs.readFileSync(archivedPath);

    try {
        if (downloaded.status === 200) {
            const newFile = await downloaded.arrayBuffer()
            const digestNew = fileAndDigest(newFile)
            const digestOld = fileAndDigest(archived)
    
            if(digestNew[1] !== digestOld[1]) {
                console.log(`NEW: file is changed and has sha1 of ${digestNew[1]}`)
                fs.writeFileSync(downloadPath, digestNew[0])
                return Promise.resolve([downloadPath, true])
            } else {
                console.log(`ARCHIVED: file is not changed and has sha1 of ${digestOld[1]}`)
                return Promise.resolve([archivedPath, false]);
            }
        } else {
            console.log(`ARCHIVED: cannot download remote file, use the previous archive`)
            return Promise.resolve([archivedPath, false]);
        }
    } catch (err) {
        console.log("ARCHIVED: internal error", err)
        return Promise.resolve([archivedPath, false]);
    }
    
}

const fileAndDigest = (buffer: ArrayBuffer): string[] => {
    const hashSum = crypto.createHash('sha1')
    const fileAsString = new TextDecoder("utf-8").decode(buffer)
    return [fileAsString, hashSum.update(fileAsString).digest('hex')]
}

const setupDb = async () => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    const csvFilePath = await downloadFileToPathOrGetDefault(ARCHIVE_CSV)

    // db file axists, no need to recreate and persist
    if (fs.existsSync(DB_PATH) && !csvFilePath[1]) {
        console.log("DB exists, no updates on remote file.")
        return Promise.resolve();
    }

    const fileContent = fs.readFileSync(csvFilePath[0], { encoding: 'utf-8' })
    
    //const headers = ["ID", "DATAISTITUZIONE", "DATACESSAZIONE", "CODISTAT", "CODCATASTALE", "DENOMINAZIONE_IT", "DENOMTRASLITTERATA", "ALTRADENOMINAZIONE", "ALTRADENOMTRASLITTERATA", "ID_PROVINCIA", "IDPROVINCIAISTAT", "IDREGIONE", "IDPREFETTURA", "STATO", "SIGLAPROVINCIA", "FONTE", "DATAULTIMOAGG", "COD_DENOM"];
    const headers: string[] = fileContent.substring(0, fileContent.indexOf('\n')).split(',')
        .map((h) => h.replace(/\"/g, '').replace(/\r/g, ''))
    //console.log(headers)
    
    const schemaStub = headers.reduce((accumulator, value) => {
        return { ...accumulator, [value]: 'string' };
    }, {});
    //console.log(schemaStub)

    parse(fileContent, {
        delimiter: ',',
        columns: headers,
        from_line: 2,
        relax_quotes: true,
    }, async (error, result: Comune[]) => {
        if (error) {
            console.error(error);
        }

        // create schema
        const db = await create({
            schema: schemaStub,
        });

        console.log(`Populating after ${interval(start, new Date())}`)
        // populate
        await insertMultiple(db, result, 500);

        console.log(`Persisting after ${interval(start, new Date())}`)
        // persist to fs
        const DB_FILE = await persistToFile(db, 'binary', DB_PATH)

        console.log(`Finished after ${interval(start, new Date())}`)

    });

};

setupDb();