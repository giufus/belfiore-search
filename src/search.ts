import { Orama, Result, Results, Schema, search } from '@orama/orama';
import { URLSearchParams } from 'url';
import { interval, timeString } from './commons.js';


// search document
export const searchDoc = async (schema: Promise<Orama<Schema>>, searchParams?: URLSearchParams): Promise<Results<Result[]>> => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    let term = Array.from(searchParams?.values() || []).join(' ')
    let properties = Array.from(searchParams?.keys() || [])

    console.log(`Searching comuni...`)

    const db = await schema; 
    const searchResult = await search(db, { term, properties })

    console.log(`Responding after ${interval(start, new Date())}`)

    return searchResult;
};


// desc schema hitting 1st doc
export const desc = async (schema: Promise<Orama<Schema>>): Promise<string[]> => {
    return Object.keys((await search(await schema, {})).hits[0].document)
};