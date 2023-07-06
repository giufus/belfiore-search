# belfiore-search  

This project is a test case, aimed at ingesting a set of records from CSV into a modern lightweight text search engine to evaluate its performances and perform useful searches at the same time.

### History  
Every Italian citizen has a unique ID, called FISCAL CODE. It is often used for fiscal / health insurance purposes. This code is generated through an [algorithm](https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/richiesta-ts_cf/informazioni-codificazione-pf). Apart from your personal details, the algorithm requires a CODE (commonly called [Belfiore](https://it.wikipedia.org/wiki/Codice_catastale) code) that will be the suffix of its final output.  
Every city in Italy has its code and you can get the updated list at this [address](https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv). 


The project uses:  
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
6. start the ingestion of documents from the CSV `node src/setup.js`
7. once completed, the database is persisted in `./comuni.msp`
8. now you can search a _comune_  with `node src/search.js 'CALDOGNO'`  
9. the entire process of restoring the db from the file and perform a search works very well for my use case:  
 ```
 Restoring db...
Restored after {"ms":1335,"seconds":1,"minutes":0,"hours":0}
Searching comuni...
Responding after {"ms":1354,"seconds":1,"minutes":0,"hours":0}
[
  {
    ID: '1528',
    DATAISTITUZIONE: '1866-11-19',
    DATACESSAZIONE: '1987-10-20',
    CODISTAT: '024018',
    CODCATASTALE: 'B403',
    DENOMINAZIONE_IT: 'CALDOGNO',
    DENOMTRASLITTERATA: 'CALDOGNO',
    ALTRADENOMINAZIONE: '',
    ALTRADENOMTRASLITTERATA: '',
    ID_PROVINCIA: '24',
    IDPROVINCIAISTAT: '024',
    IDREGIONE: '05',
    IDPREFETTURA: '',
    STATO: 'C',
    SIGLAPROVINCIA: 'VI',
    FONTE: '',
    DATAULTIMOAGG: '2016-06-17',
    COD_DENOM: ''
  },
  {
    ID: '16804',
    DATAISTITUZIONE: '1987-10-21',
    DATACESSAZIONE: '9999-12-31',
    CODISTAT: '024018',
    CODCATASTALE: 'B403',
    DENOMINAZIONE_IT: 'CALDOGNO',
    DENOMTRASLITTERATA: 'CALDOGNO',
    ALTRADENOMINAZIONE: '',
    ALTRADENOMTRASLITTERATA: '',
    ID_PROVINCIA: '24',
    IDPROVINCIAISTAT: '024',
    IDREGIONE: '05',
    IDPREFETTURA: 'VI',
    STATO: 'A',
    SIGLAPROVINCIA: 'VI',
    FONTE: '',
    DATAULTIMOAGG: '2016-06-17',
    COD_DENOM: ''
  }
]
```