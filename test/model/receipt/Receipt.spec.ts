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
import { MultisigAccount, TestingAccount } from '../../../e2e/conf/conf.spec';
import {Account} from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { AddressAlias } from '../../../src/model/namespace/AddressAlias';
import { AliasType } from '../../../src/model/namespace/AliasType';
import { MosaicAlias } from '../../../src/model/namespace/MosaicAlias';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { ArtifactExpiryReceipt } from '../../../src/model/receipt/ArtifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../../src/model/receipt/BalanceChangeReceipt';
import { BalanceTransferReceipt } from '../../../src/model/receipt/BalanceTransferReceipt';
import { InflationReceipt } from '../../../src/model/receipt/InflationReceipt';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';
import { ReceiptVersion } from '../../../src/model/receipt/ReceiptVersion';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { TransactionStatement } from '../../../src/model/receipt/TransactionStatement';
import { UInt64 } from '../../../src/model/UInt64';
import { CreateReceiptFromDTO } from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { address } from 'nem2-library';

describe('Receipt', () => {
    let account: Account;
    let account2: Account;
    let transactionStatementsDTO;
    let addressResolutionStatementsDTO;
    let mosaicResolutionStatementsDTO;

    before(() => {
        account = TestingAccount;
        account2 = MultisigAccount;
        transactionStatementsDTO = [
            {
                height: [52, 0],
                source: {
                  primaryId: 0,
                  secondaryId: 0,
                },
                receipts: [
                    {
                        version: 1,
                        type: 17185,
                        account: account.publicKey,
                        mosaicId: [3646934825, 3576016193],
                        amount: [1000, 0],
                    },
                ],
            },
        ];
        addressResolutionStatementsDTO = [
            {
                height: [1488, 0],
                unresolved: '9103B60AAF2762688300000000000000000000000000000000',
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 4,
                      secondaryId: 0,
                    },
                    resolved: account.address.plain(),
                  },
                ],
            },
            {
                height: [1488, 0],
                unresolved: '917E7E29A01014C2F300000000000000000000000000000000',
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 2,
                      secondaryId: 0,
                    },
                    resolved: account.address.plain(),
                  },
                ],
            },
        ];
        mosaicResolutionStatementsDTO = [
            {
                height: [
                  1506,
                  0,
                ],
                unresolved: [
                  4014740460,
                  2448037180,
                ],
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 1,
                      secondaryId: 0,
                    },
                    resolved: '08a12f89ee5a49f8',
                  },
                ],
            },
            {
                height: [
                  1506,
                  0,
                ],
                unresolved: [
                  2234768168,
                  2553890912,
                ],
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 5,
                      secondaryId: 0,
                    },
                    resolved: '08a12f89ee5a49f8',
                  },
                ],
            }
        ];
    });

    it('should createComplete a balance transfer receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 19730,
            sender: account.publicKey,
            recipient: account.address.plain(),
            mosaicId: [481110499, 231112638],
            amount: [1000, 0],
          };
        const receipt = new BalanceTransferReceipt(
            receiptDTO.sender,
            Address.createFromRawAddress(receiptDTO.recipient),
            new MosaicId(receiptDTO.mosaicId),
            new UInt64(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Levy);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
    });

    it('should createComplete a balance transfer receipt - Mosaic Rental Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 17377,
            sender: account.publicKey,
            recipient: account.address.plain(),
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };

        const receipt = new BalanceTransferReceipt(
            receiptDTO.sender,
            Address.createFromRawAddress(receiptDTO.recipient),
            new MosaicId(receiptDTO.mosaicId),
            new UInt64(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Rental_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
    });

    it('should createComplete a balance change receipt - Harvest Fee', () => {
        const receiptDTO = {
            version: 1,
            type: 17185,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };

        const receipt = new BalanceChangeReceipt(
            receiptDTO.account,
            new MosaicId(receiptDTO.mosaicId),
            new UInt64(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.account, receiptDTO.account);
        deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Harvest_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete a balance change receipt - LockHash', () => {
        const receiptDTO = {
            version: 1,
            type: 18481,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: [1000, 0],
        };

        const receipt = new BalanceChangeReceipt(
            receiptDTO.account,
            new MosaicId(receiptDTO.mosaicId),
            new UInt64(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.account, receiptDTO.account);
        deepEqual(receipt.amount.toDTO(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.LockHash_Created);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete an artifact expiry receipt - address', () => {
        const receiptDTO = {
            version: 1,
            type: 20033,
            artifactId: [3646934825, 3576016193],
        };

        const receipt = new ArtifactExpiryReceipt(
            new NamespaceId([3646934825, 3576016193]),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Namespace_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete an artifact expiry receipt - mosaic', () => {
        const receiptDTO = {
            version: 1,
            type: 19777,
            artifactId: [3646934825, 3576016193],
        };

        const receipt = new ArtifactExpiryReceipt(
            new MosaicId(receiptDTO.artifactId),
            receiptDTO.version,
            receiptDTO.type,
        );
        deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete a transaction statement', () => {
        const statementDto = transactionStatementsDTO[0];
        const statement = new TransactionStatement(
            statementDto.height,
            new ReceiptSource( statementDto.source.primaryId, statementDto.source.secondaryId),
            statementDto.receipts.map((receipt) =>
            CreateReceiptFromDTO(receipt)),
        );
        deepEqual(statement.source.primaryId, statementDto.source.primaryId);
        deepEqual(statement.source.secondaryId, statementDto.source.secondaryId);
        deepEqual((statement.receipts[0] as BalanceChangeReceipt).account, account.publicKey);
    });

    it('should createComplete resolution statement - mosaic', () => {
        const statementDto = mosaicResolutionStatementsDTO[0];
        const statement = new ResolutionStatement(
            statementDto.height,
            new MosaicId(statementDto.unresolved),
            statementDto.resolutionEntries.map((resolved) => {
                return new ResolutionEntry(new MosaicAlias(AliasType.Mosaic, new MosaicId(resolved.resolved)),
                new ReceiptSource( resolved.source.primaryId, resolved.source.secondaryId));
            }),
        );
        deepEqual((statement.unresolved as MosaicId).toDTO().id, statementDto.unresolved);
        deepEqual((statement.resolutionEntries[0].resolved as MosaicAlias).mosaicId.toDTO(), [2301600008, 4165556974]);
    });

    it('should createComplete resolution statement - address', () => {
        const statementDto = addressResolutionStatementsDTO[0];
        const statement = new ResolutionStatement(
            statementDto.height,
            Address.createFromEncoded(statementDto.unresolved),
            statementDto.resolutionEntries.map((resolved) => {
                return new ResolutionEntry(new AddressAlias(AliasType.Address, Address.createFromRawAddress(resolved.resolved)),
                new ReceiptSource( resolved.source.primaryId, resolved.source.secondaryId));
            }),
        );
        deepEqual((statement.unresolved as Address).plain(), 'SEB3MCVPE5RGRAYAAAAAAAAAAAAAAAAAAAAAAAAA');
        deepEqual((statement.resolutionEntries[0].resolved as AddressAlias).address.plain(), 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
    });

    it('should createComplete a inflation receipt', () => {
        const receiptDTO = {
            version: 1,
            type: 20803,
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };

        const receipt = new InflationReceipt(
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromUint(receiptDTO.amount),
            receiptDTO.version,
            receiptDTO.type,
        );

        deepEqual(receipt.amount.compact(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Inflation);
        deepEqual(receipt.version, ReceiptVersion.INFLATION_RECEIPT);
    });
});
