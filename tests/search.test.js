import { describe, expect, it, vi } from 'vitest';
import { searchDoc } from '../src/search.js';
describe('search tests', () => {
    vi.mock('@orama/orama', () => ({
        search: vi.fn().mockReturnValue({
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
                }
            ],
            "count": 401
        })
    }));
    it('search a city OK', async () => {
        const params = new URL('http://localhost:3000?DENOMINAZIONE_IT=ARICC&SIGLAPROVINCIA=RM').searchParams;
        const db = new Promise(() => { });
        const result = await searchDoc(db, params);
        expect(result.count).toEqual(401);
    });
});
//# sourceMappingURL=search.test.js.map