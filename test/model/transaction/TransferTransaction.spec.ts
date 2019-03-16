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

import { expect } from 'chai';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { Recipient } from '../../../src/model/account/Recipient';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { NetworkCurrencyMosaic } from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PlainMessage } from '../../../src/model/transaction/PlainMessage';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { TestingAccount } from '../../conf/conf.spec';

describe('TransferTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an TransferTransaction object and sign it without mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipient).to.be.instanceof(Address);
        expect((transferTransaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
    });

    it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(Address);
        expect((transferTransaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal(
            '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });

    it('should createComplete an TransferTransaction object with NamespaceId recipient', () => {
        const addressAlias = new NamespaceId('nem.owner');
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            addressAlias,
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(NamespaceId);
        expect(transferTransaction.recipient).to.be.equal(addressAlias);
        expect((transferTransaction.recipient as NamespaceId).toHex()).to.be.equal(addressAlias.toHex());

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('9151776168D24257D8000000000000000000000000000000000D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });

    it('should createComplete an TransferTransaction object with Recipient given address recipient', () => {
        const addressRecipient = new Recipient(Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'));
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            addressRecipient,
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(Recipient);

        const address = ((transferTransaction.recipient as Recipient).value as Address);
        expect(address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });

    it('should createComplete an TransferTransaction object with Recipient given namespaceId recipient', () => {
        const namespaceId = new NamespaceId('nem.owner');
        const namespaceRecipient = new Recipient(namespaceId);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            namespaceRecipient,
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(Recipient);

        const actualNamespaceId = ((transferTransaction.recipient as Recipient).value as NamespaceId);
        expect(actualNamespaceId.toHex()).to.be.equal(namespaceId.toHex());

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('9151776168D24257D8000000000000000000000000000000000D000100746573742D6D657373616765' +
            '44B262C46CEABB8500E1F50500000000');
    });

    it('should format TransferTransaction payload with 25 bytes binary address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with Address recipient
        expect(transferTransaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            290,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });

    it('should format TransferTransaction payload with 8 bytes binary namespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            new NamespaceId('nem.owner'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with NamespaceId recipient
        expect(transferTransaction.recipientToString()).to.be.equal('d85742d268617751');

        const signedTransaction = transferTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            290,
        )).to.be.equal('9151776168D24257D800000000000000000000000000000000');
    });
});
