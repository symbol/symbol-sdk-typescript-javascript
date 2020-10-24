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
import { Account } from '../../../src/model/account/Account';
import { EncryptedMessage } from '../../../src/model/message/EncryptedMessage';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { NetworkCurrencyLocal } from '../../../src/model/mosaic/NetworkCurrencyLocal';

describe('EncryptedMessage', () => {
    let sender: Account;
    let recipient: Account;

    let sender_nis: Account;
    let recipient_nis: Account;
    const epochAdjustment = 1573430400;
    before(() => {
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', NetworkType.PRIVATE_TEST);
        recipient = Account.createFromPrivateKey(
            'B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
            NetworkType.PRIVATE_TEST,
        );

        sender_nis = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', NetworkType.TEST_NET);
        recipient_nis = Account.createFromPrivateKey(
            'B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
            NetworkType.TEST_NET,
        );
    });

    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage.createFromPayload('test transaction');
        expect(encryptedMessage.payload).not.to.be.equal('test transaction'); // As DTO returns Hexed payload
    });

    it('should return encrypted message dto', () => {
        const encryptedMessage = sender.encryptMessage('test transaction', recipient.publicAccount);
        const plainMessage = recipient.decryptMessage(encryptedMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('should decrypt message from raw encrypted message payload', () => {
        const encryptedMessage = sender.encryptMessage('Testing simple transfer', recipient.publicAccount);
        const payload = encryptedMessage.payload;
        const plainMessage = recipient.decryptMessage(new EncryptedMessage(payload), sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should return decrepted message reading from message payload', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            recipient.address,
            [NetworkCurrencyLocal.createAbsolute(1)],
            sender.encryptMessage('Testing simple transfer', recipient.publicAccount),
            NetworkType.PRIVATE_TEST,
        );
        const signedTransaction = transferTransaction.signWith(sender, generationHash);
        const encryptMessage = EncryptedMessage.createFromPayload(
            signedTransaction.payload.substring(354, signedTransaction.payload.length),
        );
        const plainMessage = recipient.decryptMessage(encryptMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });

    it('should encrypt and decrypt message using NIS1 schema', () => {
        const encryptedMessage = sender_nis.encryptMessage('Testing simple transfer', recipient_nis.publicAccount);
        const payload = encryptedMessage.payload;
        const plainMessage = recipient_nis.decryptMessage(new EncryptedMessage(payload), sender_nis.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });
});
