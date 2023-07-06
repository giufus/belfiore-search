import http from "http";
import { restoreDb } from "./restoredb.js";
import * as url from 'url'
import { searchDoc, desc } from './search.js'
import { OpaqueDocumentStore } from "@orama/orama";


// restore DB from file
const db = (async () => {
    return await restoreDb()
})();

// error response template
const errorResponse = (err: any, res: any, contentType: any) => {
    res.writeHead(400, contentType);
    res.end(
        JSON.stringify(err)
    );
}

// cors template
const allowCors = (res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
}


// handle requests
export const server = http.createServer((req, res) => {

    allowCors(res)

    const url = new URL(req?.url || '', `http://${req.headers.host}`);
    const params = url.searchParams;
    const contentTypeJson = { "Content-Type": "application/json" };

    if (params && params.size > 0) {
        let searchRes = searchDoc(db, params)
            .then((docs) => {
                res.writeHead(200, contentTypeJson);
                res.end(
                    JSON.stringify(docs, null, 2)
                );
            })
            .catch((err) => {
                errorResponse(err, res, contentTypeJson)
            })
    } else {
        let description = desc(db)
            .then((keys: string[]) => {
                res.writeHead(200, contentTypeJson);
                res.end(
                    JSON.stringify({
                        message: 'You need to pass 1..N of the following params',
                        params: keys,
                    }, null, 2)
                );
            })
            .catch((err) => {
                errorResponse(err, res, contentTypeJson)
            })
    }

});

// server startup
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});

