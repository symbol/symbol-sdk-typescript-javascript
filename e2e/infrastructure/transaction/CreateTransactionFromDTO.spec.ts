/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {deepEqual} from 'assert';
import {expect} from 'chai';
import {CreateTransactionFromDTO} from '../../../src/infrastructure/transaction/CreateTransactionFromDTO';
import { Address } from '../../../src/model/account/Address';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import ValidateTransaction from './ValidateTransaction';

describe('CreateTransactionFromDTO', () => {
    describe('TransferTransaction', () => {

        it('standalone', () => {
            const transferTransactionDTO = {
                meta: {
                    height: [
                        78,
                        0,
                    ],
                    hash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
                    merkleComponentHash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
                    index: 0,
                    id: '5CD2B76B2B3F0F0001751380',
                },
                transaction: {
                    // tslint:disable-next-line:max-line-length
                    signature: '7442156D839A3AC900BC0299E8701ECDABA674DCF91283223450953B005DE72C538EA54236F5E089530074CE78067CD3325CF53750B9118154C08B20A5CDC00D',
                    signer: '2FC3872A792933617D70E02AFF8FBDE152821A0DF0CA5FB04CB56FC3D21C8863',
                    version: 36865,
                    type: 16724,
                    maxFee: [0, 0],
                    deadline: [3362498678, 22],
                    recipient: '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB',
                    message: {
                        payload: '746573742D6D657373616765',
                        type: 0,
                    },
                    mosaics: [
                        {
                            id: [3294802500, 2243684972],
                            amount: [10, 0],
                        },
                    ],
                },
            };

            const transferTransaction = CreateTransactionFromDTO(transferTransactionDTO) as TransferTransaction;
            deepEqual(transferTransaction.recipient, Address.createFromEncoded(transferTransactionDTO.transaction.recipient));
            expect(transferTransaction.message.payload).to.be.equal('test-message');
        });

        it('standalone without message', () => {
            const transferTransactionDTO = {
                meta: {
                    height: [
                        78,
                        0,
                    ],
                    hash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
                    merkleComponentHash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
                    index: 0,
                    id: '5CD2B76B2B3F0F0001751380',
                },
                transaction: {
                    // tslint:disable-next-line:max-line-length
                    signature: '7442156D839A3AC900BC0299E8701ECDABA674DCF91283223450953B005DE72C538EA54236F5E089530074CE78067CD3325CF53750B9118154C08B20A5CDC00D',
                    signer: '2FC3872A792933617D70E02AFF8FBDE152821A0DF0CA5FB04CB56FC3D21C8863',
                    version: 36865,
                    type: 16724,
                    maxFee: [0, 0],
                    deadline: [3362498678, 22],
                    recipient: '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB',
                    mosaics: [
                        {
                            id: [3294802500, 2243684972],
                            amount: [10, 0],
                        },
                    ],
                },
            };

            const transferTransaction = CreateTransactionFromDTO(transferTransactionDTO) as TransferTransaction;
            deepEqual(transferTransaction.recipient, Address.createFromEncoded(transferTransactionDTO.transaction.recipient));
            expect(transferTransaction.message.payload).to.be.equal('');
        });

        it('aggregate', () => {
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

            ValidateTransaction.validateAggregateTx(aggregateTransferTransaction, aggregateTransferTransactionDTO);
        });
    });

    describe('RegisterNamespaceTransaction', () => {
        describe('namespace', () => {
            it('standalone', () => {
                const registerNamespaceTransactionDTO = {
                    meta: {
                        hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                        height: [
                            1,
                            0,
                        ],
                        id: '59FDA0733F17CF0001772CA7',
                        index: 19,
                        merkleComponentHash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                    },
                    transaction: {
                        deadline: [
                            1,
                            0,
                        ],
                        duration: [
                            1000,
                            0,
                        ],
                        maxFee: [
                            0,
                            0,
                        ],
                        name: 'a2p1mg',
                        namespaceId: [
                            437145074,
                            4152736179,
                        ],
                        namespaceType: 0,
                        signature: '553E696EB4A54E43A11D180EBA57E4B89D0048C9DD2604A9E0608120018B9E0' +
                        '2F6EE63025FEEBCED3293B622AF8581334D0BDAB7541A9E7411E7EE4EF0BC5D0E',
                        signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                        type: 16718,
                        version: 36865,
                    },
                };

                const transferTransaction = CreateTransactionFromDTO(registerNamespaceTransactionDTO);

                ValidateTransaction.validateStandaloneTx(transferTransaction, registerNamespaceTransactionDTO);
            });

            it('aggregate', () => {
                const aggregateRegisterNamespaceTransactionDTO = {
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
                                    duration: [
                                        1000,
                                        0,
                                    ],
                                    name: 'a2p1mg',
                                    namespaceId: [
                                        437145074,
                                        4152736179,
                                    ],
                                    namespaceType: 0,
                                    signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                                    type: 16718,
                                    version: 36865,
                                },
                            },
                        ],
                        type: 16705,
                        version: 36865,
                    },
                };

                const aggregateRegisterNamespaceTransaction = CreateTransactionFromDTO(
                    aggregateRegisterNamespaceTransactionDTO,
                );

                ValidateTransaction.validateAggregateTx(
                    aggregateRegisterNamespaceTransaction, aggregateRegisterNamespaceTransactionDTO);
            });
        });

        describe('subnamespace', () => {
            it('standalone', () => {
                const registerNamespaceTransactionDTO = {
                    meta: {
                        hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                        height: [
                            1,
                            0,
                        ],
                        id: '59FDA0733F17CF0001772CA7',
                        index: 19,
                        merkleComponentHash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                    },
                    transaction: {
                        deadline: [
                            1,
                            0,
                        ],
                        maxFee: [
                            0,
                            0,
                        ],
                        name: '0unius',
                        namespaceId: [
                            1970060410,
                            3289875941,
                        ],
                        namespaceType: 1,
                        parentId: [
                            3316183705,
                            3829351378,
                        ],
                        signature: '553E696EB4A54E43A11D180EBA57E4B89D0048C9DD2604A9E0608120018B9' +
                        'E02F6EE63025FEEBCED3293B622AF8581334D0BDAB7541A9E7411E7EE4EF0BC5D0E',
                        signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                        type: 16718,
                        version: 36865,
                    },
                };
                const transferTransaction = CreateTransactionFromDTO(registerNamespaceTransactionDTO);

                ValidateTransaction.validateStandaloneTx(transferTransaction, registerNamespaceTransactionDTO);
            });

            it('aggregate', () => {
                const aggregateRegisterNamespaceTransactionDTO = {
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
                                    name: '0unius',
                                    namespaceId: [
                                        1970060410,
                                        3289875941,
                                    ],
                                    namespaceType: 1,
                                    parentId: [
                                        3316183705,
                                        3829351378,
                                    ],
                                    signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                                    type: 16718,
                                    version: 36865,
                                },
                            },
                        ],
                        type: 16705,
                        version: 36865,
                    },
                };

                const aggregateRegisterNamespaceTransaction = CreateTransactionFromDTO(
                    aggregateRegisterNamespaceTransactionDTO);

                ValidateTransaction.validateAggregateTx(
                    aggregateRegisterNamespaceTransaction, aggregateRegisterNamespaceTransactionDTO);
            });
        });
    });

    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const mosaicDefinitionTransactionDTO = {
                meta: {
                    hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                    height: [
                        1,
                        0,
                    ],
                    id: '59FDA0733F17CF0001772CA7',
                    index: 19,
                    merkleComponentHash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                },
                transaction: {
                    deadline: [
                        1,
                        0,
                    ],
                    maxFee: [
                        0,
                        0,
                    ],
                    mosaicId: [
                        3248159581,
                        740240531,
                    ],
                    nonce: [
                        1,
                        0,
                    ],
                    properties: [
                        {
                            id: 0,
                            value: [
                                7,
                                0,
                            ],
                        },
                        {
                            id: 1,
                            value: [
                                6,
                                0,
                            ],
                        },
                        {
                            id: 2,
                            value: [
                                1000,
                                0,
                            ],
                        },
                    ],
                    signature: '553E696EB4A54E43A11D180EBA57E4B89D0048C9DD2604A9E0608120018B9E02F6EE63025FE' +
                    'EBCED3293B622AF8581334D0BDAB7541A9E7411E7EE4EF0BC5D0E',
                    signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    type: 16717,
                    version: 36865,
                },
            };

            const mosaicDefinitionTransaction = CreateTransactionFromDTO(mosaicDefinitionTransactionDTO);

            ValidateTransaction.validateStandaloneTx(mosaicDefinitionTransaction, mosaicDefinitionTransactionDTO);
        });

        it('aggregate', () => {
            const aggregateMosaicDefinitionTransactionDTO = {
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
                                mosaicId: [
                                    3248159581,
                                    740240531,
                                ],
                                nonce: [
                                    1,
                                    0,
                                ],
                                properties: [
                                    {
                                        id: 0,
                                        value: [
                                            7,
                                            0,
                                        ],
                                    },
                                    {
                                        id: 1,
                                        value: [
                                            6,
                                            0,
                                        ],
                                    },
                                    {
                                        id: 2,
                                        value: [
                                            1000,
                                            0,
                                        ],
                                    },
                                ],
                                signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                                type: 16717,
                                version: 36865,
                            },
                        },
                    ],
                    type: 16705,
                    version: 36865,
                },
            };

            const aggregateRegisterNamespaceTransaction = CreateTransactionFromDTO(
                aggregateMosaicDefinitionTransactionDTO);

            ValidateTransaction.validateAggregateTx(
                aggregateRegisterNamespaceTransaction, aggregateMosaicDefinitionTransactionDTO);
        });
    });

    describe('MosaicSupplyChangeTransaction', () => {
        it('standalone', () => {
            const mosaicSupplyChangeTransactionDTO = {
                meta: {
                    hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                    height: [
                        1,
                        0,
                    ],
                    id: '59FDA0733F17CF0001772CA7',
                    index: 19,
                    merkleComponentHash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                },
                transaction: {
                    deadline: [
                        1,
                        0,
                    ],
                    delta: [
                        100000,
                        0,
                    ],
                    direction: 1,
                    maxFee: [
                        0,
                        0,
                    ],
                    mosaicId: [
                        3070467832,
                        2688515262,
                    ],
                    signature: '553E696EB4A54E43A11D180EBA57E4B89D0048C9DD2604A9E0608120018B9E0' +
                    '2F6EE63025FEEBCED3293B622AF8581334D0BDAB7541A9E7411E7EE4EF0BC5D0E',
                    signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    type: 16973,
                    version: 36865,
                },
            };

            const mosaicSupplyChangeTransaction = CreateTransactionFromDTO(mosaicSupplyChangeTransactionDTO);

            ValidateTransaction.validateStandaloneTx(mosaicSupplyChangeTransaction, mosaicSupplyChangeTransactionDTO);
        });

        it('aggregate', () => {
            const aggregateMosaicSupplyChangeTransactionDTO = {
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
                                delta: [
                                    100000,
                                    0,
                                ],
                                direction: 1,
                                mosaicId: [
                                    3070467832,
                                    2688515262,
                                ],
                                signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                                type: 16973,
                                version: 36865,
                            },
                        },
                    ],
                    type: 16705,
                    version: 36865,
                },
            };

            const aggregateMosaicSupplyChangeTransaction = CreateTransactionFromDTO(
                aggregateMosaicSupplyChangeTransactionDTO);

            ValidateTransaction.validateAggregateTx(
                aggregateMosaicSupplyChangeTransaction, aggregateMosaicSupplyChangeTransactionDTO);
        });
    });

    describe('ModifyMultisigAccountTransaction', () => {
        it('standalone', () => {
            const modifyMultisigAccountTransactionDTO = {
                meta: {
                    hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                    height: [
                        1,
                        0,
                    ],
                    id: '59FDA0733F17CF0001772CA7',
                    index: 19,
                    merkleComponentHash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
                },
                transaction: {
                    deadline: [
                        1,
                        0,
                    ],
                    maxFee: [
                        0,
                        0,
                    ],
                    minApprovalDelta: 1,
                    minRemovalDelta: 1,
                    modifications: [
                        {
                            cosignatoryPublicKey: '76C1622C7FB58986E500228E8FFB30C606CAAFC1CD78E770E82C73DAB7BD7C9F',
                            type: 0,
                        },
                    ],
                    signature: '553E696EB4A54E43A11D180EBA57E4B89D0048C9DD2604A9E0608120018B9E0' +
                    '2F6EE63025FEEBCED3293B622AF8581334D0BDAB7541A9E7411E7EE4EF0BC5D0E',
                    signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    type: 16725,
                    version: 36865,
                },
            };

            const modifyMultisigAccountTransaction = CreateTransactionFromDTO(modifyMultisigAccountTransactionDTO);

            ValidateTransaction.validateStandaloneTx(
                modifyMultisigAccountTransaction, modifyMultisigAccountTransactionDTO);
        });

        it('aggregate', () => {
            const aggregateModifyMultisigAccountTransactionDTO = {
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
                                version: 36865,
                            },
                        },
                    ],
                    type: 16705,
                    version: 36865,
                },
            };

            const aggregateModifyMultisigAccountTransaction = CreateTransactionFromDTO(
                aggregateModifyMultisigAccountTransactionDTO);

            ValidateTransaction.validateAggregateTx(
                aggregateModifyMultisigAccountTransaction, aggregateModifyMultisigAccountTransactionDTO);
        });
    });
});
