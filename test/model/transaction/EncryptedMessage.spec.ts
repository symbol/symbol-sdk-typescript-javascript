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

import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
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
            .createFromDTO('1E4DCC2C381A0346F72346F758B5D6C1CF236B96E2E68B9B40FB7EEF7FB035F6401A1993E6F5F0B1379' +
                           '7A6593358F06C90dee57f68880931f7062ecf9ec0c0837bb583732474442db72d71255250b021');
        const plainMessage = account.decryptMessage(encryptMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
