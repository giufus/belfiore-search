
export const ARCHIVE_CSV: String = 'https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv'
export const CSV_FILE_NAME = 'ANPR_archivio_comuni.csv'
export const DB_PATH = './comuni.msp'

export type Comune = {
    "ID": string
    "DATAISTITUZIONE": string
    "DATACESSAZIONE": string
    "CODISTAT": string
    "CODCATASTALE": string
    "DENOMINAZIONE_IT": string
    "DENOMTRASLITTERATA": string
    "ALTRADENOMINAZIONE": string
    "ALTRADENOMTRASLITTERATA": string
    "ID_PROVINCIA": string
    "IDPROVINCIAISTAT": string
    "IDREGIONE": string
    "IDPREFETTURA": string
    "STATO": string
    "SIGLAPROVINCIA": string
    "FONTE": string
    "DATAULTIMOAGG": string
    "COD_DENOM": string
}

export const interval = (startDate: Date, nextDate: Date) => {
    let diff = Math.abs(nextDate.getTime() - startDate.getTime());
    let ms = diff;
    let num = ms / 1000;
    let seconds = Math.floor(num % 60);
    num = Math.floor(num / 60);   
    let minutes = num % 60;
    num = Math.floor(num / 60);
    let hours = num % 24;
    return JSON.stringify({
        ms, 
        seconds, 
        minutes, 
        hours
    })
}