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
import {MosaicId} from '../../model/mosaic/MosaicId';
import { AddressAlias } from '../../model/namespace/AddressAlias';
import { AliasType } from '../../model/namespace/AliasType';
import { MosaicAlias } from '../../model/namespace/MosaicAlias';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { ArtifactExpiryReceipt } from '../../model/receipt/ArtifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../model/receipt/BalanceChangeReceipt';
import { BalanceTransferReceipt } from '../../model/receipt/BalanceTransferReceipt';
import { InflationReceipt } from '../../model/receipt/InflationReceipt';
import { Receipt } from '../../model/receipt/Receipt';
import { ReceiptSource } from '../../model/receipt/ReceiptSource';
import { ReceiptType } from '../../model/receipt/ReceiptType';
import { ResolutionEntry } from '../../model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../model/receipt/ResolutionStatement';
import { ResolutionType } from '../../model/receipt/ResolutionType';
import { Statement } from '../../model/receipt/Statement';
import { TransactionStatement } from '../../model/receipt/TransactionStatement';
import {UInt64} from '../../model/UInt64';

/**
 * @param receiptDTO
 * @param networkType
 * @returns {Statement}
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/master/src/catapult/model/ReceiptType.cpp
 * @constructor
 */
export const CreateStatementFromDTO = (receiptDTO, networkType): Statement => {
    return new Statement(
        receiptDTO.transactionStatements.map((statement) => createTransactionStatement(statement.statement, networkType)),
        receiptDTO.addressResolutionStatements.map((statement) => createResolutionStatement(statement.statement, ResolutionType.Address)),
        receiptDTO.mosaicResolutionStatements.map((statement) => createResolutionStatement(statement.statement, ResolutionType.Mosaic)),
    );
};

/**
 * @param receiptDTO
 * @param networkType
 * @returns {Receipt}
 * @constructor
 */
export const CreateReceiptFromDTO = (receiptDTO, networkType): Receipt => {
    switch (receiptDTO.type) {
        case ReceiptType.Harvest_Fee:
        case ReceiptType.LockHash_Created:
        case ReceiptType.LockHash_Completed:
        case ReceiptType.LockHash_Expired:
        case ReceiptType.LockSecret_Created:
        case ReceiptType.LockSecret_Completed:
        case ReceiptType.LockSecret_Expired:
            return createBalanceChangeReceipt(receiptDTO, networkType);
        case ReceiptType.Mosaic_Levy:
        case ReceiptType.Mosaic_Rental_Fee:
        case ReceiptType.Namespace_Rental_Fee:
            return createBalanceTransferReceipt(receiptDTO, networkType);
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
 * @param resolutionType
 * @returns {ResolutionStatement}
 * @constructor
 */
const createResolutionStatement = (statementDTO, resolutionType): ResolutionStatement => {
    switch (resolutionType) {
        case ResolutionType.Address:
            return new ResolutionStatement(
                UInt64.fromNumericString(statementDTO.height),
                Address.createFromEncoded(statementDTO.unresolved),
                statementDTO.resolutionEntries.map((entry) => {
                    return new ResolutionEntry(new AddressAlias(AliasType.Address, Address.createFromEncoded(entry.resolved)),
                        new ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
                }),
            );
        case ResolutionType.Mosaic:
            return new ResolutionStatement(
                UInt64.fromNumericString(statementDTO.height),
                new MosaicId(statementDTO.unresolved),
                statementDTO.resolutionEntries.map((entry) => {
                    return new ResolutionEntry(new MosaicAlias(AliasType.Mosaic, new MosaicId(entry.resolved)),
                        new ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
                }),
            );
        default:
            throw new Error ('Resolution type invalid');
    }
};

/**
 * @internal
 * @param statementDTO
 * @param networkType
 * @returns {TransactionStatement}
 * @constructor
 */
const createTransactionStatement = (statementDTO, networkType): TransactionStatement => {
    return new TransactionStatement(
        UInt64.fromNumericString(statementDTO.height),
        new ReceiptSource(statementDTO.source.primaryId, statementDTO.source.secondaryId),
        statementDTO.receipts.map((receipt) => {
            return CreateReceiptFromDTO(receipt, networkType);
        }),
    );
};

/**
 * @internal
 * @param receiptDTO
 * @param networkType
 * @returns {BalanceChangeReceipt}
 * @constructor
 */
const createBalanceChangeReceipt = (receiptDTO, networkType): Receipt => {
    return new BalanceChangeReceipt(
        PublicAccount.createFromPublicKey(receiptDTO.targetPublicKey, networkType),
        new MosaicId(receiptDTO.mosaicId),
        UInt64.fromNumericString(receiptDTO.amount),
        receiptDTO.version,
        receiptDTO.type,
    );
};

/**
 * @internal
 * @param receiptDTO
 * @param networkType
 * @returns {BalanceTransferReceipt}
 * @constructor
 */
const createBalanceTransferReceipt = (receiptDTO, networkType): Receipt => {
    return new BalanceTransferReceipt(
        PublicAccount.createFromPublicKey(receiptDTO.senderPublicKey, networkType),
        Address.createFromEncoded(receiptDTO.recipientAddress),
        new MosaicId(receiptDTO.mosaicId),
        UInt64.fromNumericString(receiptDTO.amount),
        receiptDTO.version,
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
        receiptDTO.version,
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
        UInt64.fromNumericString(receiptDTO.amount),
        receiptDTO.version,
        receiptDTO.type,
    );
};

const extractArtifactId = (receiptType: ReceiptType, id: string): MosaicId | NamespaceId => {
    switch (receiptType) {
        case ReceiptType.Mosaic_Expired:
            return new MosaicId(id);
        case ReceiptType.Namespace_Expired:
            return NamespaceId.createFromEncoded(id);
        default:
            throw new Error('Receipt type is not supported.');
    }
};
