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
import { TransactionInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { TransactionMapping } from '../../../src/core/utils';
import { CreateTransactionFromPayload } from '../../../src/infrastructure/transaction';
import { PersistentHarvestingDelegationMessage, UInt64 } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { EmptyMessage, MessageMarker, MessageType, PlainMessage } from '../../../src/model/message';
import { Mosaic, MosaicId } from '../../../src/model/mosaic';
import { NamespaceId } from '../../../src/model/namespace';
import { NetworkType } from '../../../src/model/network';
import { ReceiptSource, ResolutionEntry, ResolutionStatement, ResolutionType, Statement } from '../../../src/model/receipt';
import { AggregateTransaction, Deadline, TransactionInfo, TransferTransaction } from '../../../src/model/transaction';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';
import { NetworkCurrencyLocal } from '../mosaic/Currency.spec';

describe('TransferTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const delegatedPrivateKey = '8A78C9E9B0E59D0F74C0D47AB29FBD523C706293A3FA9CD9FE0EEB2C10EA924A';
    const vrfPrivateKey = '800F35F1CC66C2B62CE9DD9F31003B9B3E5C7A2F381FB8952A294277A1015D83';
    const recipientPublicKey = '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F';
    const messageMarker = MessageMarker.PersistentDelegationUnlock;
    let statement: Statement;
    const unresolvedAddress = new NamespaceId('address');
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const mosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const epochAdjustment = 1573430400;
    const testAddress = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

    before(() => {
        account = TestingAccount;
    });
    before(() => {
        account = TestingAccount;
        statement = new Statement(
            [],
            [
                new ResolutionStatement(ResolutionType.Address, UInt64.fromUint(2), unresolvedAddress, [
                    new ResolutionEntry(account.address, new ReceiptSource(1, 0)),
                ]),
            ],
            [
                new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId, [
                    new ResolutionEntry(mosaicId, new ReceiptSource(1, 0)),
                ]),
            ],
        );
    });

    it('should default maxFee field be set to 0', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(transferTransaction.maxFee.higher).to.be.equal(0);
        expect(transferTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            PlainMessage.create('test-message'),
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(transferTransaction.maxFee.higher).to.be.equal(0);
        expect(transferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an TransferTransaction object and sign it without mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760D0000000000000000746573742D6D657373616765',
        );
    });

    it('should createComplete an TransferTransaction object with empty message', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            EmptyMessage,
            TestNetworkType,
        );

        expect(transferTransaction.message.payload).to.be.equal('');
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760000000000000000',
        );
    });

    it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760D0001000000000044B262C46CEABB8500E1F' +
                '5050000000000746573742D6D657373616765',
        );
    });

    it('should createComplete an TransferTransaction object with NamespaceId recipientAddress', () => {
        const addressAlias = new NamespaceId('nem.owner');
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            addressAlias,
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(NamespaceId);
        expect(transferTransaction.recipientAddress).to.be.equal(addressAlias);
        expect((transferTransaction.recipientAddress as NamespaceId).toHex()).to.be.equal(addressAlias.toHex());

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9951776168D24257D80000000000000000000000000000000D0001000000000044B262C46CEABB8500E1' +
                'F5050000000000746573742D6D657373616765',
        );
    });

    it('should format TransferTransaction payload with 24 bytes binary address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        // test recipientToString with Address recipient
        expect(transferTransaction.recipientToString()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, 306)).to.be.equal('9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760D');
    });

    it('should format TransferTransaction payload with 8 bytes binary namespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            new NamespaceId('nem.owner'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        // test recipientToString with NamespaceId recipient
        expect(transferTransaction.recipientToString()).to.be.equal('D85742D268617751');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, 306)).to.be.equal('9951776168D24257D80000000000000000000000000000000D');
    });

    describe('size', () => {
        it('should return 180 for TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(epochAdjustment),
                testAddress,
                [NetworkCurrencyLocal.createRelative(100)],
                PlainMessage.create('NEM'),
                TestNetworkType,
            );
            expect(Convert.hexToUint8(transaction.serialize()).length).to.be.equal(transaction.size);
            expect(transaction.size).to.be.equal(180);
        });

        it('should set payloadsize', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(epochAdjustment),
                testAddress,
                [NetworkCurrencyLocal.createRelative(100)],
                PlainMessage.create('NEM'),
                TestNetworkType,
            );
            expect(Convert.hexToUint8(transaction.serialize()).length).to.be.equal(transaction.size);
            expect(transaction.size).to.be.equal(180);
            expect(transaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('should create TransferTransaction and sign using catbuffer-typescript', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(transferTransaction.message.payload).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760D0001000000000044B262C46CEABB8500E1F' +
                '5050000000000746573742D6D657373616765',
        );
    });

    it('should create Transafer transaction for persistent harvesting delegation request transaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
            TestNetworkType,
        );

        expect(transferTransaction.message.type).to.be.equal(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should createComplete an persistentDelegationRequestTransaction object and sign it', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [],
            PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
            TestNetworkType,
        );
        expect(transferTransaction.message.payload.length).to.be.equal(248 + messageMarker.length);
        expect(transferTransaction.message.payload.includes(messageMarker)).to.be.true;
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipientAddress).to.be.instanceof(Address);
        expect((transferTransaction.recipientAddress as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length).includes(transferTransaction.message.payload)).to
            .be.true;
    });

    it('should throw exception with mosaic provided when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(epochAdjustment),
                testAddress,
                [NetworkCurrencyLocal.createRelative(100)],
                PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
                TestNetworkType,
            );
        }).to.throw(Error, 'PersistentDelegationRequestTransaction should be created without Mosaic');
    });

    it('should throw exception with invalid message when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(epochAdjustment),
                testAddress,
                [NetworkCurrencyLocal.createRelative(100)],
                PersistentHarvestingDelegationMessage.create('abc', vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
                TestNetworkType,
            );
        }).to.throw();
    });
    it('should load message with persistent message delegate', () => {
        const messageHex =
            'FE2A8061577301E29FB4BD2BA099AFA82DDB0212080CF649F0CB0FADAD7BA4CC04BE51E40A4EF0A27B8E2BEAB595F4075BB5A6A481835F3A6E4BBA63091A5866D90D2B7ACBBF158E51FE074619C4B0FF0C4AFEE1AE9A4D83A5A7A156C91CCA3A319D3279A64A63491E19656F7211760BB36EF6B3263C03837CE00E84FD82B32B721120DE';
        const payload: TransactionInfoDTO = {
            meta: {
                height: '108907',
                hash: '9661088F22C2DC72E76EE2B0F07BFC0D8E98EEE0CC8AE274362EDBB44F164F16',
                merkleComponentHash: '9661088F22C2DC72E76EE2B0F07BFC0D8E98EEE0CC8AE274362EDBB44F164F16',
                index: 0,
            },
            transaction: {
                size: 292,
                signature:
                    '494A6AF4CDA3C8B5ED0061F561F65EFCBF911BC5179B120440A753345B209F380CE3417D40B773D755746C5B5DACC2F0C78B6A0EAC093CE96CBA18E45380B50C',
                signerPublicKey: '60FAE3A39D580BB5118686569D159E3F2B991504D3ED0A304C3B7DA5FCCD0353',
                version: 1,
                network: 152,
                type: 16724,
                maxFee: '20000000',
                deadline: '30905923815',
                recipientAddress: '98BE002792600453CF3A23F9894BDA172CE4EFA7C6F3C109',
                message: messageHex,
                mosaics: [],
            },
            id: '5FA01EB485AC1F1E51EAA6BF',
        };

        const transaction = TransactionMapping.createFromDTO(payload);
        const transferTransaction = transaction as TransferTransaction;
        expect(transferTransaction.message.payload).eq(messageHex);
        expect(transferTransaction.message.type).eq(MessageType.PersistentHarvestingDelegationMessage);
    });

    it('should throw exception with invalid private key when creating persistentDelegationRequestTransaction', () => {
        expect(() => {
            TransferTransaction.create(
                Deadline.create(epochAdjustment),
                testAddress,
                [NetworkCurrencyLocal.createRelative(100)],
                PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, vrfPrivateKey, recipientPublicKey, NetworkType.TEST_NET),
                TestNetworkType,
            );
        }).to.throw();
    });

    it('should sort the Mosaic array', () => {
        const mosaics = [
            new Mosaic(new MosaicId(UInt64.fromUint(200).toDTO()), UInt64.fromUint(0)),
            new Mosaic(new MosaicId(UInt64.fromUint(100).toDTO()), UInt64.fromUint(0)),
        ];

        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            mosaics,
            PlainMessage.create('NEM'),
            TestNetworkType,
        );

        expect(transferTransaction.mosaics[0].id.id.compact()).to.be.equal(200);
        expect(transferTransaction.mosaics[1].id.id.compact()).to.be.equal(100);

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(320, 384)).to.be.equal(
            '64000000000000000000000000000000C8000000000000000000000000000000',
        );

        const sorted = CreateTransactionFromPayload(signedTransaction.payload) as TransferTransaction;
        expect(sorted.mosaics[0].id.id.compact()).to.be.equal(100);
        expect(sorted.mosaics[1].id.id.compact()).to.be.equal(200);
    });

    it('should sort the Mosaic array - using Hex MosaicId', () => {
        const mosaics = [
            new Mosaic(new MosaicId('D525AD41D95FCF29'), UInt64.fromUint(5)),
            new Mosaic(new MosaicId('77A1969932D987D7'), UInt64.fromUint(6)),
            new Mosaic(new MosaicId('67F2B76F28BD36BA'), UInt64.fromUint(10)),
        ];

        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            mosaics,
            PlainMessage.create('NEM'),
            TestNetworkType,
        );

        expect(transferTransaction.mosaics[0].id.toHex()).to.be.equal('D525AD41D95FCF29');
        expect(transferTransaction.mosaics[1].id.toHex()).to.be.equal('77A1969932D987D7');
        expect(transferTransaction.mosaics[2].id.toHex()).to.be.equal('67F2B76F28BD36BA');

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        const sorted = CreateTransactionFromPayload(signedTransaction.payload) as TransferTransaction;
        expect(sorted.mosaics[0].id.toHex()).to.be.equal('67F2B76F28BD36BA');
        expect(sorted.mosaics[1].id.toHex()).to.be.equal('77A1969932D987D7');
        expect(sorted.mosaics[2].id.toHex()).to.be.equal('D525AD41D95FCF29');
    });

    it('Test Serialization and Deserialization Using namespaceIds', () => {
        const namespaceId = new NamespaceId('testaccount2');
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('1'),
            namespaceId,
            [NetworkCurrencyLocal.createAbsolute(1)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );
        const payload = transferTransaction.serialize();
        const newTransaction = CreateTransactionFromPayload(payload) as TransferTransaction;
        const newPayload = newTransaction.serialize();
        expect(newPayload).to.be.equal(payload);
        expect(newTransaction.recipientToString()).to.be.equal(transferTransaction.recipientToString());
    });

    it('Test set maxFee using multiplier', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [NetworkCurrencyLocal.createAbsolute(1)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        ).setMaxFee(2);
        expect(transferTransaction.maxFee.compact()).to.be.equal(378);

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test set maxFee using multiplier to throw', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            testAddress,
            [NetworkCurrencyLocal.createAbsolute(1)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );

        expect(() => {
            AggregateTransaction.createComplete(
                Deadline.create(epochAdjustment),
                [transferTransaction.toAggregate(account.publicAccount)],
                TestNetworkType,
                [],
            ).setMaxFee(2);
        }).to.throw();
    });

    it('Test resolveAlias can resolve', () => {
        const transferTransaction = new TransferTransaction(
            TestNetworkType,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test'),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(transferTransaction.recipientAddress instanceof Address).to.be.true;
        expect(transferTransaction.mosaics[0].id instanceof MosaicId).to.be.true;
        expect((transferTransaction.recipientAddress as Address).equals(account.address)).to.be.true;
        expect((transferTransaction.mosaics[0].id as MosaicId).equals(mosaicId)).to.be.true;

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const address = testAddress;
        const tx = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            address,
            [NetworkCurrencyLocal.createAbsolute(1)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        );
        let canNotify = tx.shouldNotifyAccount(address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });

    it('Notify Account with alias', () => {
        const namespaceId = new NamespaceId('test');
        const canNotify = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            namespaceId,
            [NetworkCurrencyLocal.createAbsolute(1)],
            PlainMessage.create('test-message'),
            TestNetworkType,
        ).shouldNotifyAccount(namespaceId);
        expect(canNotify).to.be.true;
    });
});
