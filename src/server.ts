import http from "http";
import { restoreDb } from "./restoredb.js";
import { searchDoc } from './search.js';
import { ORAMA_PARAMS, SEARCH_FILTER } from "./commons.js";


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
    return Array.from(params.keys())
        .every(item => SEARCH_FILTER.includes(item) || ORAMA_PARAMS.includes(item))
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
        res.writeHead(200, contentTypeJson);
        res.end(
            JSON.stringify({
                message: `You search with the following params. If you pass both of them, the second is used as a filter on the results`,
                extra: ` Optional params 'limit' (default is 10) and 'offset' (default is 0)`, 
                params: SEARCH_FILTER,
            }, null, 2)
        );
    }

});

// server startup
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});

