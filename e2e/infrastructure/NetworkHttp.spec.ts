/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {expect} from 'chai';
import {NetworkHttp} from '../../src/infrastructure/NetworkHttp';
import {NetworkType} from '../../src/model/blockchain/NetworkType';

describe('NetworkHttp', () => {
    let networkHttp: NetworkHttp;
    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            networkHttp = new NetworkHttp(json.apiUrl);
            done();
        });
    });

    describe('getNetworkType', () => {
        it('should return network type', (done) => {
            networkHttp.getNetworkType()
                .subscribe((networkType) => {
                    expect(networkType).to.be.equal(NetworkType.MIJIN_TEST);
                    done();
                });
        });
    });

    describe('getNetworkName', () => {
        it('should return network name and description', (done) => {
            networkHttp.getNetworkName()
                .subscribe((networkName) => {
                    expect(networkName.name.toLowerCase()).to.be.equal('mijintest');
                    expect(networkName.description.toLowerCase()).to.be.equal('catapult development network');
                    done();
                });
        });
    });
});
