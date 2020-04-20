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
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MultisigAccountModificationTransaction } from '../../../src/model/transaction/MultisigAccountModificationTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MultisigAccountModificationTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            2,
            1,
            [
                PublicAccount.createFromPublicKey(
                    'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST,
                ),
                PublicAccount.createFromPublicKey(
                    'B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                    NetworkType.MIJIN_TEST,
                ),
            ],
            [],
            NetworkType.MIJIN_TEST,
        );

        expect(modifyMultisigAccountTransaction.maxFee.higher).to.be.equal(0);
        expect(modifyMultisigAccountTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            2,
            1,
            [
                PublicAccount.createFromPublicKey(
                    'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST,
                ),
                PublicAccount.createFromPublicKey(
                    'B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                    NetworkType.MIJIN_TEST,
                ),
            ],
            [],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(modifyMultisigAccountTransaction.maxFee.higher).to.be.equal(0);
        expect(modifyMultisigAccountTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MultisigAccountModificationTransaction object and sign it', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            2,
            1,
            [
                PublicAccount.createFromPublicKey(
                    'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST,
                ),
                PublicAccount.createFromPublicKey(
                    'B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                    NetworkType.MIJIN_TEST,
                ),
            ],
            [],
            NetworkType.MIJIN_TEST,
        );

        expect(modifyMultisigAccountTransaction.minApprovalDelta).to.be.equal(2);
        expect(modifyMultisigAccountTransaction.minRemovalDelta).to.be.equal(1);
        expect(modifyMultisigAccountTransaction.publicKeyAdditions.length).to.be.equal(2);
        expect(modifyMultisigAccountTransaction.publicKeyAdditions[0].publicKey).to.be.equal(
            'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
        );
        expect(modifyMultisigAccountTransaction.publicKeyAdditions[1].publicKey).to.be.equal(
            'B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
        );
        expect(modifyMultisigAccountTransaction.publicKeyDeletions.length).to.be.equal(0);

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0102020000000000B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC' +
                '6EC24B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
        );
    });

    describe('size', () => {
        it('should return 168 for MultisigAccountModificationTransaction transaction byte size with 1 modification', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                1,
                1,
                [
                    PublicAccount.createFromPublicKey(
                        'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                        NetworkType.MIJIN_TEST,
                    ),
                ],
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(modifyMultisigAccountTransaction.size).to.be.equal(168);
            expect(Convert.hexToUint8(modifyMultisigAccountTransaction.serialize()).length).to.be.equal(
                modifyMultisigAccountTransaction.size,
            );
        });
    });

    it('Test set maxFee using multiplier', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            1,
            1,
            [PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.MIJIN_TEST)],
            [],
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
        expect(modifyMultisigAccountTransaction.maxFee.compact()).to.be.equal(336);

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });
});
