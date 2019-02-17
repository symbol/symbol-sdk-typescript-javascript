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
import {ChronoUnit} from 'js-joda';
import {CreateTransactionFromDTO} from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import {Account} from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {MosaicSupplyType} from '../../../src/model/mosaic/MosaicSupplyType';
import {AggregateTransaction} from '../../../src/model/transaction/AggregateTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {ModifyMultisigAccountTransaction} from '../../../src/model/transaction/ModifyMultisigAccountTransaction';
import {MosaicDefinitionTransaction} from '../../../src/model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../../src/model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../../src/model/transaction/MultisigCosignatoryModification';
import {MultisigCosignatoryModificationType} from '../../../src/model/transaction/MultisigCosignatoryModificationType';
import {PlainMessage} from '../../../src/model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../../src/model/transaction/RegisterNamespaceTransaction';
import {TransferTransaction} from '../../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {Cosignatory2Account, CosignatoryAccount, MultisigAccount, TestingAccount} from '../../conf/conf.spec';

describe('AggregateTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an AggregateTransaction object with TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signWith(account);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('CD000000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('5100000051000000');
        expect(signedTransaction.payload.substring(
            320,
            signedTransaction.payload.length,
        )).to.be.equal('039054419050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
    });

    it('should createComplete an AggregateTransaction object with RegisterNamespaceTransaction', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [registerNamespaceTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('C9000000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('4D0000004D000000');

        expect(signedTransaction.payload.substring(
            320,
            signedTransaction.payload.length,
        )).to.be.equal('02904E4100E803000000000000CFCBE72D994BE69B13726F6F742D746573742D6E616D657370616365');
    });

    it('should createComplete an AggregateTransaction object with MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            UInt64.fromUint(1), // nonce
            UInt64.fromUint(1), // ID
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                levyMutable: true,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('B4000000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('3800000038000000');
        expect(signedTransaction.payload.substring(
            320,
            signedTransaction.payload.length,
        )).to.be.equal('02904D41010000000000000001070302E8030000');
    });

    it('should createComplete an AggregateTransaction object with MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(10),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('B5000000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('3900000039000000');
        expect(signedTransaction.payload.substring(
            320,
            signedTransaction.payload.length,
        )).to.be.equal('02904D424CCCD78612DDF5CA010A00000000000000');
    });

    it('should createComplete an AggregateTransaction object with ModifyMultisigAccountTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            ),
                new MultisigCosignatoryModification(
                    MultisigCosignatoryModificationType.Add,
                    PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
                        NetworkType.MIJIN_TEST),
                )],
            NetworkType.MIJIN_TEST,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account);

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('E9000000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('6D0000006D000000');
        expect(signedTransaction.payload.substring(
            320,
            signedTransaction.payload.length,
        )).to.be.equal('0390554101020200B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC240' +
            '0B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4');
    });

    it('should createComplete an AggregateTransaction object with different cosignatories', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );
        const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
            [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = CosignatoryAccount.signTransactionWithCosignatories(
            aggregateTransaction,
            [Cosignatory2Account],
        );

        expect(signedTransaction.payload.substring(0, 8)).to.be.equal('2d010000');
        expect(signedTransaction.payload.substring(240, 256)).to.be.equal('5100000051000000');
        expect(signedTransaction.payload.substring(
            320,
            474,
        )).to.be.equal('039054419050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742' +
            'D6D65737361676568B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B0B763');

    });

    it('should validate if accounts have signed an aggregate transaction', () => {
        const aggregateTransactionDTO = {
            meta: {
                hash: '671653C94E2254F2A23EFEDB15D67C38332AED1FBD24B063C0A8E675582B6A96',
                height: [
                    18160,
                    0,
                ],
                id: '5A0069D83F17CF0001777E55',
                index: 0,
                merkleComponentHash: '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7',
            },
            transaction: {
                cosignatures: [
                    {
                        signature: '5780C8DF9D46BA2BCF029DCC5D3BF55FE1CB5BE7ABCF30387C4637DD' +
                        'EDFC2152703CA0AD95F21BB9B942F3CC52FCFC2064C7B84CF60D1A9E69195F1943156C07',
                        signer: 'A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                    },
                ],
                deadline: [
                    3266625578,
                    11,
                ],
                fee: [
                    0,
                    0,
                ],
                signature: '939673209A13FF82397578D22CC96EB8516A6760C894D9B7535E3A1E0680' +
                '07B9255CFA9A914C97142A7AE18533E381C846B69D2AE0D60D1DC8A55AD120E2B606',
                signer: '7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
                transactions: [
                    {
                        meta: {
                            aggregateHash: '3D28C804EDD07D5A728E5C5FFEC01AB07AFA5766AE6997B38526D36015A4D006',
                            aggregateId: '5A0069D83F17CF0001777E55',
                            height: [
                                18160,
                                0,
                            ],
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
                                    type: 0,
                                },
                            ],
                            signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                            type: 16725,
                            version: 36867,
                        },
                    },
                ],
                type: 16705,
                version: 36867,
            },
        };

        const aggregateTransaction = CreateTransactionFromDTO(
            aggregateTransactionDTO) as AggregateTransaction;
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('A5F82EC8EBB341427B6785C8111906CD0DF18838FB11B51CE0E18B5E79DFF630',
                NetworkType.MIJIN_TEST))).to.be.equal(true);
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
                NetworkType.MIJIN_TEST))).to.be.equal(true);
        expect(aggregateTransaction.signedByAccount(
            PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                NetworkType.MIJIN_TEST))).to.be.equal(false);
    });

    it('should have type 0x4141 when it\'s complete', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );

        expect(aggregateTransaction.type).to.be.equal(0x4141);
    });

    it('should have type 0x4241 when it\'s bonded', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
        );

        expect(aggregateTransaction.type).to.be.equal(0x4241);
    });
});
