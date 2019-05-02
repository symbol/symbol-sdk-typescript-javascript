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

import { Address } from '../../model/account/Address';
import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import { NamespaceId } from '../../model/model';
import {MosaicId} from '../../model/mosaic/MosaicId';
import { ArtifactExpiryReceipt } from '../../model/receipt/ArtifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../model/receipt/BalanceChangeReceipt';
import { BalanceTransferReceipt } from '../../model/receipt/BalanceTransferReceipt';
import { InflationReceipt } from '../../model/receipt/InflationReceipt';
import { Receipt } from '../../model/receipt/Receipt';
import { ReceiptSource } from '../../model/receipt/ReceiptSource';
import { ReceiptType } from '../../model/receipt/ReceiptType';
import { ResolutionEntry } from '../../model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../model/receipt/ResolutionStatement';
import { Statement } from '../../model/receipt/Statement';
import { TransactionStatement } from '../../model/receipt/TransactionStatement';
import {UInt64} from '../../model/UInt64';

/**
 * @internal
 * @param receiptDTO
 * @returns {Statement}
 * @constructor
 */
export const CreateStatementFromDTO = (receiptDTO): Statement => {
    return new Statement(
        receiptDTO.transactionStatements.map((statement) => createTransactionStatement(statement)),
        receiptDTO.addressResolutionStatements.map((statement) => createResolutionStatement(statement)),
        receiptDTO.mosaicResolutionStatements.map((statement) => createResolutionStatement(statement)),
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {Receipt}
 * @constructor
 */
export const CreateReceiptFromDTO = (receiptDTO): Receipt => {
    switch (receiptDTO.type) {
        case ReceiptType.Harvest_Fee:
        case ReceiptType.LockHash_Created:
        case ReceiptType.LockHash_Completed:
        case ReceiptType.LockHash_Expired:
        case ReceiptType.LockSecret_Created:
        case ReceiptType.LockSecret_Completed:
        case ReceiptType.LockSecret_Expired:
            return createBalanceChangeReceipt(receiptDTO);
        case ReceiptType.Mosaic_Levy:
        case ReceiptType.Mosaic_Rental_Fee:
        case ReceiptType.Namespace_Rental_Fee:
            return createBalanceTransferReceipt(receiptDTO);
        case ReceiptType.Mosaic_Expired:
        case ReceiptType.Namespace_Expired:
            return  createArtifactExpiryReceipt(receiptDTO);
        case ReceiptType.Inflation:
            return createInflationReceipt(receiptDTO);
        default:
            throw new Error(`Receipt type: ${receiptDTO.type} not recognized.`);
    }
};

/**
 * @internal
 * @param statementDTO
 * @returns {ResolutionStatement}
 * @constructor
 */
const createResolutionStatement = (statementDTO): ResolutionStatement => {
    return new ResolutionStatement(
        statementDTO.height,
        typeof statementDTO.unresolved === 'string' ? statementDTO.unresolved : new UInt64(statementDTO.unresolved),
        statementDTO.resolutionEntries.map((entry) => {
            return new ResolutionEntry(entry.resolvedValue,
                new ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
        }),
    );
};

/**
 * @internal
 * @param statementDTO
 * @returns {TransactionStatement}
 * @constructor
 */
const createTransactionStatement = (statementDTO): TransactionStatement => {
    return new TransactionStatement(
        statementDTO.height,
        new ReceiptSource(statementDTO.source.primaryId, statementDTO.source.secondaryId),
        statementDTO.receipts.map((receipt) => {
            return CreateReceiptFromDTO(receipt);
        }),
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {BalanceChangeReceipt}
 * @constructor
 */
const createBalanceChangeReceipt = (receiptDTO): Receipt => {
    return new BalanceChangeReceipt(
        receiptDTO.account,
        new MosaicId(receiptDTO.mosaicId),
        new UInt64(receiptDTO.amount),
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {BalanceTransferReceipt}
 * @constructor
 */
const createBalanceTransferReceipt = (receiptDTO): Receipt => {
    return new BalanceTransferReceipt(
        receiptDTO.sender,
        Address.createFromRawAddress(receiptDTO.recipient),
        new MosaicId(receiptDTO.mosaicId),
        new UInt64(receiptDTO.amount),
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {ArtifactExpiryReceipt}
 * @constructor
 */
const createArtifactExpiryReceipt = (receiptDTO): Receipt => {
    return new ArtifactExpiryReceipt(
        extractArtifactId(receiptDTO.type, receiptDTO.artifactId),
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {InflationReceipt}
 * @constructor
 */
const createInflationReceipt = (receiptDTO): Receipt => {
    return new InflationReceipt(
        new MosaicId(receiptDTO.mosaicId),
        new UInt64(receiptDTO.amount),
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
    );
};

const extractReceiptVersion = (version: number): number => {
    return parseInt(version.toString(16).substr(2, 2), 16);
};

const extractArtifactId = (receiptType: ReceiptType, id: number[]): MosaicId | NamespaceId => {
    switch (receiptType) {
        case ReceiptType.Mosaic_Expired:
            return new MosaicId(id);
        case ReceiptType.Namespace_Expired:
            return new NamespaceId(id);
        default:
            throw new Error('Receipt type is not supported.');
    }
};
