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
import { Account } from '../../../src/model/account';
import { MessageFactory, MessageMarker, MessageType, PersistentHarvestingDelegationMessage } from '../../../src/model/message';
import { NetworkType } from '../../../src/model/network';
import { Deadline, PersistentDelegationRequestTransaction } from '../../../src/model/transaction';

describe('PersistentHarvestingDelegationMessage', () => {
    let sender: Account;
    let recipient: Account;
    let recipient_nis: Account;
    const signingPrivateKey = 'F0AB1010EFEE19EE5373719881DF5123C13E643C519655F7E97347BFF77175BF';
    const vrfPrivateKey = '800F35F1CC66C2B62CE9DD9F31003B9B3E5C7A2F381FB8952A294277A1015D83';
    const epochAdjustment = 1573430400;
    before(() => {
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108', NetworkType.PRIVATE_TEST);
        recipient = Account.createFromPrivateKey(
            'B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
            NetworkType.PRIVATE_TEST,
        );
        recipient_nis = Account.createFromPrivateKey(
            'B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
            NetworkType.TEST_NET,
        );
    });

    it('should create a PersistentHarvestingDelegation message', () => {
        const encryptedMessage = PersistentHarvestingDelegationMessage.create(
            signingPrivateKey,
            vrfPrivateKey,
            recipient.publicKey,
            NetworkType.PRIVATE_TEST,
        );
        expect(encryptedMessage.payload.length).to.be.equal(PersistentHarvestingDelegationMessage.HEX_PAYLOAD_SIZE);
        expect(encryptedMessage.type).to.be.equal(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should raise and error when not starting on Marker', () => {
        const payload =
            'E201735761802AFEDED358F099E318FEB14C367BEC682476A5B05C985C287561F2ECED84BD22C37BAEB5F56' +
            '226F8A4DF4C0E65AFD5F29B51C4A88394FD22CAE4FD4489B31D7FF025A16B66006F2F32DB5A8AED18A2A5E10' +
            '26092A7D9F3EBAFD1B614CF57FFA75C58BFA8872FC2796764F0AF9A515C095A09F3D9AA2BA41EBE043CB0CE27';

        expect(() => {
            new PersistentHarvestingDelegationMessage(payload);
        }).to.throw(Error, 'Invalid persistent harvesting delegate payload! It does not start with FE2A8061577301E2');
    });

    it('should create a PersistentHarvestingDelegation message from a DTO', () => {
        const payload =
            'FE2A8061577301E231539A87767B731A725E8F87926FDA9968701C082D2AC6CD16C6572F4F3047184D6C4A0443CC5D2565838040CC31B7EA0BA4588728110668BE960A28CAFCDC1703C234903937CCD0CDD6F11DBE7AE4C288FE2E2245BD4BE08C1F864E7FB42C4648E19CA53622AA0C2EAEDB47B8A06B157BD47FD6C230193FCC50F1F9';
        const encryptedMessage = MessageFactory.createMessageFromHex(payload);
        expect(encryptedMessage.payload).eq(payload);
        expect(encryptedMessage.payload.length).eq(PersistentHarvestingDelegationMessage.HEX_PAYLOAD_SIZE);

        const plainMessage = PersistentHarvestingDelegationMessage.decrypt(encryptedMessage, recipient.privateKey);
        expect(plainMessage).to.be.equal(signingPrivateKey + vrfPrivateKey);
    });

    it('should throw exception on createFromPayload with wrong format', () => {
        expect(() => {
            new PersistentHarvestingDelegationMessage('test transaction');
        }).to.throw(Error, 'Payload format is not valid hexadecimal string');
    });

    it('should create and decrypt message', () => {
        const encryptedMessage = PersistentHarvestingDelegationMessage.create(
            signingPrivateKey,
            vrfPrivateKey,
            recipient.publicKey,
            NetworkType.PRIVATE_TEST,
        );
        expect(encryptedMessage.payload.indexOf(MessageMarker.PersistentDelegationUnlock)).eq(0);
        expect(encryptedMessage.payload.length).eq(264);

        console.log(encryptedMessage.payload);
        const parsed = MessageFactory.createMessageFromHex(encryptedMessage.toDTO());
        expect(parsed.type).eq(MessageType.PersistentHarvestingDelegationMessage);
        expect(parsed.payload.length).eq(264);
        expect(parsed.payload).eq(encryptedMessage.payload);

        const plainMessage = PersistentHarvestingDelegationMessage.decrypt(encryptedMessage, recipient.privateKey);
        expect(plainMessage).to.be.equal(signingPrivateKey + vrfPrivateKey);
    });

    it('return decrepted message reading from message payload', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
            Deadline.create(epochAdjustment),
            signingPrivateKey,
            vrfPrivateKey,
            recipient.publicKey,
            NetworkType.PRIVATE_TEST,
        );
        const signedTransaction = tx.signWith(sender, generationHash);
        const encryptMessage = MessageFactory.createMessageFromHex(
            signedTransaction.payload.substring(320, signedTransaction.payload.length),
        );
        const plainMessage = PersistentHarvestingDelegationMessage.decrypt(encryptMessage, recipient.privateKey);
        expect(plainMessage).to.be.equal(signingPrivateKey + vrfPrivateKey);
    });

    it('should encrypt and decrypt message using NIS1 schema', () => {
        const encryptedMessage = PersistentHarvestingDelegationMessage.create(
            signingPrivateKey,
            vrfPrivateKey,
            recipient_nis.publicKey,
            NetworkType.TEST_NET,
        );
        const plainMessage = PersistentHarvestingDelegationMessage.decrypt(encryptedMessage, recipient_nis.privateKey);
        expect(plainMessage).to.be.equal(signingPrivateKey + vrfPrivateKey);
    });
});
