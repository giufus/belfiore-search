import http from "http";
import { restoreDb } from "./restoredb.js";
import * as url from 'url'
import { searchDoc } from './search.js'

export const server = http.createServer((req, res) => {

    const url = new URL(req?.url || '', `http://${req.headers.host}`);
    const params = url.searchParams;

    if (params && params.size > 0) {
        let searchRes = searchDoc(params)
            .then((docs) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify(docs, null, 2)
                );
            })
            .catch((err) => {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify(err)
                );
            })
    } else {
        res.end(
            JSON.stringify({
                message: 'You need to pass 1..N of the following params',
                params: ["ID", "DATAISTITUZIONE", "DATACESSAZIONE", "CODISTAT", "CODCATASTALE", "DENOMINAZIONE_IT", "DENOMTRASLITTERATA", "ALTRADENOMINAZIONE", "ALTRADENOMTRASLITTERATA", "ID_PROVINCIA", "IDPROVINCIAISTAT", "IDREGIONE", "IDPREFETTURA", "STATO", "SIGLAPROVINCIA", "FONTE", "DATAULTIMOAGG", "COD_DENOM"],
            }, null, 2));
    }

});

const db = restoreDb()
    .then((schema) => {

        server.listen(3000, () => {
            console.log("Server running on http://localhost:3000/");
        });


    }, (err) => console.log)
    .catch((err) => console.log);



