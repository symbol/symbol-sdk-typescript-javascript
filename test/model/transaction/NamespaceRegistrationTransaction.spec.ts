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

import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { NamespaceRegistrationTransaction } from '../../../src/model/transaction/NamespaceRegistrationTransaction';
import { TestingAccount } from '../../conf/conf.spec';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';

describe('NamespaceRegistrationTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            BigInt(1000),
            NetworkType.MIJIN_TEST,
        );

        expect(registerNamespaceTransaction.maxFee).to.be.equal(BigInt(0));
    });

    it('should filled maxFee override transaction maxFee', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            BigInt(1000),
            NetworkType.MIJIN_TEST,
            BigInt(1),
        );

        expect(registerNamespaceTransaction.maxFee).to.be.equal(BigInt(1));
    });

    it('should createComplete an root NamespaceRegistrationTransaction object and sign it', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            BigInt(1000),
            NetworkType.MIJIN_TEST,
        );

        expect(registerNamespaceTransaction.duration).to.be.equal(BigInt(1000));

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365');

    });

    it('should createComplete an sub NamespaceRegistrationTransaction object and sign it', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('4DF55E7F6D8FB7FF924207DF2CA1BBF30113726F6F742D746573742D6E616D657370616365');

    });

    it('should createComplete an sub NamespaceRegistrationTransaction object and sign it - ParentId', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(),
            'root-test-namespace',
            new NamespaceId(BigIntUtilities.HexToBigInt('84B3552D375FFA4B')),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('4BFA5F372D55B384CFCBE72D994BE69B0113726F6F742D746573742D6E616D657370616365');
    });

    describe('size', () => {
        it('should return 165 for NamespaceRegistrationTransaction with name of 19 bytes', () => {
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                'root-test-namespace',
                BigInt(1000),
                NetworkType.MIJIN_TEST,
            );
            expect(registerNamespaceTransaction.size).to.be.equal(165);
            expect(Convert.hexToUint8(registerNamespaceTransaction.serialize()).length).to.be.equal(registerNamespaceTransaction.size);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            BigInt(1000),
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(registerNamespaceTransaction.maxFee).to.be.equal(BigInt(330));

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });
});
