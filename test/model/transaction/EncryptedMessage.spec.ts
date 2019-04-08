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


describe('EncryptedMessage', () => {

    const accountInformation = {
        address: 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2',
        privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
        publicKey: 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase(),
    };
    let recipientPublicAccount:PublicAccount;

    before(() => {
        recipientPublicAccount = PublicAccount.createFromPublicKey(accountInformation.publicKey,NetworkType.MIJIN_TEST);
    });

    it("should create a encrypted message from a DTO", () => {
        const encryptedMessage = EncryptedMessage.createFromDTO("test transaction");
        expect(encryptedMessage.payload).to.be.equal("test transaction");
    });

    it("should return encrypted message dto", () => {
        const account = Account.createFromPrivateKey(accountInformation.privateKey,NetworkType.MIJIN_TEST);
        const publicAccount = PublicAccount.createFromPublicKey(account.publicKey,NetworkType.MIJIN_TEST);
        const encryptedMessage = account.encryptMessage("test transaction", publicAccount);
        const plainMessage = account.decryptMessage(encryptedMessage, publicAccount);
        expect(plainMessage.payload).to.be.equal("test transaction");
    });

    it("should create an encrypted message from a DTO and decrypt it", () => {
        const account = Account.createFromPrivateKey(accountInformation.privateKey,NetworkType.MIJIN_TEST);
        const publicAccount = PublicAccount.createFromPublicKey("0414fe7647ec008e533aac98a4bf1c5fbf1d236c75b81fdadf1f5d1042fdd2ff",NetworkType.MIJIN_TEST);
        const encryptMessage = EncryptedMessage.createFromDTO("02bb332c0fdd445455117882b2bec5e49f5713860d6b34650d0f769159d021a27518ea03539af8913231b9f80f600daae9291bb100a6d32e36b52a6c457fea287ca9942a32368618fe1fd0c185dbf834");
        const plainMessage = account.decryptMessage(encryptMessage, publicAccount);
        expect(plainMessage.payload).to.be.equal("test transaction");
    });
});
