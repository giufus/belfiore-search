import { Orama, Result, Results, Schema, search, SortByParams } from '@orama/orama';
import { URLSearchParams } from 'url';
import { interval, timeString, COMUNE_PROPS } from './commons.js';


// search document
export const searchDoc = async (schema: Promise<Orama<Schema>>, searchParams?: URLSearchParams): Promise<Results<Result[]>> => {

    const start = new Date()

    console.log(`Started @ ${timeString(start)}`)

    // search params
    const city = searchParams?.get('DENOMINAZIONE_IT') || ''
    const province = searchParams?.get('SIGLAPROVINCIA') || ''
    let termPropsAndFilter = getTermPropsAndFilter(city, province)

    // pagination
    let limit = 10;
    let offset = 0;
    try {
        limit = parseInt(searchParams?.get('limit') || '10')
        offset = parseInt(searchParams?.get('offset') || '0')
    } catch {
        Promise.reject({ "message": "limit / offset must be int numbers" })
    }

    // sorting by 
    const sortBy = {
        property: "DATACESSAZIONE",
        order: "DESC",
    } as SortByParams

    console.log(`Searching comuni...`)

    const db = await schema;
    const query = { 
        term: termPropsAndFilter[0], 
        properties: termPropsAndFilter[1]|| [], 
        where: termPropsAndFilter[2] || null,
        limit, 
        offset, 
        sortBy 
    }

    console.log('query is ', query)

    const searchResult = await search(db, query);

    console.log(`Responding after ${interval(start, new Date())}`)

    return searchResult;
};

const getTermPropsAndFilter = (city: string, prov: string) => {
    let term: string = ''
    let props: string[] = [];
    let filter: any = {};
    if (city) {
        term = city
        props = ['DENOMINAZIONE_IT']
        if (prov) {
            filter = { 'SIGLAPROVINCIA': prov} 
        }
    } else if (prov) {
        term = prov
        props = ['SIGLAPROVINCIA']
    } else {
        console.log('you shall not be here')
    }

    return [term, props, filter]
}

// desc schema hitting 1st doc
export const desc = async (schema: Promise<Orama<Schema>>): Promise<string[]> => {
    return Object.keys((await search(await schema, {})).hits[0].document)
};