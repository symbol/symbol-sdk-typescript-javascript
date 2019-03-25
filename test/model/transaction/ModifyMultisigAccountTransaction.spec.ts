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
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {ModifyMultisigAccountTransaction} from '../../../src/model/transaction/ModifyMultisigAccountTransaction';
import {MultisigCosignatoryModification} from '../../../src/model/transaction/MultisigCosignatoryModification';
import {MultisigCosignatoryModificationType} from '../../../src/model/transaction/MultisigCosignatoryModificationType';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('ModifyMultisigAccountTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            ),
                new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                        NetworkType.MIJIN_TEST),
                )],
            NetworkType.MIJIN_TEST,
        );

        expect(modifyMultisigAccountTransaction.maxFee.higher).to.be.equal(0);
        expect(modifyMultisigAccountTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            ),
                new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                        NetworkType.MIJIN_TEST),
                )],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(modifyMultisigAccountTransaction.maxFee.higher).to.be.equal(0);
        expect(modifyMultisigAccountTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an ModifyMultisigAccountTransaction object and sign it', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            ),
                new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                        NetworkType.MIJIN_TEST),
                )],
            NetworkType.MIJIN_TEST,
        );

        expect(modifyMultisigAccountTransaction.minApprovalDelta)
            .to.be.equal(2);
        expect(modifyMultisigAccountTransaction.minRemovalDelta)
            .to.be.equal(1);
        expect(modifyMultisigAccountTransaction.modifications.length)
            .to.be.equal(2);
        expect(modifyMultisigAccountTransaction.modifications[0].type)
            .to.be.equal(MultisigCosignatoryModificationType.Add);
        expect(modifyMultisigAccountTransaction.modifications[0].cosignatoryPublicAccount.publicKey)
            .to.be.equal('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24');
        expect(modifyMultisigAccountTransaction.modifications[1].type)
            .to.be.equal(MultisigCosignatoryModificationType.Add);
        expect(modifyMultisigAccountTransaction.modifications[1].cosignatoryPublicAccount.publicKey)
            .to.be.equal('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4');

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('01020200B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC' +
            '6EC2400B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4');

    });

    describe('size', () => {
        it('should return 156 for ModifyMultisigAccountTransaction transaction byte size with 1 modification', () => {
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                1,
                1,
                [new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                        NetworkType.MIJIN_TEST),
                )],
                NetworkType.MIJIN_TEST,
            );
            expect(modifyMultisigAccountTransaction.size).to.be.equal(156);
        });
    });
});
