/*
 * Copyright 2019 NEM
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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import {
    createAddressResolutionStatement,
    createMosaicResolutionStatement,
    CreateReceiptFromDTO,
    createTransactionStatement,
} from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ArtifactExpiryReceipt } from '../../../src/model/receipt/ArtifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../../src/model/receipt/BalanceChangeReceipt';
import { BalanceTransferReceipt } from '../../../src/model/receipt/BalanceTransferReceipt';
import { InflationReceipt } from '../../../src/model/receipt/InflationReceipt';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';
import { ReceiptVersion } from '../../../src/model/receipt/ReceiptVersion';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { TransactionStatement } from '../../../src/model/receipt/TransactionStatement';
import { UInt64 } from '../../../src/model/UInt64';
import { Convert } from '../../../src/core/format/Convert';

describe('Receipt', () => {
    let account: Account;
    let transactionStatementsDTO;
    let addressResolutionStatementsDTO;
    let mosaicResolutionStatementsDTO;
    let statementDTO;

    before(() => {
        account = Account.createFromPrivateKey(
            'D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D',
            NetworkType.PRIVATE_TEST,
        );
        transactionStatementsDTO = [
            {
                statement: {
                    height: '52',
                    source: {
                        primaryId: 0,
                        secondaryId: 0,
                    },
                    receipts: [
                        {
                            version: 1,
                            type: 8515,
                            targetAddress: account.address.encoded(),
                            mosaicId: '85BBEA6CC462B244',
                            amount: '1000',
                        },
                    ],
                },
            },
        ];
        addressResolutionStatementsDTO = [
            {
                statement: {
                    height: '1488',
                    unresolved: '9103B60AAF27626883000000000000000000000000000000',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 4,
                                secondaryId: 0,
                            },
                            resolved: '917E7E29A01014C2F3000000000000000000000000000000',
                        },
                    ],
                },
            },
            {
                statement: {
                    height: '1488',
                    unresolved: '917E7E29A01014C2F3000000000000000000000000000000',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 2,
                                secondaryId: 0,
                            },
                            resolved: '9103B60AAF27626883000000000000000000000000000000',
                        },
                    ],
                },
            },
        ];
        mosaicResolutionStatementsDTO = [
            {
                statement: {
                    height: '1506',
                    unresolved: '85BBEA6CC462B244',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 0,
                            },
                            resolved: '941299B2B7E1291C',
                        },
                    ],
                },
            },
            {
                statement: {
                    height: '1506',
                    unresolved: '85BBEA6CC462B244',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 5,
                                secondaryId: 0,
                            },
                            resolved: '941299B2B7E1291C',
                        },
                    ],
                },
            },
        ];

        statementDTO = {
            transactionStatements: transactionStatementsDTO,
            addressResolutionStatements: addressResolutionStatementsDTO,
            mosaicResolutionStatements: mosaicResolutionStatementsDTO,
        };
    });

    it('should createComplete a balance transfer receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 4685,
            senderAddress: account.address.encoded(),
            recipientAddress: '9103B60AAF27626883000000000000000000000000000000',
            mosaicId: '941299B2B7E1291C',
            amount: '1000',
        };
        const receipt = new BalanceTransferReceipt(
            Address.createFromEncoded(receiptDTO.senderAddress),
            Address.createFromEncoded(receiptDTO.recipientAddress),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromNumericString(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.senderAddress.encoded(), receiptDTO.senderAddress);
        deepEqual(receipt.amount.toString(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toHex(), receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Levy);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
        deepEqual(receipt.recipientAddress, Address.createFromEncoded('9103B60AAF27626883000000000000000000000000000000'));
    });

    it('should createComplete a balance transfer receipt - Mosaic Rental Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 4685,
            senderAddress: account.address.encoded(),
            recipientAddress: '9103B60AAF27626883000000000000000000000000000000',
            mosaicId: '941299B2B7E1291C',
            amount: '1000',
        };

        const receipt = new BalanceTransferReceipt(
            Address.createFromEncoded(receiptDTO.senderAddress),
            Address.createFromEncoded(receiptDTO.recipientAddress),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromNumericString(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.senderAddress.encoded(), receiptDTO.senderAddress);
        deepEqual(receipt.amount.toString(), receiptDTO.amount);
        deepEqual(receipt.recipientAddress, Address.createFromEncoded('9103B60AAF27626883000000000000000000000000000000'));
        deepEqual(receipt.mosaicId.toHex(), receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Rental_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
    });

    it('should createComplete a balance change receipt - Harvest Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 8515,
            targetAddress: account.address.encoded(),
            mosaicId: '941299B2B7E1291C',
            amount: '1000',
        };

        const receipt = new BalanceChangeReceipt(
            Address.createFromEncoded(receiptDTO.targetAddress),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromNumericString(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.targetAddress.encoded(), receiptDTO.targetAddress);
        deepEqual(receipt.amount.toString(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toHex(), receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Harvest_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete a balance change receipt - LockHash', () => {
        const receiptDTO = {
            version: 1,
            type: 12616,
            targetAddress: account.address.encoded(),
            mosaicId: '941299B2B7E1291C',
            amount: '1000',
        };

        const receipt = new BalanceChangeReceipt(
            Address.createFromEncoded(receiptDTO.targetAddress),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromNumericString(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.targetAddress.encoded(), receiptDTO.targetAddress);
        deepEqual(receipt.amount.toString(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toHex().toUpperCase(), receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.LockHash_Created);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete an artifact expiry receipt - address', () => {
        const receiptDTO = {
            version: 1,
            type: 16718,
            artifactId: 'D525AD41D95FCF29',
        };

        const receipt = new ArtifactExpiryReceipt(new NamespaceId([3646934825, 3576016193]), receiptDTO.version, receiptDTO.type);

        deepEqual(receipt.artifactId.id.toHex().toUpperCase(), receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Namespace_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete an artifact expiry receipt - mosaic', () => {
        const receiptDTO = {
            version: 1,
            type: 16717,
            artifactId: '941299B2B7E1291C',
        };

        const receipt = new ArtifactExpiryReceipt(new MosaicId(receiptDTO.artifactId), receiptDTO.version, receiptDTO.type);
        deepEqual(receipt.artifactId.toHex().toUpperCase(), receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete a transaction statement', () => {
        const statementDto = transactionStatementsDTO[0];
        const statement = new TransactionStatement(
            statementDto.statement.height,
            new ReceiptSource(statementDto.statement.source.primaryId, statementDto.statement.source.secondaryId),
            statementDto.statement.receipts.map((receipt) => CreateReceiptFromDTO(receipt)),
        );
        deepEqual(statement.source.primaryId, statementDto.statement.source.primaryId);
        deepEqual(statement.source.secondaryId, statementDto.statement.source.secondaryId);
        deepEqual((statement.receipts[0] as BalanceChangeReceipt).targetAddress, account.address);
    });

    it('should createComplete resolution statement - mosaic', () => {
        const statementDto = mosaicResolutionStatementsDTO[0];
        const statement = new ResolutionStatement(
            ResolutionType.Mosaic,
            statementDto.statement.height,
            new MosaicId(statementDto.statement.unresolved),
            statementDto.statement.resolutionEntries.map((resolved) => {
                return new ResolutionEntry(
                    new MosaicId(resolved.resolved),
                    new ReceiptSource(resolved.source.primaryId, resolved.source.secondaryId),
                );
            }),
        );
        deepEqual((statement.unresolved as MosaicId).toHex(), statementDto.statement.unresolved);
        deepEqual((statement.resolutionEntries[0].resolved as MosaicId).toHex(), '941299B2B7E1291C');
    });

    it('should createComplete resolution statement - address', () => {
        const statementDto = addressResolutionStatementsDTO[0];
        const statement = new ResolutionStatement(
            ResolutionType.Address,
            statementDto.statement.height,
            Address.createFromEncoded(statementDto.statement.unresolved),
            statementDto.statement.resolutionEntries.map((resolved) => {
                return new ResolutionEntry(
                    Address.createFromEncoded(resolved.resolved),
                    new ReceiptSource(resolved.source.primaryId, resolved.source.secondaryId),
                );
            }),
        );
        deepEqual(
            (statement.unresolved as Address).plain(),
            Address.createFromEncoded('9103B60AAF27626883000000000000000000000000000000').plain(),
        );
        deepEqual(
            (statement.resolutionEntries[0].resolved as Address).plain(),
            Address.createFromEncoded('917E7E29A01014C2F3000000000000000000000000000000').plain(),
        );
    });

    it('should createComplete a inflation receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 20803,
            mosaicId: '941299B2B7E1291C',
            amount: '1000',
        };

        const receipt = new InflationReceipt(
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromNumericString(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.amount.compact().toString(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toHex().toUpperCase(), receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Inflation);
        deepEqual(receipt.version, ReceiptVersion.INFLATION_RECEIPT);
    });

    it('should generate hash for MosaicResolutionStatement', () => {
        const receipt = createMosaicResolutionStatement(statementDTO.mosaicResolutionStatements[0]);
        const hash = receipt.generateHash(NetworkType.MAIN_NET);
        expect(hash).to.be.equal('DE29FB6356530E5D1FBEE0A84202520C155D882C46EA74456752D6C75F0707B3');
    });

    it('should generate hash for AddressResolutionStatement', () => {
        const receipt = createAddressResolutionStatement(statementDTO.addressResolutionStatements[0]);
        const hash = receipt.generateHash(NetworkType.MAIN_NET);
        expect(hash).to.be.equal('AA9B667C37C8A19902F3E1098FCEE681318455551CC2FBE9B81E8FA47007CA79');
    });

    it('should generate hash for TransactionStatement', () => {
        const receipt = createTransactionStatement(statementDTO.transactionStatements[0]);
        const hash = receipt.generateHash();
        expect(hash).to.be.equal('E73E67382162C38AED77D5D5D67F96AA590DC12FF13AE263AA50932896AC4801');
    });

    it('artifactExpiryReceipt - serialize', () => {
        const receipt = new ArtifactExpiryReceipt(new NamespaceId([3646934825, 3576016193]), 1, 16718);
        const byte = receipt.serialize();
        expect(Convert.uint8ToHex(byte)).to.be.equal('01004E4129CF5FD941AD25D5');
    });

    it('artifactExpiryReceipt - serialize', () => {
        const receipt = new ArtifactExpiryReceipt(new MosaicId([3646934825, 3576016193]), 1, 16717);
        const byte = receipt.serialize();
        expect(Convert.uint8ToHex(byte)).to.be.equal('01004D4129CF5FD941AD25D5');
    });
});
