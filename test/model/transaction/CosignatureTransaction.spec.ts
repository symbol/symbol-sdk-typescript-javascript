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
import { CreateTransactionFromDTO } from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import { Account } from '../../../src/model/account/Account';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { CosignatureTransaction } from '../../../src/model/transaction/CosignatureTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { TestingAccount } from '../../conf/conf.spec';

describe('CosignatureTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an TransferTransaction object and sign it', () => {
        const aggregateTransferTransactionDTO = {
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
                            message: {
                                payload: '746573742D6D657373616765',
                                type: 0,
                            },
                            mosaics: [
                                {
                                    amount: '100',
                                    id: '85BBEA6CC462B244',
                                },
                            ],
                            recipientAddress: '6823BB7C3C089D996585466380EDBDC19D4959184893E38C',
                            signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                            type: 16724,
                            version: 36865,
                        },
                    },
                ],
                type: 16705,
                version: 36865,
            },
        };

        const aggregateTransferTransaction = CreateTransactionFromDTO(aggregateTransferTransactionDTO);

        const cosignatureTransaction = CosignatureTransaction.create(aggregateTransferTransaction as AggregateTransaction);

        const cosignatureSignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);

        expect(cosignatureSignedTransaction.parentHash).to.be.equal(aggregateTransferTransaction.transactionInfo!.hash);
        expect(cosignatureSignedTransaction.signature).to.be.equal(
            '5EA75D1A2C8AD25DA4F400C1BD2DA84449FAF583AFD813E' +
                '1179E72AF0CDF5AC1C0F7404AF6FC7268EE416204240DD3D5B11420D80215F19AA314FC86D6E03E0D',
        );
        expect(cosignatureSignedTransaction.signerPublicKey).to.be.equal(account.publicKey);
        expect(cosignatureSignedTransaction.version.toString()).to.be.equal('0');
    });

    it('should sign a transaction with transaction payload', () => {
        const txPayload = TransferTransaction.create(
            Deadline.create(),
            account.address,
            [],
            PlainMessage.create('a to b'),
            NetworkType.MIJIN_TEST,
        ).serialize();

        const signedTx = CosignatureTransaction.signTransactionPayload(account, txPayload, generationHash);

        expect(signedTx.signerPublicKey).to.be.equal('9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6');
        expect(signedTx.signerPublicKey).to.be.equal(account.publicKey);
        expect(signedTx.version.toString()).to.be.equal('0');
    });
});
