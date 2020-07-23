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

import { ResolutionStatementInfoDTO, TransactionStatementInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../../model/account/Address';
import { UnresolvedAddress } from '../../model/account/UnresolvedAddress';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { UnresolvedMosaicId } from '../../model/mosaic/UnresolvedMosaicId';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { ArtifactExpiryReceipt } from '../../model/receipt/ArtifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../model/receipt/BalanceChangeReceipt';
import { BalanceTransferReceipt } from '../../model/receipt/BalanceTransferReceipt';
import { InflationReceipt } from '../../model/receipt/InflationReceipt';
import { Receipt } from '../../model/receipt/Receipt';
import { ReceiptSource } from '../../model/receipt/ReceiptSource';
import { ReceiptType } from '../../model/receipt/ReceiptType';
import { ResolutionEntry } from '../../model/receipt/ResolutionEntry';
import { AddressResolutionStatement, MosaicIdResolutionStatement, ResolutionStatement } from '../../model/receipt/ResolutionStatement';
import { ResolutionType } from '../../model/receipt/ResolutionType';
import { TransactionStatement } from '../../model/receipt/TransactionStatement';
import { UInt64 } from '../../model/UInt64';

/**
 * @interal
 * @param unresolvedAddress unresolved address
 * @returns {Address | NamespaceId}
 */
const extractUnresolvedAddress = (unresolvedAddress: any): UnresolvedAddress => {
    if (typeof unresolvedAddress === 'string') {
        return UnresolvedMapping.toUnresolvedAddress(unresolvedAddress);
    } else if (typeof unresolvedAddress === 'object') {
        // Is JSON object
        if (unresolvedAddress.hasOwnProperty('address')) {
            return Address.createFromRawAddress(unresolvedAddress.address);
        } else if (unresolvedAddress.hasOwnProperty('id')) {
            return NamespaceId.createFromEncoded(unresolvedAddress.id);
        }
    }
    throw new Error(`UnresolvedAddress: ${unresolvedAddress} type is not recognised`);
};

/**
 * @internal
 * @param statementInfoDTO
 * @returns {MosaicIdResolutionStatement}
 * @constructor
 */
export const createMosaicResolutionStatement = (statementInfoDTO: ResolutionStatementInfoDTO): MosaicIdResolutionStatement => {
    const statementDTO = statementInfoDTO.statement;
    return new ResolutionStatement(
        ResolutionType.Mosaic,
        UInt64.fromNumericString(statementDTO.height),
        UnresolvedMapping.toUnresolvedMosaic(statementDTO.unresolved),
        statementDTO.resolutionEntries.map((entry) => {
            return new ResolutionEntry(new MosaicId(entry.resolved), new ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
        }),
    );
};

/**
 * @internal
 * @param statementInfoDTO
 * @returns {AddressResolutionStatement}
 * @constructor
 */
export const createAddressResolutionStatement = (statementInfoDTO: ResolutionStatementInfoDTO): AddressResolutionStatement => {
    const statementDTO = statementInfoDTO.statement;
    return new ResolutionStatement(
        ResolutionType.Address,
        UInt64.fromNumericString(statementDTO.height),
        extractUnresolvedAddress(statementDTO.unresolved),
        statementDTO.resolutionEntries.map((entry) => {
            return new ResolutionEntry(
                Address.createFromEncoded(entry.resolved),
                new ReceiptSource(entry.source.primaryId, entry.source.secondaryId),
            );
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
        Address.createFromEncoded(receiptDTO.targetAddress),
        new MosaicId(receiptDTO.mosaicId),
        UInt64.fromNumericString(receiptDTO.amount),
        receiptDTO.version,
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
        Address.createFromEncoded(receiptDTO.senderAddress),
        Address.createFromEncoded(receiptDTO.recipientAddress),
        new MosaicId(receiptDTO.mosaicId),
        UInt64.fromNumericString(receiptDTO.amount),
        receiptDTO.version,
        receiptDTO.type,
    );
};

/**
 * @internal
 * @param receiptType receipt type
 * @param id Artifact id
 * @returns {UnresolvedMosaicId}
 */
const extractArtifactId = (receiptType: ReceiptType, id: string): UnresolvedMosaicId => {
    switch (receiptType) {
        case ReceiptType.Mosaic_Expired:
            return new MosaicId(id);
        case ReceiptType.Namespace_Expired:
        case ReceiptType.Namespace_Deleted:
            return NamespaceId.createFromEncoded(id);
        default:
            throw new Error('Receipt type is not supported.');
    }
};

/**
 * @internal
 * @param receiptDTO
 * @returns {ArtifactExpiryReceipt}
 * @constructor
 */
const createArtifactExpiryReceipt = (receiptDTO): Receipt => {
    return new ArtifactExpiryReceipt(extractArtifactId(receiptDTO.type, receiptDTO.artifactId), receiptDTO.version, receiptDTO.type);
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

/**
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
        case ReceiptType.Namespace_Deleted:
            return createArtifactExpiryReceipt(receiptDTO);
        case ReceiptType.Inflation:
            return createInflationReceipt(receiptDTO);
        default:
            throw new Error(`Receipt type: ${receiptDTO.type} not recognized.`);
    }
};

/**
 * @internal
 * @param statementInfoDTO
 * @returns {TransactionStatement}
 * @constructor
 */
export const createTransactionStatement = (statementInfoDTO: TransactionStatementInfoDTO): TransactionStatement => {
    const statementDTO = statementInfoDTO.statement;
    return new TransactionStatement(
        UInt64.fromNumericString(statementDTO.height),
        new ReceiptSource(statementDTO.source.primaryId, statementDTO.source.secondaryId),
        statementDTO.receipts.map((receipt) => {
            return CreateReceiptFromDTO(receipt);
        }),
    );
};
