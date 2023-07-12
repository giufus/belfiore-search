
export const ARCHIVE_CSV: String = 'https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv'
export const CSV_FILE_NAME = 'ANPR_archivio_comuni.csv'
export const DB_PATH = './comuni.msp'

export const COMUNE_PROPS = [
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
    "COD_DENOM",
]

export const ORAMA_PARAMS = ["limit", "offset",]

//TODO: find a way to map the above list to this type  
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

export const timeString = (date: Date): string => {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
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