/*
 * Copyright 2019 NEM
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
import {Convert} from '../../../src/core/format';
import {Account} from '../../../src/model/account/Account';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {AliasAction} from '../../../src/model/namespace/AliasAction';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {NetworkType} from '../../../src/model/network/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {MosaicAliasTransaction} from '../../../src/model/transaction/MosaicAliasTransaction';
import {TestingAccount} from '../../conf/conf.spec';

describe('MosaicAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicAliasTransaction.maxFee).to.be.equal(BigInt(0));
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
            BigInt(1),
        );

        expect(mosaicAliasTransaction.maxFee).to.be.equal(BigInt(1));
    });

    it('should createComplete an MosaicAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(mosaicAliasTransaction.namespaceId.id).to.be.equal(BigInt('0xE1499A8D01FCD82A'));
        expect(mosaicAliasTransaction.mosaicId.id).to.be.equal(BigInt('0xCAF5DD1286D7CC4C'));

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('2AD8FC018D9A49E14CCCD78612DDF5CA01');

    });

    describe('size', () => {
        it('should return 145 for MosaicAliasTransaction transaction byte size', () => {
            const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
            const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicAliasTransaction.size).to.be.equal(145);
            expect(Convert.hexToUint8(mosaicAliasTransaction.serialize()).length).to.be.equal(mosaicAliasTransaction.size);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(mosaicAliasTransaction.maxFee).to.be.equal(BigInt(290));

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });
});
