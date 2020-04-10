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
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { NamespaceMetadataTransaction } from '../../../src/model/transaction/NamespaceMetadataTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { EmbeddedTransactionBuilder } from 'catbuffer-typescript/builders/EmbeddedTransactionBuilder';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { deepEqual } from 'assert';

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
            256,
            signedTransaction.payload.length,
        )).to.be.equal('9801508C58666C746F471538E43002B85B1CD542F9874B2861183919B' +
                       'A8787B6E8030000000000004CCCD78612DDF5CA01000A0000000000000000000000');
    });

    describe('size', () => {
        it('should return 190 for NamespaceMetadataTransaction byte size', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(1000),
                new NamespaceId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );
            expect(namespaceMetadataTransaction.size).to.be.equal(190);
            expect(Convert.hexToUint8(namespaceMetadataTransaction.serialize()).length).to.be.equal(namespaceMetadataTransaction.size);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(namespaceMetadataTransaction.maxFee.compact()).to.be.equal(380);

        const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        Object.assign(namespaceMetadataTransaction, {signer: account.publicAccount});

        const embedded = namespaceMetadataTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.key)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.NAMESPACE_METADATA.valueOf());
    });

    it('should resolve alias', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );
        const resolved = namespaceMetadataTransaction.resolveAliases();

        expect(resolved).to.be.instanceOf(NamespaceMetadataTransaction);
        deepEqual(namespaceMetadataTransaction, resolved);
    });
});
