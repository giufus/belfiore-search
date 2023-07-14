import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { searchDoc } from '../src/search.js'
import { URLSearchParams } from 'url';
import { Orama, Schema, search } from '@orama/orama';



describe('search tests', () => {

    afterEach(() => {
        vi.restoreAllMocks()
    })

    vi.mock('@orama/orama', () => ({
        search: vi.fn().mockResolvedValue(Promise.resolve({
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
                        "DATAISTITUZIONE": "1920-01-15",
                        "DATACESSAZIONE": "9999-03-06",
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
                }
            ],
            "count": 401
        }))
    }))

    it('search a city OK', async () => {

        const params = new URL('http://localhost:3000?DENOMINAZIONE_IT=ARICC&SIGLAPROVINCIA=RM&limit=1').searchParams
        const db = Promise.resolve({}) as Promise<Orama<Schema>>;
        // same as const db2 = new Promise((resolve, reject) => resolve({} as Orama<Schema>) );

        const result = await searchDoc(db, params);

        expect(result.hits).toBeTruthy()
        expect(result.hits).toHaveLength(1)
        expect(result.hits[0].document.CODCATASTALE).toStrictEqual("A401")
        expect(search).toHaveBeenCalledOnce()
        expect(search).toHaveBeenCalledWith(await db, {
            term: expect.anything(), 
            properties: expect.anything(),
            where: expect.anything(),
            limit: expect.anything(), 
            offset: expect.anything(), 
            sortBy: expect.anything(), 
        })
    })

});