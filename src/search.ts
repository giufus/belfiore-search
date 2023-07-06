import { Result, Results, search, Orama, Schema } from '@orama/orama';
import { restoreFromFile } from '@orama/plugin-data-persistence/server'
import { DB_PATH, Comune, interval, timeString } from './commons.js';
import { URLSearchParams } from 'url';



// search document
export const searchDoc = async (schema: Promise<Orama<Schema>>, searchParams?: URLSearchParams): Promise<Results<Result[]>> => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    let term = Array.from(searchParams?.values() || []).join(' ')
    let properties = Array.from(searchParams?.keys() || [])

    console.log(`Searching comuni...`)

    const searchResult = await search(await schema, { term, properties })

    console.log(`Responding after ${interval(start, new Date())}`)

    return searchResult;
};


// desc schema hitting 1st doc
export const desc = async (schema: Promise<Orama<Schema>>): Promise<string[]> => {
    return Object.keys((await search(await schema, {})).hits[0].document)
};