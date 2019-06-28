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
import {CreateTransactionFromDTO} from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import {Account} from '../../../src/model/account/Account';
import {AggregateTransaction} from '../../../src/model/transaction/AggregateTransaction';
import {CosignatureTransaction} from '../../../src/model/transaction/CosignatureTransaction';
import {TestingAccount} from '../../conf/conf.spec';

describe('CosignatureTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an TransferTransaction object and sign it', () => {

        const aggregateTransferTransactionDTO = {
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
                maxFee: [
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
                            message: {
                                payload: '746573742D6D657373616765',
                                type: 0,
                            },
                            mosaics: [
                                {
                                    amount: [
                                        3863990592,
                                        95248,
                                    ],
                                    id: [
                                        3646934825,
                                        3576016193,
                                    ],
                                },
                            ],
                            recipient: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
                            signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
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
        expect(cosignatureSignedTransaction.signature).to.be.equal('BF3BC39F2292C028CB0FFA438A9F567A7C4D7' +
            '93D2F8522C8DEAC74BEFBCB61AF6414ADF27B2176D6A24FEF612AA6DB2F562176A11C46BA6D5E05430042CB5705');
        expect(cosignatureSignedTransaction.signer).to.be.equal(account.publicKey);
    });
});
