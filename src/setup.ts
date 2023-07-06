import { create, insertMultiple } from '@orama/orama'
import { persistToFile } from '@orama/plugin-data-persistence/server'
import { parse } from 'csv'
import * as fs from 'fs'
import * as path from 'path'
import { CSV_FILE_NAME, Comune, DB_PATH, interval } from './commons.js'



const setupDb = async () => {

    const start = new Date()

    console.log(`Started @ ${start.getHours}:${start.getMinutes}:${start.getSeconds}:${start.getMilliseconds}`)
    
    const csvFilePath = path.resolve(CSV_FILE_NAME);
    const headers = ["ID", "DATAISTITUZIONE", "DATACESSAZIONE", "CODISTAT", "CODCATASTALE", "DENOMINAZIONE_IT", "DENOMTRASLITTERATA", "ALTRADENOMINAZIONE", "ALTRADENOMTRASLITTERATA", "ID_PROVINCIA", "IDPROVINCIAISTAT", "IDREGIONE", "IDPREFETTURA", "STATO", "SIGLAPROVINCIA", "FONTE", "DATAULTIMOAGG", "COD_DENOM"];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

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
            schema: {
                "ID": 'string',
                "DATAISTITUZIONE": 'string',
                "DATACESSAZIONE": 'string',
                "CODISTAT": 'string',
                "CODCATASTALE": 'string',
                "DENOMINAZIONE_IT": 'string',
                "DENOMTRASLITTERATA": 'string',
                "ALTRADENOMINAZIONE": 'string',
                "ALTRADENOMTRASLITTERATA": 'string',
                "ID_PROVINCIA": 'string',
                "IDPROVINCIAISTAT": 'string',
                "IDREGIONE": 'string',
                "IDPREFETTURA": 'string',
                "STATO": 'string',
                "SIGLAPROVINCIA": 'string',
                "FONTE": 'string',
                "DATAULTIMOAGG": 'string',
                "COD_DENOM": 'string',
            },
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