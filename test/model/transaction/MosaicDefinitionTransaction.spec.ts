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
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {MosaicDefinitionTransaction} from '../../../src/model/transaction/MosaicDefinitionTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('MosaicDefinitionTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 7', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            'test-mosaic-name',
            'test-parent-name',
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                levyMutable: true,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.mosaicName).to.be.equal('test-mosaic-name');
        expect(mosaicDefinitionTransaction.mosaicProperties.duration.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.mosaicProperties.duration.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.mosaicProperties.levyMutable).to.be.equal(true);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('967D149BA9BC5A5B4CCCD78612DDF5CA10010703746573742D6D6F736169632D6E616D6502E803000000000000');

    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            'test-mosaic-name',
            'test-parent-name',
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                levyMutable: false,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.mosaicName).to.be.equal('test-mosaic-name');
        expect(mosaicDefinitionTransaction.mosaicProperties.duration.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.mosaicProperties.duration.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.levyMutable).to.be.equal(false);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('967D149BA9BC5A5B4CCCD78612DDF5CA10010003746573742D6D6F736169632D6E616D6502E803000000000000');

    });
});
