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
import { Convert, MessageType } from '../../../src';
import { Account } from '../../../src/model/account';
import { EncryptedMessage } from '../../../src/model/message';
import { NetworkType } from '../../../src/model/network';
import { Deadline, TransferTransaction } from '../../../src/model/transaction';
import { NetworkCurrencyLocal } from '../mosaic/Currency.spec';

describe('EncryptedMessage', () => {
    let sender: Account;
    let recipient: Account;

    let sender_nis: Account;
    let recipient_nis: Account;
    const epochAdjustment = 1573430400;
    before(() => {
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', NetworkType.TEST_NET);
        recipient = Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08', NetworkType.TEST_NET);

        sender_nis = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', NetworkType.TEST_NET);
        recipient_nis = Account.createFromPrivateKey(
            'B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
            NetworkType.TEST_NET,
        );
    });

    it('constructor', () => {
        const message = EncryptedMessage.createFromBuilder(Convert.hexToUint8('013132333234353536'));
        console.log(message.payload);
    });
    it('should return encrypted message dto', () => {
        const plainMessageText = 'test transaction';
        const encryptedMessage = sender.encryptMessage(plainMessageText, recipient.publicAccount);
        expect(encryptedMessage.toBuffer()).deep.eq(Convert.hexToUint8(encryptedMessage.toDTO()));
        const plainMessage = recipient.decryptMessage(encryptedMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal(plainMessageText);
    });

    it('should decrypt message from raw encrypted message payload', () => {
        const encryptedMessage = sender.encryptMessage('Testing simple transfer', recipient.publicAccount);
        const payload = encryptedMessage.payload;
        const plainMessage = recipient.decryptMessage(EncryptedMessage.createFromPayload(payload), sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should return decrepted message reading from message payload', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const originalEncryptedMessage = sender.encryptMessage('Testing simple transfer', recipient.publicAccount);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            recipient.address,
            [NetworkCurrencyLocal.createAbsolute(1)],
            originalEncryptedMessage,
            NetworkType.TEST_NET,
        );
        const signedTransaction = transferTransaction.signWith(sender, generationHash);
        const encryptMessage = (TransferTransaction.createFromPayload(signedTransaction.payload) as TransferTransaction).message;
        expect(encryptMessage).deep.equal(originalEncryptedMessage);
        expect(encryptMessage.type).equal(MessageType.EncryptedMessage);
        const plainMessage = recipient.decryptMessage(encryptMessage as EncryptedMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should encrypt and decrypt message using NIS1 schema', () => {
        const encryptedMessage = sender_nis.encryptMessage('Testing simple transfer', recipient_nis.publicAccount);
        const payload = encryptedMessage.payload;
        const plainMessage = recipient_nis.decryptMessage(EncryptedMessage.createFromPayload(payload), sender_nis.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should be the same after deserializing ', () => {
        const encryptedMessage1 = EncryptedMessage.create(
            'Testing simple transfer',
            recipient_nis.publicAccount,
            sender_nis.privateKey,
            Buffer.alloc(12),
        );
        const encryptedMessage2 = EncryptedMessage.create(
            'Testing simple transfer',
            recipient_nis.publicAccount,
            sender_nis.privateKey,
            Buffer.alloc(12),
        );
        expect(encryptedMessage1).to.be.deep.equal(encryptedMessage2);
        expect(encryptedMessage1.toDTO()).to.be.deep.equal(
            '01353834343746314432354132363741454341384344443935313035334135303730303030303030303030303030303030303030303030303038324546344339383231424637353130414237334346434337314641333339424344464235344538393432363941',
        );
        expect(encryptedMessage1.payload).to.be.deep.equal(
            '58447F1D25A267AECA8CDD951053A50700000000000000000000000082EF4C9821BF7510AB73CFCC71FA339BCDFB54E894269A',
        );
        expect(encryptedMessage1).to.be.deep.equal(EncryptedMessage.createFromPayload(encryptedMessage1.payload));
        expect(encryptedMessage1).to.be.deep.equal(EncryptedMessage.createFromBuilder(encryptedMessage1.toBuffer()));
    });

    it('createBuffer and getPayload', () => {
        const payload = 'Some text';
        const buffer = EncryptedMessage.createBuffer(payload);
        expect(Convert.uint8ToHex(buffer)).deep.equal('01536F6D652074657874');
        expect(EncryptedMessage.getPayload(buffer)).be.eq(payload);
    });
});
