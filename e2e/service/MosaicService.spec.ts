import { map, mergeMap, toArray } from 'rxjs/operators';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { Address } from '../../src/model/account/Address';
import { MosaicService } from '../../src/service/MosaicService';

describe('MosaicService', () => {
    let accountAddress: Address;
    let accountHttp: AccountHttp;
    let mosaicHttp: MosaicHttp;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            accountAddress = Address.createFromRawAddress(json.testAccount.address);
            accountHttp = new AccountHttp(json.apiUrl);
            mosaicHttp = new MosaicHttp(json.apiUrl);
            done();
        });
    });
    it('should return the mosaic list skipping the expired mosaics', () => {
        const mosaicService = new MosaicService(accountHttp, mosaicHttp);

        const address = accountAddress;

        return mosaicService.mosaicsAmountViewFromAddress(address).pipe(
            mergeMap((_) => _),
            map((mosaic) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName())),
            toArray(),
        ).toPromise();
    });
});
