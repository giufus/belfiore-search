import { Orama, Schema, search } from '@orama/orama'
import { restoreFromFile } from '@orama/plugin-data-persistence/server'
import { DB_PATH, Comune, interval } from './commons.js';




export const restoreDb = async (): Promise<Orama<Schema>> => {

    const start = new Date()

    console.log(`Started @ ${start.getHours}:${start.getMinutes}:${start.getSeconds}:${start.getMilliseconds}`)

    console.log(`Restoring db...`)
    const db = await restoreFromFile('binary', DB_PATH)
    console.log(`Restored after ${interval(start, new Date())}`)

    return db
};

