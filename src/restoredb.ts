import { Orama, Schema } from '@orama/orama';
import { restoreFromFile } from '@orama/plugin-data-persistence/server';
import { DB_PATH, interval, timeString } from './commons.js';

// restore db from file system
export const restoreDb = async (): Promise<Orama<Schema>> => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    console.log(`Restoring db...`)
    const db = await restoreFromFile('binary', DB_PATH)
    console.log(`DB restored after ${interval(start, new Date())}`)

    return db
};

