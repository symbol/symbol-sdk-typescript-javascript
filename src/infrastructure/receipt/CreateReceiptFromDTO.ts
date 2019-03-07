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

import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import {MosaicId} from '../../model/mosaic/MosaicId';
import { ArtifactExpiryReceipt } from '../../model/receipt/artifactExpiryReceipt';
import { BalanceChangeReceipt } from '../../model/receipt/balanceChangeReceipt';
import { BalanceTransferReceipt } from '../../model/receipt/balanceTransferReceipt';
import { Receipt } from '../../model/receipt/receipt';
import { ReceiptSource } from '../../model/receipt/receiptSource';
import { ReceiptType } from '../../model/receipt/receiptType';
import { ResolutionEntry } from '../../model/receipt/resolutionEntry';
import { ResolutionStatement } from '../../model/receipt/resolutionStatement';
import { TransactionStatement } from '../../model/receipt/transactionStatement';
import {UInt64} from '../../model/UInt64';

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
        case ReceiptType.Transaction_Group:
            return createTransactionStatement(receiptDTO);
        case ReceiptType.Address_Alias_Resolution:
        case ReceiptType.Mosaic_Alias_Resolution:
            return createResolutionStatement(receiptDTO);

        default:
            throw new Error(`Receipt type: ${receiptDTO.type} not recognized.`);
    }
};

/**
 * @internal
 * @param receiptDTO
 * @returns {ResolutionStatement}
 * @constructor
 */
const createResolutionStatement = (receiptDTO): ResolutionStatement => {
    return new ResolutionStatement(
        receiptDTO.size,
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
        typeof receiptDTO.unresolved === 'string' ? receiptDTO.unresolved : new UInt64(receiptDTO.unresolved),
        receiptDTO.m_entries.map((entry) => {
            return new ResolutionEntry(entry.resolvedValue,
                new ReceiptSource(entry.source.primaryId, entry.source.secondaryId));
        }),
    );
};

/**
 * @internal
 * @param receiptDTO
 * @returns {TransactionStatement}
 * @constructor
 */
const createTransactionStatement = (receiptDTO): TransactionStatement => {
    return new TransactionStatement(
        receiptDTO.size,
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
        new ReceiptSource(receiptDTO.m_source.primaryId, receiptDTO.m_source.secondaryId),
        receiptDTO.receipts.map((receipt) => {
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
        receiptDTO.size,
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
        PublicAccount.createFromPublicKey(receiptDTO.account, extractNetworkType(receiptDTO.version)),
        new MosaicId(receiptDTO.mosaicId),
        new UInt64(receiptDTO.amount),
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
        receiptDTO.size,
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
        PublicAccount.createFromPublicKey(receiptDTO.sender, extractNetworkType(receiptDTO.version)),
        PublicAccount.createFromPublicKey(receiptDTO.receipt, extractNetworkType(receiptDTO.version)),
        new MosaicId(receiptDTO.mosaicId),
        new UInt64(receiptDTO.amount),
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
        receiptDTO.size,
        extractReceiptVersion(receiptDTO.version),
        receiptDTO.type,
        new UInt64(receiptDTO.artifactId),
    );
};

const extractNetworkType = (version: number): NetworkType => {
    const networkType = parseInt(version.toString(16).substr(0, 2), 16);
    if (networkType === NetworkType.MAIN_NET) {
        return NetworkType.MAIN_NET;
    } else if (networkType === NetworkType.TEST_NET) {
        return NetworkType.TEST_NET;
    } else if (networkType === NetworkType.MIJIN) {
        return NetworkType.MIJIN;
    } else if (networkType === NetworkType.MIJIN_TEST) {
        return NetworkType.MIJIN_TEST;
    }
    throw new Error('Unimplemented network type');
};

const extractReceiptVersion = (version: number): number => {
    return parseInt(version.toString(16).substr(2, 2), 16);
};
