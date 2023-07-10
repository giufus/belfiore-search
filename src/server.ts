import http from "http";
import { restoreDb } from "./restoredb.js";
import { desc, searchDoc } from './search.js';
import { COMUNE_PROPS } from "./commons.js";


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

const validateParams = (params: URLSearchParams): boolean => {
    return Array.from(params.keys()).every(item => COMUNE_PROPS.includes(item))
}

// cors template
const allowCors = (res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
}


// handle requests
export const server = http.createServer(async (req, res) => {

    allowCors(res)

    const url = new URL(req?.url || '', `http://${req.headers.host}`);
    const params = url.searchParams;
    const contentTypeJson = { "Content-Type": "application/json" };

    if (params && params.size > 0 && validateParams(params)) {
        let searchRes = await searchDoc(db, params)
        res.writeHead(200, contentTypeJson);
                res.end(
                    JSON.stringify(searchRes, null, 2)
                );
            
    } else {
        let description = await desc(db)
        res.writeHead(200, contentTypeJson);
        res.end(
            JSON.stringify({
                message: 'You need to pass 1..N of the following params',
                params: description,
            }, null, 2)
        );
    }

});

// server startup
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});

