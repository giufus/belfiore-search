import { create, insertMultiple } from '@orama/orama'
import { persistToFile } from '@orama/plugin-data-persistence/server'
import { parse } from 'csv'
import * as fs from 'fs'
import * as path from 'path'
import { CSV_FILE_NAME, Comune, DB_PATH, interval, timeString } from './commons.js'


const setupDb = async () => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    const csvFilePath = path.resolve(CSV_FILE_NAME);
    //const headers = ["ID", "DATAISTITUZIONE", "DATACESSAZIONE", "CODISTAT", "CODCATASTALE", "DENOMINAZIONE_IT", "DENOMTRASLITTERATA", "ALTRADENOMINAZIONE", "ALTRADENOMTRASLITTERATA", "ID_PROVINCIA", "IDPROVINCIAISTAT", "IDREGIONE", "IDPREFETTURA", "STATO", "SIGLAPROVINCIA", "FONTE", "DATAULTIMOAGG", "COD_DENOM"];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
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