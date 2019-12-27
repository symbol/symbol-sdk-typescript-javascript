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
import { ChronoUnit } from 'js-joda';
import { Convert } from '../../../src/core/format';
import { TransactionMapping } from '../../../src/core/utils/TransactionMapping';
import { CreateTransactionFromDTO } from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import { CreateTransactionFromPayload } from '../../../src/infrastructure/transaction/CreateTransactionFromPayload';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';
import { MosaicSupplyChangeAction } from '../../../src/model/mosaic/MosaicSupplyChangeAction';
import { NetworkCurrencyMosaic } from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
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
import { MosaicAddressRestrictionTransaction } from '../../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicDefinitionTransaction } from '../../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigAccountModificationTransaction } from '../../../src/model/transaction/MultisigAccountModificationTransaction';
import { NamespaceRegistrationTransaction } from '../../../src/model/transaction/NamespaceRegistrationTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { Cosignatory2Account, CosignatoryAccount, MultisigAccount, TestingAccount } from '../../conf/conf.spec';

describe('AggregateTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedAddress = new NamespaceId('address');
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const networkType = NetworkType.MIJIN_TEST;
    before(() => {
        account = TestingAccount;
    });
    before(() => {
        account = TestingAccount;
        statement = new Statement([],
            [new ResolutionStatement(ResolutionType.Address, UInt64.fromUint(2), unresolvedAddress,
                [new ResolutionEntry(account.address, new ReceiptSource(1, 1))])],
            [new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId,
                [new ResolutionEntry(resolvedMosaicId, new ReceiptSource(1, 1))])],
        );
    });

    it('should default maxFee field be set to 0', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        expect(aggregateTransaction.maxFee.higher).to.be.equal(0);
        expect(aggregateTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
            new UInt64([1, 0]),
        );

        expect(aggregateTransaction.maxFee.higher).to.be.equal(0);
        expect(aggregateTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an AggregateTransaction object with TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            []);

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('08010000');
        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('019054419050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142000D000000000000746573742D6D657373616765000000');
    });

    it('should createComplete an AggregateTransaction object with NamespaceRegistrationTransaction', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [registerNamespaceTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('00010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('58000000000000005500000000000000');

        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('01904E41E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365000000');
    });

    it('should createComplete an AggregateTransaction object with MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('F0000000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('48000000000000004600000000000000');
        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('01904D410100000000000000E803000000000000E6DE84B807030000');
    });

    it('should createComplete an AggregateTransaction object with MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('F0000000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('48000000000000004100000000000000');
        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('01904D424CCCD78612DDF5CA0A000000000000000100000000000000');
    });

    it('should createComplete an AggregateTransaction object with MultisigAccountModificationTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            2,
            1,
            [PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                networkType),
                PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                    networkType),
            ],
            [],
            networkType,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('20010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('78000000000000007800000000000000');
        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('019055410102020000000000B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6' +
            'EC24B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4');
    });

    it('should createComplete an AggregateTransaction object with different cosignatories', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
            [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
            networkType,
            [],
        );
        const signedTransaction = CosignatoryAccount.signTransactionWithCosignatories(
            aggregateTransaction,
            [Cosignatory2Account],
            generationHash,
        );

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('68010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('60000000000000005D00000000000000');
        expect(signedTransaction.payload.substring(
            424,
            424 + 162,
        )).to.be.equal('019054419050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142000D0000000' +
            '00000746573742D6D65737361676500000068B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842');

    });

    it('should createBonded an AggregateTransaction object with TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(2, ChronoUnit.MINUTES),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('08010000');
        expect(signedTransaction.payload.substring(320, 352)).to.be.equal('60000000000000005D00000000000000');
        expect(signedTransaction.payload.substring(220, 224)).to.be.equal('4142');
        expect(signedTransaction.payload.substring(
            424,
            signedTransaction.payload.length,
        )).to.be.equal('019054419050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142000D000000000000746573742D6D657373616765000000');
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
                        signature: '5780C8DF9D46BA2BCF029DCC5D3BF55FE1CB5BE7ABCF30387C4637DD' +
                            'EDFC2152703CA0AD95F21BB9B942F3CC52FCFC2064C7B84CF60D1A9E69195F1943156C07',
                        signerPublicKey: 'A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                    },
                ],
                deadline: '1000',
                maxFee: '0',
                signature: '939673209A13FF82397578D22CC96EB8516A6760C894D9B7535E3A1E0680' +
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
                                    cosignatoryPublicKey: '589B73FBC22063E9AE6FBAC67CB9C6EA865EF556E5' +
                                        'FB8B7310D45F77C1250B97',
                                    modificationAction: 0,
                                },
                            ],
                            signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                            type: 16725,
                            version: 1,
                            network: 144,
                        },
                    },
                ],
                type: 16705,
                version: 1,
                network: 144,
            },
        };

        const aggregateTransaction = CreateTransactionFromDTO(
            aggregateTransactionDTO) as AggregateTransaction;
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                networkType))).to.be.equal(true);
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
                networkType))).to.be.equal(true);
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                networkType))).to.be.equal(false);

        expect(aggregateTransaction.innerTransactions[0].signer!.publicKey)
        .to.be.equal('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF');

        expect(Convert.hexToUint8(aggregateTransaction.serialize()).length).to.be.equal(aggregateTransaction.size);
    });

    it('should have type 0x4141 when it\'s complete', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [],
            networkType,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(0x4141);
    });

    it('should have type 0x4241 when it\'s bonded', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            networkType,
        );

        expect(aggregateTransaction.type).to.be.equal(0x4241);
    });

    it('should throw exception when adding an aggregated transaction as inner transaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            []);

        expect(() => {
            AggregateTransaction.createComplete(
                Deadline.create(),
                [aggregateTransaction.toAggregate(account.publicAccount)],
                networkType,
                []);
        }).to.throw(Error, 'Inner transaction cannot be an aggregated transaction.');
    });

    it('Should create signed transaction with cosignatories - Aggregated Complete', () => {
        /**
         * @see https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/112
         */
        const accountAlice = TestingAccount;
        const accountBob = CosignatoryAccount;
        const accountCarol = Cosignatory2Account;

        const AtoBTx = TransferTransaction.create(Deadline.create(),
            accountBob.address,
            [],
            PlainMessage.create('a to b'),
            networkType);
        const BtoATx = TransferTransaction.create(Deadline.create(),
            accountAlice.address,
            [],
            PlainMessage.create('b to a'),
            networkType);
        const CtoATx = TransferTransaction.create(Deadline.create(),
            accountAlice.address,
            [],
            PlainMessage.create('c to a'),
            networkType);

        // 01. Alice creates the aggregated tx and sign it, Then payload send to Bob & Carol
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                AtoBTx.toAggregate(accountAlice.publicAccount),
                BtoATx.toAggregate(accountBob.publicAccount),
                CtoATx.toAggregate(accountCarol.publicAccount)],
            networkType,
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
        const standardCosignedTransaction = aggregateTransaction
        .signTransactionWithCosignatories(accountAlice, [accountBob, accountCarol], generationHash);
        expect(standardCosignedTransaction.payload).to.be.equal(signedTransaction.payload);
        expect(standardCosignedTransaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('Should be able to add innertransactions to current aggregate tx', () => {
        const transferTx1 = TransferTransaction.create(Deadline.create(),
            account.address,
            [],
            PlainMessage.create('a to b'),
            networkType);
        const transferTx2 = TransferTransaction.create(Deadline.create(),
            account.address,
            [],
            PlainMessage.create('b to a'),
            networkType);
        let aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTx1.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.innerTransactions.length).to.be.equal(1);

        aggregateTransaction = aggregateTransaction.addTransactions([transferTx2.toAggregate(account.publicAccount)]);

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.innerTransactions.length).to.be.equal(2);
    });

    it('Should be able to add cosignatures to current aggregate tx', () => {
        const transferTx1 = TransferTransaction.create(Deadline.create(),
            account.address,
            [],
            PlainMessage.create('a to b'),
            networkType);
        let aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTx1.toAggregate(account.publicAccount)],
            networkType,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.cosignatures.length).to.be.equal(0);

        // add cosignature after creation
        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        const cosignature = new AggregateTransactionCosignature(
            signedTransaction.payload,
            PublicAccount.createFromPublicKey(signedTransaction.signerPublicKey, networkType),
        );

        aggregateTransaction = aggregateTransaction.addCosignatures([cosignature]);

        expect(aggregateTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(aggregateTransaction.cosignatures.length).to.be.equal(1);
    });

    describe('size', () => {
        it('should return 268 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [
                    NetworkCurrencyMosaic.createRelative(100),
                ],
                PlainMessage.create('NEM'),
                networkType,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [transaction.toAggregate(account.publicAccount)],
                networkType,
                [],
            );
            expect(Convert.hexToUint8(aggregateTransaction.serialize()).length).to.be.equal(aggregateTransaction.size);
            expect(aggregateTransaction.size).to.be.equal(272);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            networkType,
            []
        ).setMaxFee(2);
​
        expect(aggregateTransaction.maxFee.compact()).to.be.equal(560);

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const transferTransaction = new TransferTransaction(
            networkType,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test'),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''));

        const aggregateTransaction = new AggregateTransaction(
            networkType,
            TransactionType.AGGREGATE_COMPLETE,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(100),
            [transferTransaction.toAggregate(account.publicAccount)],
            [],
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, '')).resolveAliases(statement);
​
        const innerTransaction = aggregateTransaction.innerTransactions[0] as TransferTransaction;
        expect(innerTransaction.recipientAddress instanceof Address).to.be.true;
        expect(innerTransaction.mosaics[0].id instanceof MosaicId).to.be.true;
        expect((innerTransaction.recipientAddress as Address).equals(account.address)).to.be.true;
        expect((innerTransaction.mosaics[0].id as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });


    it('Test aggregate serialization', () => {
        const transferTransaction1 = new TransferTransaction(
            networkType,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedAddress,
            [new Mosaic(unresolvedMosaicId, UInt64.fromUint(1))],
            PlainMessage.create('test'),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''));
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const namespaceId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const transferTransaction2 = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            UInt64.fromUint(1),
            namespaceId,
            UInt64.fromUint(8),
            networkType,
            UInt64.fromUint(9),
        );

        const consignatures = [
            new AggregateTransactionCosignature('AAA9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111AAA9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111',
                PublicAccount.createFromPublicKey('9A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111', networkType)),
            new AggregateTransactionCosignature('BBB9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456222BBB9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456222',
                PublicAccount.createFromPublicKey('9A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111', networkType))
        ];

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.createFromDTO('1'),
            [transferTransaction1.toAggregate(account.publicAccount), transferTransaction2.toAggregate(account.publicAccount)],
            networkType, consignatures,
            UInt64.fromUint(9));
​
        const expected = '4002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000190414109000000000000000100000000000000C5C6430F5F0A80E5A419FCDFB088F148248479CF063D3653E8DF9DFE4F1F65EED8000000000000006500000000000000C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE000000000190544191B053ED6C7799EFFE0000000000000000000000000000000001050000000000AFFD1F1C4B7F61F8010000000000000000746573740000006900000000000000C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE0000000001905142010000000000000001000000000000000900000000000000080000000000000091C51FB4C93FCA509500000000000000000000000000000000000000000000009A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111AAA9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111AAA9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA654561119A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456111BBB9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456222BBB9366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456222';
        expect(aggregateTransaction.serialize()).to.be.equal(expected);

        const parsedTransaction = CreateTransactionFromPayload(expected) as AggregateTransaction;


        expect(parsedTransaction.deadline.toString()).to.be.equal(aggregateTransaction.deadline.toString());
        expect(parsedTransaction.maxFee.toHex()).to.be.equal(aggregateTransaction.maxFee.toHex());
        expect(parsedTransaction.cosignatures.length).to.be.equal(2);
        expect(parsedTransaction.innerTransactions.length).to.be.equal(2);
        expect(parsedTransaction.serialize()).to.be.equal(expected);

    });
});
