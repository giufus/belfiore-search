# belfiore-search  

```

  _            _   __  _                                                      _      
 | |          | | / _|(_)                                                    | |    
 | |__    ___ | || |_  _   ___   _ __   ___     ___   ___   __ _  _ __   ___ | |__   
 | '_ \  / _ \| ||  _|| | / _ \ | '__| / _ \   / __| / _ \ / _` || '__| / __|| '_ \  
 | |_) ||  __/| || |  | || (_) || |   |  __/   \__ \|  __/| (_| || |   | (__ | | | | 
 |_.__/  \___||_||_|  |_| \___/ |_|    \___|   |___/ \___| \__,_||_|    \___||_| |_| 
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌻🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 
```


This project is aimed at the ingestion of a set of records from a CSV into a modern lightweight full-text search engine, Orama, in order to evaluate its performance and perform useful searches at the same time.

## Introduction  
Every Italian citizen has a unique ID, called FISCAL CODE. It is often used for fiscal / health insurance purposes. This code is generated through an [algorithm](https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/informazioni-codificazione-pf). Apart from your personal details, the algorithm requires an external CODE (commonly called [Belfiore](https://it.wikipedia.org/wiki/Codice_catastale) code) that will be part of the suffix of the final algorithm's output.  
Every city in Italy has its code and you can get the updated list at this [url](https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv). As a user, you can easily remember the name of the city where you were born, but not the code. This API is for instant real-time search and retrieval of the _Belfiore_ code (even if you get much more, as the entire archive of cities of Italy is ingested), starting from substrings of a city name, province, etc. 

The project uses:  
- [node.js](https://nodejs.org/en) server environment  
- [typescript](https://www.typescriptlang.org/) programming language  
- [orama](https://oramasearch.com/) db and search engine  
- [csv](https://www.npmjs.com/package/csv) CSV parsing  

## Setup of the project  
1. I like to use [nodeenv](https://github.com/ekalinin/nodeenv) to manage my node.js projects, so:
2. Create and activate a node.js virtual env with the LTS version of node.js (currently `node:18.16.1`):  
```bash
cd belfiore-search  
nodeenv  -n lts .nvenv  
source .nvenv/bin/activate  
```
3. to build the project locally, execute in order:  
```
npm install
npm run build  
npm run vitest  
npm run setup
```
   
The last command will start the ingestion of documents from the CSV into the db. Once completed (the operation lasts approx 4 mins), the database is persisted in `./comuni.msp`  
   
   4. now you can run a local http server and perform full-text searches running `npm run start`  
   
   5. WARNING! `CORS` is deliberately not enforced :)  

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

## A curiosity
If you search a city by its name, using the param `DENOMINAZIONE_IT` for example, you may obtain an _"historycal view of the city"_, as can exist similar documents with different intervals, in the past:  

```json  
...  
  "DATAISTITUZIONE": "1871-01-15",  
  "DATACESSAZIONE": "1935-03-06",  
...  
```
 or not (`DATACESSAZIONE` is in the future, so the document represents the current state of the city):   
```json  
...  
  "DATAISTITUZIONE": "1937-10-26",
  "DATACESSAZIONE": "9999-12-31", 
...  
```

## Dockerizing

### Build image  
`docker build . -t belfiore-search-docker`  

### Run container  
`docker run -p 3000:3000 -d belfiore-search-docker:latest`  



## To do
- implementation of a performance test  
- add details about CF algorithm  
- use remote csv file while ingesting, fallback to local if it fails
- add CI/CD (and hopefully a free hosting service)
