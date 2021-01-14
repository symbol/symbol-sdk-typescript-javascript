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
import { TransactionMapping } from '../../../src/core/utils/TransactionMapping';
import { Account } from '../../../src/model/account/Account';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../../../src/model/transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../../../src/model/transaction/CosignatureTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { NetworkCurrencyLocal } from '../mosaic/Currency.spec';

describe('Account', () => {
    const accountInformation = {
        address: 'VDLGYM2CBZKBDGK3VT6KFMUM6HE7LXL2WGA37KA',
        privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
        publicKey: '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6'.toUpperCase(),
    };

    const epochAdjustment = 1573430400;
    it('should be created via private key', () => {
        const account = Account.createFromPrivateKey(accountInformation.privateKey, NetworkType.PRIVATE_TEST);
        expect(account.publicKey).to.be.equal(accountInformation.publicKey);
        expect(account.privateKey).to.be.equal(accountInformation.privateKey);
        expect(account.address.plain()).to.be.equal(accountInformation.address);
    });

    it('should throw exception when the private key is not valid', () => {
        expect(() => {
            Account.createFromPrivateKey('', NetworkType.PRIVATE_TEST);
        }).to.throw();
    });

    it('should generate a new account', () => {
        const account = Account.generateNewAccount(NetworkType.PRIVATE_TEST);
        expect(account.publicKey).to.not.be.equal(undefined);
        expect(account.privateKey).to.not.be.equal(undefined);
        expect(account.address).to.not.be.equal(undefined);
    });

    it('should generate a new account using NIS1 schema', () => {
        const account = Account.generateNewAccount(NetworkType.TEST_NET);
        expect(account.publicKey).to.not.be.equal(undefined);
        expect(account.privateKey).to.not.be.equal(undefined);
        expect(account.address).to.not.be.equal(undefined);
    });

    it('should return networkType', () => {
        const account = Account.generateNewAccount(NetworkType.TEST_NET);
        expect(account.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('should sign tranaction with given signature', () => {
        const sendAmount = NetworkCurrencyLocal.createAbsolute(1000);
        const backAmount = NetworkCurrencyLocal.createAbsolute(1);
        const account = Account.generateNewAccount(NetworkType.TEST_NET);
        const account2 = Account.generateNewAccount(NetworkType.TEST_NET);
        const generationHash = 'C422CC3C9257A1568036E1726E64EB5923C8363A13D4344F9E66CD89C8789BC7';
        const aliceTransferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            account2.address,
            [sendAmount],
            PlainMessage.create('payout'),
            NetworkType.TEST_NET,
        );
        const bobTransferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            [backAmount],
            PlainMessage.create('payout'),
            NetworkType.TEST_NET,
        );

        // 01. Alice creates the aggregated tx and sign it. Then payload send to Bob
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [aliceTransferTransaction.toAggregate(account.publicAccount), bobTransferTransaction.toAggregate(account2.publicAccount)],
            NetworkType.TEST_NET,
            [],
        );

        const aliceSignedTransaction = aggregateTransaction.signWith(account, generationHash);

        // 02 Bob cosigns the tx and sends it back to Alice
        const signedTxBob = CosignatureTransaction.signTransactionPayload(account2, aliceSignedTransaction.payload, generationHash);

        // 03. Alice collects the cosignatures, recreate, sign, and announces the transaction
        const cosignatureSignedTransactions = [
            new CosignatureSignedTransaction(signedTxBob.parentHash, signedTxBob.signature, signedTxBob.signerPublicKey),
        ];
        const recreatedTx = TransactionMapping.createFromPayload(aliceSignedTransaction.payload) as AggregateTransaction;

        const signedTransaction = account.signTransactionGivenSignatures(recreatedTx, cosignatureSignedTransactions, generationHash);

        expect(signedTransaction.payload).not.to.be.undefined;
        expect(signedTransaction.payload.length).to.be.greaterThan(0);
    });

    describe('signData', () => {
        it('utf-8', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('catapult rocks!');
            expect(publicAccount.verifySignature('catapult rocks!', signed)).to.be.true;
        });

        it('hexa', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('0xAA');
            expect(publicAccount.verifySignature('0xAA', signed)).to.be.true;
        });

        it('utf-8 - NIS1', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.TEST_NET,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('catapult rocks!');
            expect(publicAccount.verifySignature('catapult rocks!', signed)).to.be.true;
        });

        it('hexa - NIS1', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.TEST_NET,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('0xAA');
            expect(publicAccount.verifySignature('0xAA', signed)).to.be.true;
        });

        it('hexa without 0x previx', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('66128B29E8197352A2FEB51B50CF5D02F1D05B20D44B3F7953B98ACD2BCA15D4');
            expect(publicAccount.verifySignature('66128B29E8197352A2FEB51B50CF5D02F1D05B20D44B3F7953B98ACD2BCA15D4', signed)).to.be.true;
        });

        it('hexa without 0x previx should be the same as with 0x', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('AA');
            const signedWith0x = account.signData('0xAA');
            expect(publicAccount.verifySignature('AA', signed)).to.be.true;
            expect(publicAccount.verifySignature('0xAA', signedWith0x)).to.be.true;
        });

        it('hexa without 0x previx should be the same as with 0x', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('ff60983e0c5d21d2fb83c67598d560f3cf0e28ae667b5616aaa58a059666cd8cf826b026243c92cf');
            const signedWith0x = account.signData('0xff60983e0c5d21d2fb83c67598d560f3cf0e28ae667b5616aaa58a059666cd8cf826b026243c92cf');
            expect(
                publicAccount.verifySignature('ff60983e0c5d21d2fb83c67598d560f3cf0e28ae667b5616aaa58a059666cd8cf826b026243c92cf', signed),
            ).to.be.true;
            expect(
                publicAccount.verifySignature(
                    '0xff60983e0c5d21d2fb83c67598d560f3cf0e28ae667b5616aaa58a059666cd8cf826b026243c92cf',
                    signedWith0x,
                ),
            ).to.be.true;
        });

        it('sign empty', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.PRIVATE_TEST,
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('');
            const signedWith0x = account.signData('0x');
            expect(publicAccount.verifySignature('', signed)).to.be.true;
            expect(publicAccount.verifySignature('0x', signedWith0x)).to.be.true;
        });
    });
});
