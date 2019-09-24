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

import { expect } from 'chai';
import { Convert } from '../../../src/core/format/Convert';
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { NamespaceMetadataTransaction } from '../../../src/model/transaction/NamespaceMetadataTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('NamespaceMetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        expect(namespaceMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(namespaceMetadataTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(namespaceMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(namespaceMetadataTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create and sign an NamespaceMetadataTransaction object', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFEE80' +
                       '30000000000004CCCD78612DDF5CA01000A0000000000000000000000');
    });

    it('should throw error if value size is bigger than 1024', () => {
        expect(() => {
            NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(1000),
                new NamespaceId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(1025)),
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error, 'The maximum value size is 1024');
    });

    describe('size', () => {
        it('should return 153 for NamespaceMetadataTransaction byte size', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(1000),
                new NamespaceId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );
            expect(namespaceMetadataTransaction.size).to.be.equal(180);
        });
    });
});
