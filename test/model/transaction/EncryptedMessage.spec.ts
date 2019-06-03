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
import { NetworkType } from '../../../src/model/model';
import {EncryptedMessage} from '../../../src/model/transaction/EncryptedMessage';

describe('EncryptedMessage', () => {

    let sender: Account;
    let recipient: Account;

    before(() => {
        // Catapult-server-bootstrap generated account
        sender = Account.createFromPrivateKey('2602F4236B199B3DF762B2AAB46FC3B77D8DDB214F0B62538D3827576C46C108',
                                              NetworkType.MIJIN_TEST);
        recipient = Account.createFromPrivateKey('B72F2950498111BADF276D6D9D5E345F04E0D5C9B8342DA983C3395B4CF18F08',
                                              NetworkType.MIJIN_TEST);
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

    it('should return empty string if given payload is not valid', () => {
        // message payload generated from catapult-server
        const encryptedMessage = sender.encryptMessage('test transaction', recipient.publicAccount);
        const encryptMessage = EncryptedMessage
            .createFromPayload('4132343743314236463730363143314331453730434334373744323831464132343731364343443635313334354' +
                           '33433383842364546413532364139354144463043354431424545463939373044314337384537413837353435363938424' +
                           '63336413939413631373630313936324238324246453435454241353037303236424144313032394141364636383242343' +
                           '339334142453843383931343143413938');
        const plainMessage = recipient.decryptMessage(encryptMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('');
    });
});
