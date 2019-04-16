/*
 * Copyright 2019 NEM
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

import { deepEqual } from 'assert';
import { TestingAccount } from '../../../e2e/conf/conf.spec';
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
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';
import { ReceiptVersion } from '../../../src/model/receipt/ReceiptVersion';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { TransactionStatement } from '../../../src/model/receipt/TransactionStatement';
import { UInt64 } from '../../../src/model/UInt64';

describe('Receipt', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete a balance transfer receipt', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 19730,
            sender: account.publicKey,
            recipient: account.address.plain(),
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };

        const receipt = new BalanceTransferReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            PublicAccount.createFromPublicKey(receiptDTO.sender, NetworkType.MIJIN_TEST),
            Address.createFromRawAddress(receiptDTO.recipient),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromUint(receiptDTO.amount),
        );

        deepEqual(receipt.amount.compact(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Levy);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
    });

    it('should createComplete a balance transfer receipt - Mosaic Rental Fee', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 17377,
            sender: account.publicKey,
            recipient: account.address.plain(),
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };

        const receipt = new BalanceTransferReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            PublicAccount.createFromPublicKey(receiptDTO.sender, NetworkType.MIJIN_TEST),
            Address.createFromRawAddress(receiptDTO.recipient),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromUint(receiptDTO.amount),
        );

        deepEqual(receipt.amount.compact(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Rental_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_TRANSFER);
    });

    it('should createComplete a balance change receipt - Harvest Fee', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 17185,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };

        const receipt = new BalanceChangeReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            PublicAccount.createFromPublicKey(receiptDTO.account, NetworkType.MIJIN_TEST),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromUint(receiptDTO.amount),
        );

        deepEqual(receipt.account.publicKey, receiptDTO.account);
        deepEqual(receipt.amount.compact(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.Harvest_Fee);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete a balance change receipt - LockHash', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 18481,
            account: account.publicKey,
            mosaicId: [3646934825, 3576016193],
            amount: 1000,
        };

        const receipt = new BalanceChangeReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            PublicAccount.createFromPublicKey(receiptDTO.account, NetworkType.MIJIN_TEST),
            new MosaicId(receiptDTO.mosaicId),
            UInt64.fromUint(receiptDTO.amount),
        );

        deepEqual(receipt.account.publicKey, receiptDTO.account);
        deepEqual(receipt.amount.compact(), receiptDTO.amount);
        deepEqual(receipt.mosaicId.toDTO().id, receiptDTO.mosaicId);
        deepEqual(receipt.type, ReceiptType.LockHash_Created);
        deepEqual(receipt.version, ReceiptVersion.BALANCE_CHANGE);
    });

    it('should createComplete an artifact expiry receipt - address', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 20033,
            artifactId: [3646934825, 3576016193],
        };

        const receipt = new ArtifactExpiryReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            new NamespaceId([3646934825, 3576016193]),
        );

        deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Namespace_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete an artifact expiry receipt - mosaic', () => {
        const receiptDTO = {
            size: 1,
            version: 1,
            type: 19777,
            artifactId: [3646934825, 3576016193],
        };

        const receipt = new ArtifactExpiryReceipt(
            receiptDTO.size,
            receiptDTO.version,
            receiptDTO.type,
            new MosaicId(receiptDTO.artifactId),
        );
        deepEqual(receipt.artifactId.toDTO().id, receiptDTO.artifactId);
        deepEqual(receipt.type, ReceiptType.Mosaic_Expired);
        deepEqual(receipt.version, ReceiptVersion.ARTIFACT_EXPIRY);
    });

    it('should createComplete a transaction statement', () => {
        const receipt = {
            size: 1,
            version: 1,
            type: 19777,
            artifactId: [3646934825, 3576016193],
        };

        const statementDto = {
            size: 1,
            version: 1,
            type: 17377,
            m_source: {primaryId: 1, secondaryId: 1},
            receipts: [
                receipt,
            ],
        };

        const statement = new TransactionStatement(
            statementDto.size,
            statementDto.version,
            statementDto.type,
            new ReceiptSource( statementDto.m_source.primaryId, statementDto.m_source.secondaryId),
            statementDto.receipts.map((receipt) =>
            new ArtifactExpiryReceipt(
                receipt.size,
                receipt.version,
                receipt.type,
                new MosaicId(receipt.artifactId),
            )),
        );
        deepEqual(statement.m_source.primaryId, statementDto.m_source.primaryId);
        deepEqual(statement.m_source.secondaryId, statementDto.m_source.secondaryId);
        deepEqual(statement.type, ReceiptType.Transaction_Group);
        deepEqual(statement.version, ReceiptVersion.TRANSACTION_STATEMENT);
        deepEqual((statement.receipts[0] as ArtifactExpiryReceipt).artifactId.toDTO().id, receipt.artifactId);
    });

    it('should createComplete resolution statement - mosaic', () => {

        const mosaicAlias = [3576016193, 3646934825];
        const statementDTO = {
            size: 1,
            version: 1,
            type: 17394,
            unresolved: [3646934825, 3576016193],
            m_entries: [{
                source: {primaryId: 1, secondaryId: 1},
                resolvedValue: mosaicAlias,
            }],
        };

        const statement = new ResolutionStatement(
            statementDTO.size,
            statementDTO.version,
            statementDTO.type,
            new MosaicId(statementDTO.unresolved),
            statementDTO.m_entries.map((resolved) => {
                return new ResolutionEntry(new MosaicAlias(AliasType.Mosaic, new MosaicId(resolved.resolvedValue)),
                new ReceiptSource( resolved.source.primaryId, resolved.source.secondaryId));
            }),
        );
        deepEqual((statement.unresolved as MosaicId).toDTO().id, statementDTO.unresolved);
        deepEqual(statement.type, ReceiptType.Mosaic_Alias_Resolution);
        deepEqual(statement.version, ReceiptVersion.RESOLUTION_STATEMENT);
        deepEqual((statement.m_entries[0].resolvedValue as MosaicAlias).mosaicId.toDTO().id, mosaicAlias);
    });

    it('should createComplete resolution statement - address', () => {
        const addressAlias = Address.createFromRawAddress('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2').plain();
        const statementDTO = {
            size: 1,
            version: 1,
            type: 17393,
            unresolved: account.address.plain(),
            m_entries: [{
                source: {primaryId: 1, secondaryId: 1},
                resolvedValue: addressAlias,
            }],
        };

        const statement = new ResolutionStatement(
            statementDTO.size,
            statementDTO.version,
            statementDTO.type,
            Address.createFromRawAddress(statementDTO.unresolved),
            statementDTO.m_entries.map((resolved) => {
                return new ResolutionEntry(new AddressAlias(AliasType.Address, Address.createFromRawAddress(resolved.resolvedValue)),
                new ReceiptSource( resolved.source.primaryId, resolved.source.secondaryId));
            }),
        );
        deepEqual((statement.unresolved as Address).plain(), account.address.plain());
        deepEqual(statement.type, ReceiptType.Address_Alias_Resolution);
        deepEqual(statement.version, ReceiptVersion.RESOLUTION_STATEMENT);
        deepEqual((statement.m_entries[0].resolvedValue as AddressAlias).address.plain(), addressAlias);
    });

});
