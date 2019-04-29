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
import {EncryptedMessage} from '../../../src/model/transaction/EncryptedMessage';
import { TestingAccount } from '../../conf/conf.spec';

describe('EncryptedMessage', () => {

    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage.createFromDTO('test transaction');
        expect(encryptedMessage.payload).to.be.equal('test transaction');
    });

    it('should return encrypted message dto', () => {;
        const encryptedMessage = account.encryptMessage('test transaction', account.publicAccount);
        const plainMessage = account.decryptMessage(encryptedMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('should create an encrypted message from a DTO and decrypt it', () => {
        const encryptMessage = EncryptedMessage
            .createFromDTO('7245170507448c53d808524221b5d157e19b06f574120a044e48f54dd8e0a4dedbf50ded7ae71' +
                           'b90b59949bb6acde81d987ee6648aae9f093b94ac7cc3e8dba0bed8fa04ba286df6b32d2d6d21cbdc4e');
        const plainMessage = account.decryptMessage(encryptMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
