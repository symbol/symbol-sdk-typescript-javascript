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
import { MultisigAccount, TestingAccount } from '../../conf/conf.spec';

describe('EncryptedMessage', () => {

    let account: Account;
    let recipient: Account;

    before(() => {
        account = TestingAccount;
        recipient = MultisigAccount;
    });

    it('should create a encrypted message from a DTO', () => {
        const encryptedMessage = EncryptedMessage.createFromDTO('test transaction');
        expect(encryptedMessage.payload).to.be.equal('test transaction');
    });

    it('should return encrypted message dto', () => {
        const encryptedMessage = account.encryptMessage('test transaction', recipient.publicAccount);
        const plainMessage = recipient.decryptMessage(encryptedMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });

    it('should create an encrypted message from a DTO and decrypt it', () => {
        const encryptMessage = EncryptedMessage
            .createFromDTO('A3216D046C7147C8E848EF3F594725EA6F4EA2745829CA1021182E2FFA019C30D3E369F6AD236658A4' +
                           '0BF5C6C2855DAC5C5B22255DBC231374CEA2124E44FA0629913747E31D87964320237B58B3C377');
        const plainMessage = recipient.decryptMessage(encryptMessage, account.publicAccount);
        expect(plainMessage.payload).to.be.equal('test transaction');
    });
});
