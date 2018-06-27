/*
 * Copyright 2018 NEM
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
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import { PublicAccount } from '../../../src/model/model';

describe('Account', () => {
    const accountInformation = {
        address: 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2',
        privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
        publicKey: 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase(),
    };

    it('should be created via private key', () => {
        const account = Account.createFromPrivateKey(accountInformation.privateKey, NetworkType.MIJIN_TEST);
        expect(account.publicKey).to.be.equal(accountInformation.publicKey);
        expect(account.privateKey).to.be.equal(accountInformation.privateKey);
        expect(account.address.plain()).to.be.equal(accountInformation.address);
    });

    it('should throw exception when the private key is not valid', () => {
        expect(() => {
            Account.createFromPrivateKey('', NetworkType.MIJIN_TEST);
        }).to.throw();
    });

    it('should generate a new account', () => {
        const account = Account.generateNewAccount(NetworkType.MIJIN_TEST);
        expect(account.publicKey).to.not.be.equal(undefined);
        expect(account.privateKey).to.not.be.equal(undefined);
        expect(account.address).to.not.be.equal(undefined);
    });

    describe('signData', () => {
        it('utf-8', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('catapult rocks!');
            expect(publicAccount.verifySignature('catapult rocks!', signed))
                .to.be.true;
        });

        it('hexa', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('0xAA');
            expect(publicAccount.verifySignature('0xAA', signed))
                .to.be.true;
        });
    });
});
