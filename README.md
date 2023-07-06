# belfiore-search  

``` 
 _            _   __  _                                                      _
| |          | | / _|(_)                                                    | |
| |__    ___ | || |_  _   ___   _ __   ___     ___   ___   __ _  _ __   ___ | |__
| '_ \  / _ \| ||  _|| | / _ \ | '__| / _ \   / __| / _ \ / _` || '__| / __|| '_ \
| |_) ||  __/| || |  | || (_) || |   |  __/   \__ \|  __/| (_| || |   | (__ | | | |
|_.__/  \___||_||_|  |_| \___/ |_|    \___|   |___/ \___| \__,_||_|    \___||_| |_|
```

This project is a test case, aimed at the ingestion of a set of records from a CSV into a modern lightweight full-text search engine, Orama, in order to evaluate its performance and perform useful searches at the same time.

## Introduction  
Every Italian citizen has a unique ID, called FISCAL CODE. It is often used for fiscal / health insurance purposes. This code is generated through an [algorithm](https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/informazioni-codificazione-pf). Apart from your personal details, the algorithm requires an external CODE (commonly called [Belfiore](https://it.wikipedia.org/wiki/Codice_catastale) code) that will be part of the suffix of the final algorithm's output.  
Every city in Italy has its code and you can get the updated list at this [url](https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv). As a user, you can easily remind the name of the city where you were born, but not the code. This API is for instant real-time search and retrieval of the code, starting from substrings of a city name, province, etc.


The project uses:  
- node.js
- [orama](https://oramasearch.com/)
- [csv](https://www.npmjs.com/package/csv)

## Setup of the project  
1. I like to use [nodeenv](https://github.com/ekalinin/nodeenv) to manage my node.js projects, so:
2. Create and activate a node virtual env with the LTS version of node inside of the repo:
```bash
cd belfiore-search  
nodeenv  -n lts .nvenv  
source .nvenv/bin/activate  
```
3. `npm install` to install dependencies locally 
4. not needed, because it is already in the repo, but just as a reminder: `npx tsc --init` to initialize typescript configuration  
5. `npx tsc` to compile typescript into js  
6. start the ingestion of documents from the CSV into the db with `node src/setup.js`
7. once completed (the operation lasts 4 min circa), the database is persisted into `./comuni.msp`  
8. now you can run a local http server and perform full-text searches running `node src/server.js`  (`--inspect` if you want debug ON)  


## Samples

### GET `http://localhost:3000/`  
```json
{
  "message": "You need to pass 1..N of the following params",
  "params": [
    "ID",
    "DATAISTITUZIONE",
    "DATACESSAZIONE",
    "CODISTAT",
    "CODCATASTALE",
    "DENOMINAZIONE_IT",
    "DENOMTRASLITTERATA",
    "ALTRADENOMINAZIONE",
    "ALTRADENOMTRASLITTERATA",
    "ID_PROVINCIA",
    "IDPROVINCIAISTAT",
    "IDREGIONE",
    "IDPREFETTURA",
    "STATO",
    "SIGLAPROVINCIA",
    "FONTE",
    "DATAULTIMOAGG",
    "COD_DENOM"
  ]
}
```

### GET `http://localhost:3000?DENOMINAZIONE_IT=ARICC&SIGLAPROVINCIA=RM`  
```json
{
  "elapsed": {
    "raw": 8545459,
    "formatted": "8ms"
  },
  "hits": [
    {
      "id": "30581029-5371",
      "score": 11.116959146913565,
      "document": {
        "ID": "17567",
        "DATAISTITUZIONE": "1871-01-15",
        "DATACESSAZIONE": "1935-03-06",
        "CODISTAT": "058009",
        "CODCATASTALE": "A401",
        "DENOMINAZIONE_IT": "ARICCIA",
        "DENOMTRASLITTERATA": "ARICCIA",
        "ALTRADENOMINAZIONE": "",
        "ALTRADENOMTRASLITTERATA": "",
        "ID_PROVINCIA": "58",
        "IDPROVINCIAISTAT": "058",
        "IDREGIONE": "12",
        "IDPREFETTURA": "",
        "STATO": "C",
        "SIGLAPROVINCIA": "RM",
        "FONTE": "",
        "DATAULTIMOAGG": "2016-06-17",
        "COD_DENOM": ""
      }
    },
    ...
    ...
  ],
  "count": 401
}
```

## TODO
- add details about CF algorithm  
- use remote csv file while ingesting, fallback to local if it fails
- unit test (find the _right_ lib)
- add CI/CD (and hopefully a free hosting service)
- dockerize it  
