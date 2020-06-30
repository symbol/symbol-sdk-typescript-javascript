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
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MultisigAccountModificationTransaction } from '../../../src/model/transaction/MultisigAccountModificationTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { Address } from '../../../src/model/account/Address';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';

describe('MultisigAccountModificationTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const address1 = Address.createFromPublicKey(
        'B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
        NetworkType.MIJIN_TEST,
    );
    const address2 = Address.createFromPublicKey(
        'B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
        NetworkType.MIJIN_TEST,
    );
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            2,
            1,
            [address1, address2],
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
            [address1, address2],
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
            [address1, address2],
            [],
            NetworkType.MIJIN_TEST,
        );

        expect(modifyMultisigAccountTransaction.minApprovalDelta).to.be.equal(2);
        expect(modifyMultisigAccountTransaction.minRemovalDelta).to.be.equal(1);
        expect(modifyMultisigAccountTransaction.addressAdditions.length).to.be.equal(2);
        expect(modifyMultisigAccountTransaction.addressAdditions[0].equals(address1)).to.be.true;
        expect(modifyMultisigAccountTransaction.addressAdditions[1].equals(address2)).to.be.true;
        expect(modifyMultisigAccountTransaction.addressDeletions.length).to.be.equal(0);

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0102020000000000909FC4844A5206CFA44603EFA1FFC76FE9B0564D967FFE0D906B4CB49ECF224FC4F0F4FCA2F6034305B3A47B0BB90303',
        );
    });

    describe('size', () => {
        it('should return 160 for MultisigAccountModificationTransaction transaction byte size with 1 modification', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                1,
                1,
                [address1],
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(modifyMultisigAccountTransaction.size).to.be.equal(160);
            expect(Convert.hexToUint8(modifyMultisigAccountTransaction.serialize()).length).to.be.equal(
                modifyMultisigAccountTransaction.size,
            );
        });
        it('should set payload size', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                1,
                1,
                [address1],
                [],
                NetworkType.MIJIN_TEST,
            );
            expect(modifyMultisigAccountTransaction.size).to.be.equal(160);
            expect(Convert.hexToUint8(modifyMultisigAccountTransaction.serialize()).length).to.be.equal(
                modifyMultisigAccountTransaction.size,
            );
            expect(modifyMultisigAccountTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            1,
            1,
            [address1],
            [],
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
        expect(modifyMultisigAccountTransaction.maxFee.compact()).to.be.equal(320);

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const txAddition = MultisigAccountModificationTransaction.create(Deadline.create(), 1, 1, [address1], [], NetworkType.MIJIN_TEST);

        let canNotify = txAddition.shouldNotifyAccount(address1, []);
        expect(canNotify).to.be.true;

        canNotify = txAddition.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), []);
        expect(canNotify).to.be.false;

        Object.assign(txAddition, { signer: account.publicAccount });
        expect(txAddition.shouldNotifyAccount(account.address, [])).to.be.true;

        const txDeletion = MultisigAccountModificationTransaction.create(Deadline.create(), 1, 1, [], [address1], NetworkType.MIJIN_TEST);

        let canNotifyDeletion = txDeletion.shouldNotifyAccount(address1, []);
        expect(canNotifyDeletion).to.be.true;

        canNotifyDeletion = txDeletion.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), []);
        expect(canNotifyDeletion).to.be.false;

        Object.assign(txDeletion, { signer: account.publicAccount });
        expect(txDeletion.shouldNotifyAccount(account.address, [])).to.be.true;
    });

    it('Notify Account with alias', () => {
        const alias = new NamespaceId('test');
        const wrongAlias = new NamespaceId('wrong');
        const txAddition = MultisigAccountModificationTransaction.create(Deadline.create(), 1, 1, [alias], [], NetworkType.MIJIN_TEST);

        let canNotify = txAddition.shouldNotifyAccount(address1, [alias]);
        expect(canNotify).to.be.true;

        canNotify = txAddition.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), [wrongAlias]);
        expect(canNotify).to.be.false;

        canNotify = txAddition.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), [alias]);
        expect(canNotify).to.be.true;

        Object.assign(txAddition, { signer: account.publicAccount });
        expect(txAddition.shouldNotifyAccount(account.address, [])).to.be.true;

        const txDeletion = MultisigAccountModificationTransaction.create(Deadline.create(), 1, 1, [], [alias], NetworkType.MIJIN_TEST);

        let canNotifyDeletion = txDeletion.shouldNotifyAccount(address1, [alias]);
        expect(canNotifyDeletion).to.be.true;

        canNotifyDeletion = txDeletion.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), [
            wrongAlias,
        ]);
        expect(canNotifyDeletion).to.be.false;

        canNotifyDeletion = txDeletion.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'), [
            alias,
        ]);
        expect(canNotifyDeletion).to.be.true;

        Object.assign(txDeletion, { signer: account.publicAccount });
        expect(txDeletion.shouldNotifyAccount(account.address, [])).to.be.true;
    });
});
