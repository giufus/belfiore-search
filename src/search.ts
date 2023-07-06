import { Result, Results, search } from '@orama/orama'
import { restoreFromFile } from '@orama/plugin-data-persistence/server'
import { DB_PATH, Comune, interval } from './commons.js';
import { URLSearchParams } from 'url';




export const searchDoc = async (searchParams?: URLSearchParams): Promise<Results<Result[]>> => {

    const start = new Date()

    console.log(`Started @ ${start.getHours}:${start.getMinutes}:${start.getSeconds}:${start.getMilliseconds}`)

    console.log(`Restoring db...`)
    const db = await restoreFromFile('binary', DB_PATH)
    console.log(`Restored after ${interval(start, new Date())}`)


    let term = Array.from(searchParams?.values() || []).join(' ')
    let properties = Array.from(searchParams?.keys() || [])
    
    console.log(`Searching comuni...`)
    const searchResult = await search(db, { term, properties})

    console.log(`Responding after ${interval(start, new Date())}`)

    return searchResult;
};
