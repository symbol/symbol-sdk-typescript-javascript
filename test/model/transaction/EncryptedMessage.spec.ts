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
        const encryptMessage = EncryptedMessage
            .createFromPayload('3131313842393038373141353141363431453630414537413636314638454645463' +
                    '946383431364646344336304536324443304235303943394242433039364230383343363438374' +
                    '137364239433434314433303932363942414536434339364230423339454430303233453236333' +
                    '8373531414345313132443732353430344341374632353634324642383230433744373633413434313132323833414639');
        const plainMessage = recipient.decryptMessage(encryptMessage, sender.publicAccount);
        expect(plainMessage.payload).to.be.equal('Testing simple transfer');
    });
});
