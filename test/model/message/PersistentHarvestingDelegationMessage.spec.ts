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

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { MessageType } from '../../../src/model/message/MessageType';
import {PersistentHarvestingDelegationMessage} from '../../../src/model/message/PersistentHarvestingDelegationMessage';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PersistentDelegationRequestTransaction } from '../../../src/model/transaction/PersistentDelegationRequestTransaction';

describe('PersistentHarvestingDelegationMessage', () => {

    let sender: Account;
    let recipient: Account;

    let sender_nis: Account;
    let recipient_nis: Account;
    const delegatedPrivateKey = 'F0AB1010EFEE19EE5373719881DF5123C13E643C519655F7E97347BFF77175BF';
    before(() => {
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108',
                                              NetworkType.MIJIN_TEST);
        recipient = Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
                                              NetworkType.MIJIN_TEST);

        sender_nis = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108',
                                              NetworkType.TEST_NET);
        recipient_nis = Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
                                              NetworkType.TEST_NET);
    });

    it('should create a PersistentHarvestingDelegation message', () => {
        const encryptedMessage =
            PersistentHarvestingDelegationMessage
                .create(delegatedPrivateKey, recipient.publicKey, NetworkType.MIJIN_TEST);
        expect(encryptedMessage.payload.length).to.be.equal(208);
        expect(encryptedMessage.type).to.be.equal(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should create a PersistentHarvestingDelegation message from a DTO', () => {
        const payload = 'CC71C764BFE598FC121A1816D40600FF3CE1F5C8839DF6EA01A04A630CBEC5C8A' +
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
        const encryptedMessage =
            PersistentHarvestingDelegationMessage
                .create(delegatedPrivateKey, recipient.publicKey, NetworkType.MIJIN_TEST);
        const plainMessage =
            PersistentHarvestingDelegationMessage.decrypt(encryptedMessage, recipient.privateKey, NetworkType.MIJIN_TEST);
        expect(plainMessage).to.be.equal(delegatedPrivateKey);
    });

    it('return decrepted message reading from message payload', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const tx =
            PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(),
                delegatedPrivateKey,
                recipient.publicKey,
                NetworkType.MIJIN_TEST,
            );
        const signedTransaction = tx.signWith(sender, generationHash);
        const encryptMessage =
            PersistentHarvestingDelegationMessage
                .createFromPayload(signedTransaction.payload.substring(322, signedTransaction.payload.length));
        const plainMessage =
            PersistentHarvestingDelegationMessage.decrypt(encryptMessage, recipient.privateKey, NetworkType.MIJIN_TEST);
        expect(plainMessage).to.be.equal(delegatedPrivateKey);
    });

    it('should encrypt and decrypt message using NIS1 schema', () => {
        const encryptedMessage =
            PersistentHarvestingDelegationMessage
                .create(delegatedPrivateKey, recipient_nis.publicKey, NetworkType.TEST_NET);
        const plainMessage =
            PersistentHarvestingDelegationMessage.decrypt(encryptedMessage,
                                                          recipient_nis.privateKey,
                                                          NetworkType.TEST_NET);
        expect(plainMessage).to.be.equal(delegatedPrivateKey);
    });

});
