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

import { ChronoUnit } from '@js-joda/core';
import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
import { TransactionMapping } from '../../../src/core/utils/TransactionMapping';
import { CreateTransactionFromDTO } from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';
import { MosaicSupplyChangeAction } from '../../../src/model/mosaic/MosaicSupplyChangeAction';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { Statement } from '../../../src/model/receipt/Statement';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { AggregateTransactionCosignature } from '../../../src/model/transaction/AggregateTransactionCosignature';
import { CosignatureSignedTransaction } from '../../../src/model/transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../../../src/model/transaction/CosignatureTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigAccountModificationTransaction } from '../../../src/model/transaction/MultisigAccountModificationTransaction';
import { NamespaceRegistrationTransaction } from '../../../src/model/transaction/NamespaceRegistrationTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { Cosignatory2Account, CosignatoryAccount, MultisigAccount, TestingAccount } from '../../conf/conf.spec';
import { NetworkCurrencyLocal } from '../mosaic/Currency.spec';

describe('AggregateTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedAddress = new NamespaceId('address');
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });
    before(() => {
        account = TestingAccount;
        statement = new Statement(
            [],
            [
                new ResolutionStatement(ResolutionType.Address, UInt64.fromUint(2), unresolvedAddress, [
                    new ResolutionEntry(account.address, new ReceiptSource(1, 1)),
                ]),
            ],
            [
                new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId, [
                    new ResolutionEntry(resolvedMosaicId, new ReceiptSource(1, 1)),
                ]),
            ],
        );
    });

    it('should default maxFee field be set to 0', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        expect(aggregateTransaction.maxFee.higher).to.be.equal(0);
        expect(aggregateTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
            new UInt64([1, 0]),
        );

        expect(aggregateTransaction.maxFee.higher).to.be.equal(0);
        expect(aggregateTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an AggregateTransaction object with TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('08010000');
        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616765000000',
        );
    });

    it('should createComplete an AggregateTransaction object with NamespaceRegistrationTransaction', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [registerNamespaceTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('00010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('58000000000000005500000000000000');

        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '01804E41E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365000000',
        );
    });

    it('should createComplete an AggregateTransaction object with MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('F0000000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('48000000000000004600000000000000');
        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '01804D410100000000000000E803000000000000E6DE84B807030000',
        );
    });

    it('should createComplete an AggregateTransaction object with MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('F0000000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('48000000000000004100000000000000');
        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '01804D424CCCD78612DDF5CA0A000000000000000100000000000000',
        );
    });

    it('should createComplete an AggregateTransaction object with MultisigAccountModificationTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(epochAdjustment),
            2,
            1,
            [
                Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.PRIVATE_TEST),
                Address.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4', NetworkType.PRIVATE_TEST),
            ],
            [],
            NetworkType.PRIVATE_TEST,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('10010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('68000000000000006800000000000000');
        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '018055410102020000000000809FC4844A5206CFA44603EFA1FFC76FE9B0564D96735562806B4CB49ECF224FC4F0F4FCA2F6034305B3A47B0BB0D2C9',
        );
    });

    it('should createComplete an AggregateTransaction object with different cosignatories', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );
        const signedTransaction = CosignatoryAccount.signTransactionWithCosignatories(
            aggregateTransaction,
            [Cosignatory2Account],
            generationHash,
        );

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('70010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('60000000000000005D00000000000000');
        expect(signedTransaction.payload.substring(424, 424 + 162)).to.be.equal(
            '018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616' +
                '7650000000000000000000000F9D6329A1A927F5D8918D3D313524CF179DE126AF8',
        );
    });

    it('should createBonded an AggregateTransaction object with TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(epochAdjustment, 2, ChronoUnit.MINUTES),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('08010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('60000000000000005D00000000000000');
        expect(signedTransaction.payload.substring(220, 224)).to.be.equal('4142');
        expect(signedTransaction.payload.substring(424, signedTransaction.payload.length)).to.be.equal(
            '018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616765000000',
        );
    });

    it('should validate if accounts have signed an aggregate transaction', () => {
        const aggregateTransactionDTO = {
            meta: {
                hash: '671653C94E2254F2A23EFEDB15D67C38332AED1FBD24B063C0A8E675582B6A96',
                height: '18160',
                id: '5A0069D83F17CF0001777E55',
                index: 0,
                merkleComponentHash: '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7',
            },
            transaction: {
                cosignatures: [
                    {
                        version: '0',
                        signature:
                            '5780C8DF9D46BA2BCF029DCC5D3BF55FE1CB5BE7ABCF30387C4637DD' +
                            'EDFC2152703CA0AD95F21BB9B942F3CC52FCFC2064C7B84CF60D1A9E69195F1943156C07',
                        signerPublicKey: 'A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                    },
                ],
                deadline: '1000',
                maxFee: '0',
                signature:
                    '939673209A13FF82397578D22CC96EB8516A6760C894D9B7535E3A1E0680' +
                    '07B9255CFA9A914C97142A7AE18533E381C846B69D2AE0D60D1DC8A55AD120E2B606',
                signerPublicKey: '7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
                transactions: [
                    {
                        meta: {
                            aggregateHash: '3D28C804EDD07D5A728E5C5FFEC01AB07AFA5766AE6997B38526D36015A4D006',
                            aggregateId: '5A0069D83F17CF0001777E55',
                            height: '18160',
                            id: '5A0069D83F17CF0001777E56',
                            index: 0,
                        },
                        transaction: {
                            minApprovalDelta: 1,
                            minRemovalDelta: 1,
                            modifications: [
                                {
                                    cosignatoryPublicKey: '589B73FBC22063E9AE6FBAC67CB9C6EA865EF556E5' + 'FB8B7310D45F77C1250B97',
                                    modificationAction: 0,
                                },
                            ],
                            signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                            type: 16725,
                            version: 1,
                            network: 128,
                        },
                    },
                ],
                type: 16705,
                version: 1,
                network: 128,
            },
        };

        const aggregateTransaction = CreateTransactionFromDTO(aggregateTransactionDTO) as AggregateTransaction;
        expect(
            aggregateTransaction.signedByAccount(
                PublicAccount.createFromPublicKey(
                    'A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                    NetworkType.PRIVATE_TEST,
                ),
            ),
        ).to.be.equal(true);
        expect(
            aggregateTransaction.signedByAccount(
                PublicAccount.createFromPublicKey(
                    '7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
                    NetworkType.PRIVATE_TEST,
                ),
            ),
        ).to.be.equal(true);
        expect(
            aggregateTransaction.signedByAccount(
                PublicAccount.createFromPublicKey(
                    'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    NetworkType.PRIVATE_TEST,
                ),
            ),
        ).to.be.equal(false);

        expect(aggregateTransaction.innerTransactions[0].signer!.publicKey).to.be.equal(
            'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
        );

        expect(Convert.hexToUint8(aggregateTransaction.serialize()).length).to.be.equal(aggregateTransaction.size);
    });

    it("should have type 0x4141 when it's complete", () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [],
            NetworkType.PRIVATE_TEST,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(0x4141);
    });

    it("should have type 0x4241 when it's bonded", () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(epochAdjustment), [], NetworkType.PRIVATE_TEST);

        expect(aggregateTransaction.type).to.be.equal(0x4241);
    });

    it('should throw exception when adding an aggregated transaction as inner transaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        expect(() => {
            AggregateTransaction.createComplete(
                Deadline.create(epochAdjustment),
                [aggregateTransaction.toAggregate(account.publicAccount)],
                NetworkType.PRIVATE_TEST,
                [],
            );
        }).to.throw(Error, 'Inner transaction cannot be an aggregated transaction.');
    });

    it('Should create signed transaction with cosignatories - Aggregated Complete', () => {
        /**
         * @see https://github.com/nemtech/symbol-sdk-typescript-javascript/issues/112
         */
        const accountAlice = TestingAccount;
        const accountBob = CosignatoryAccount;
        const accountCarol = Cosignatory2Account;

        const AtoBTx = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            accountBob.address,
            [],
            PlainMessage.create('a to b'),
            NetworkType.PRIVATE_TEST,
        );
        const BtoATx = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            accountAlice.address,
            [],
            PlainMessage.create('b to a'),
            NetworkType.PRIVATE_TEST,
        );
        const CtoATx = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            accountAlice.address,
            [],
            PlainMessage.create('c to a'),
            NetworkType.PRIVATE_TEST,
        );

        // 01. Alice creates the aggregated tx and sign it, Then payload send to Bob & Carol
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [
                AtoBTx.toAggregate(accountAlice.publicAccount),
                BtoATx.toAggregate(accountBob.publicAccount),
                CtoATx.toAggregate(accountCarol.publicAccount),
            ],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const aliceSignedTransaction = aggregateTransaction.signWith(accountAlice, generationHash);

        // 02.1 Bob cosigns the tx and sends it back to Alice
        const signedTxBob = CosignatureTransaction.signTransactionPayload(accountBob, aliceSignedTransaction.payload, generationHash);

        // 02.2 Carol cosigns the tx and sends it back to Alice
        const signedTxCarol = CosignatureTransaction.signTransactionPayload(accountCarol, aliceSignedTransaction.payload, generationHash);

        // 03. Alice collects the cosignatures, recreate, sign, and announces the transaction

        // First Alice need to append cosignatories to current transaction.
        const cosignatureSignedTransactions = [
            new CosignatureSignedTransaction(signedTxBob.parentHash, signedTxBob.signature, signedTxBob.signerPublicKey),
            new CosignatureSignedTransaction(signedTxCarol.parentHash, signedTxCarol.signature, signedTxCarol.signerPublicKey),
        ];

        const recreatedTx = TransactionMapping.createFromPayload(aliceSignedTransaction.payload) as AggregateTransaction;

        const signedTransaction = recreatedTx.signTransactionGivenSignatures(accountAlice, cosignatureSignedTransactions, generationHash);

        expect(signedTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(signedTransaction.signerPublicKey).to.be.equal(accountAlice.publicKey);
        expect(signedTransaction.payload.indexOf(accountBob.publicKey) > -1).to.be.true;
        expect(signedTransaction.payload.indexOf(accountCarol.publicKey) > -1).to.be.true;

        // To make sure that the new cosign method returns the same payload & hash as standard cosigning
        const standardCosignedTransaction = aggregateTransaction.signTransactionWithCosignatories(
            accountAlice,
            [accountBob, accountCarol],
            generationHash,
        );
        expect(standardCosignedTransaction.payload).to.be.equal(signedTransaction.payload);
        expect(standardCosignedTransaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('Should be able to add innertransactions to current aggregate tx', () => {
        const transferTx1 = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            [],
            PlainMessage.create('a to b'),
            NetworkType.PRIVATE_TEST,
        );
        const transferTx2 = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            [],
            PlainMessage.create('b to a'),
            NetworkType.PRIVATE_TEST,
        );
        let aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTx1.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.innerTransactions.length).to.be.equal(1);

        aggregateTransaction = aggregateTransaction.addTransactions([transferTx2.toAggregate(account.publicAccount)]);

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.innerTransactions.length).to.be.equal(2);
    });

    it('Should be able to add cosignatures to current aggregate tx', () => {
        const transferTx1 = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            [],
            PlainMessage.create('a to b'),
            NetworkType.PRIVATE_TEST,
        );
        let aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTx1.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.cosignatures.length).to.be.equal(0);

        // add cosignature after creation
        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        const cosignature = new AggregateTransactionCosignature(
            signedTransaction.payload,
            PublicAccount.createFromPublicKey(signedTransaction.signerPublicKey, NetworkType.PRIVATE_TEST),
        );

        aggregateTransaction = aggregateTransaction.addCosignatures([cosignature]);

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.cosignatures.length).to.be.equal(1);
    });

    describe('size', () => {
        it('should return 268 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(epochAdjustment),
                Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
                [NetworkCurrencyLocal.createRelative(100)],
                PlainMessage.create('NEM'),
                NetworkType.PRIVATE_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(epochAdjustment),
                [transaction.toAggregate(account.publicAccount)],
                NetworkType.PRIVATE_TEST,
                [],
            );
            expect(Convert.hexToUint8(aggregateTransaction.serialize()).length).to.be.equal(aggregateTransaction.size);
            expect(aggregateTransaction.size).to.be.equal(272);
        });
        it('should set payload size', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(epochAdjustment),
                Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
                [NetworkCurrencyLocal.createRelative(100)],
                PlainMessage.create('NEM'),
                NetworkType.PRIVATE_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(epochAdjustment),
                [transaction.toAggregate(account.publicAccount)],
                NetworkType.PRIVATE_TEST,
                [],
            );
            expect(aggregateTransaction.size).to.be.equal(272);

            expect(aggregateTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        ).setMaxFeeForAggregate(2, 10);
        const size = aggregateTransaction.size;
        expect(size).to.be.equal(280);
        expect(aggregateTransaction.maxFee.compact()).to.be.equal((size + 104 * 10) * 2);

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test set maxFee using multiplier', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        expect(() => {
            AggregateTransaction.createComplete(
                Deadline.create(epochAdjustment),
                [transferTransaction.toAggregate(account.publicAccount)],
                NetworkType.PRIVATE_TEST,
                [],
            ).setMaxFee(2);
        }).to.throw();
    });

    it('Test resolveAlias can resolve', () => {
        const transferTransaction = new TransferTransaction(
            NetworkType.PRIVATE_TEST,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test'),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        );

        const aggregateTransaction = new AggregateTransaction(
            NetworkType.PRIVATE_TEST,
            TransactionType.AGGREGATE_COMPLETE,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(100),
            [transferTransaction.toAggregate(account.publicAccount)],
            [],
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        const innerTransaction = aggregateTransaction.innerTransactions[0] as TransferTransaction;
        expect(innerTransaction.recipientAddress instanceof Address).to.be.true;
        expect(innerTransaction.mosaics[0].id instanceof MosaicId).to.be.true;
        expect((innerTransaction.recipientAddress as Address).equals(account.address)).to.be.true;
        expect((innerTransaction.mosaics[0].id as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            account.address,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );
        const tx = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );
        let canNotify = tx.shouldNotifyAccount(account.address, []);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'), []);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address, [])).to.be.true;
    });

    it('Notify Account with alias', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );
        const tx = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );
        let canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'), [
            unresolvedAddress,
        ]);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'), []);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address, [])).to.be.true;
    });
});
