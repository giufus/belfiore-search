import { search } from '@orama/orama'
import { restoreFromFile } from '@orama/plugin-data-persistence/server'
import { DB_PATH, Comune, interval } from './commons.js';




const searchDoc = async () => {

    const start = new Date()

    console.log(`Started @ ${start.getHours}:${start.getMinutes}:${start.getSeconds}:${start.getMilliseconds}`)

    console.log(`Restoring db...`)
    const db = await restoreFromFile('binary', DB_PATH)
    console.log(`Restored after ${interval(start, new Date())}`)

    console.log(`Searching comuni...`)
    const searchResult = await search(db, {
        term: process.argv[2],
        properties: ['DENOMINAZIONE_IT'],
    })

    console.log(`Responding after ${interval(start, new Date())}`)
    if (searchResult?.count) {
        console.log(searchResult.hits.map(hit => hit.document as Comune))
    }
};

searchDoc();