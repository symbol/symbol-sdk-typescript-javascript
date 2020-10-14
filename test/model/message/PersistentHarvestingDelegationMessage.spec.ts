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
import { MessageType } from '../../../src/model/message/MessageType';
import { PersistentHarvestingDelegationMessage } from '../../../src/model/message/PersistentHarvestingDelegationMessage';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PersistentDelegationRequestTransaction } from '../../../src/model/transaction/PersistentDelegationRequestTransaction';

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
        expect(encryptedMessage.payload.length).to.be.equal(264);
        expect(encryptedMessage.type).to.be.equal(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should create a PersistentHarvestingDelegation message from a DTO', () => {
        const payload =
            'CC71C764BFE598FC121A1816D40600FF3CE1F5C8839DF6EA01A04A630CBEC5C8A' +
            'C121C890E95BBDC67E50AD37E2442279D1BA2328FB7A1781C59D2F414AEFCA288CD' +
            '7B2D9F38D11C186CBD33869F2BB6A9F617A4696E4841628F1F396478BDDD0046BA264A1820';
        const msgTypeHex = MessageType.PersistentHarvestingDelegationMessage.toString(16).toUpperCase();
        const encryptedMessage = PersistentHarvestingDelegationMessage.createFromPayload(payload);
        expect(encryptedMessage.payload.substring(2)).to.be.equal(payload);
        expect(encryptedMessage.payload.substring(0, 2)).to.be.equal(msgTypeHex);
    });

    it('should throw exception on createFromPayload with wrong format', () => {
        expect(() => {
            PersistentHarvestingDelegationMessage.createFromPayload('test transaction');
        }).to.throw(Error, 'Payload format is not valid hexadecimal string');
    });

    it('should create and decrypt message', () => {
        const encryptedMessage = PersistentHarvestingDelegationMessage.create(
            signingPrivateKey,
            vrfPrivateKey,
            recipient.publicKey,
            NetworkType.PRIVATE_TEST,
        );
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
        const encryptMessage = PersistentHarvestingDelegationMessage.createFromPayload(
            signedTransaction.payload.substring(322, signedTransaction.payload.length),
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
