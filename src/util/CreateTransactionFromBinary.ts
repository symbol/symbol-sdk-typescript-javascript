
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

import { convert } from 'nem2-library';
import { PublicAccount } from '../model/account/PublicAccount';
import { NetworkType } from '../model/blockchain/NetworkType';
import { AccountPropertyModification } from '../model/transaction/AccountPropertyModification';
import { Deadline } from '../model/transaction/Deadline';
import { ModifyAccountPropertyAddressTransaction } from '../model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from '../model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from '../model/transaction/ModifyAccountPropertyMosaicTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionInfo } from '../model/transaction/TransactionInfo';
import { TransactionType } from '../model/transaction/TransactionType';
import { UInt64 } from '../model/UInt64';

/**
 * @internal
 * @param transactionBinary
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromBinary = (transactionBinary): Transaction => {
    // Transaction byte size data
    const sizeLength        = 8;
    const signatureLength   = 128;
    const publicKeyLength   = 64;
    const versionLength     = 4;
    const typeLength        = 4;
    const feeLength         = 16;
    const deadlineLength    = 16;

    // Transaction byte data positions
    const signatureOffset = sizeLength;
    const publicKeyOffset = signatureOffset + signatureLength;
    const versionOffset = publicKeyOffset + publicKeyLength;
    const typeOffset = versionOffset + versionLength;
    const feeOffset = typeOffset + typeLength;
    const deadlineOffset = feeOffset + feeLength;
    const transactionOffset = deadlineOffset + deadlineLength;

    // Transaction byte data
    const networkType = extractNetwork(transactionBinary.substring(versionOffset, typeOffset));
    const signatureBytes = reverse(transactionBinary.substring(signatureOffset, publicKeyOffset));
    const signer = PublicAccount.createFromPublicKey(reverse(transactionBinary.substring(publicKeyOffset, versionOffset)), networkType);
    const version = extractTransactionVersionFromHex(transactionBinary.substring(versionOffset, typeOffset));
    const type = extractTransactionTypeFromHex(transactionBinary.substring(typeOffset, feeOffset));
    const fee = UInt64.fromHex(reverse(transactionBinary.substring(feeOffset, deadlineOffset)));
    const deadline = UInt64.fromHex(reverse(transactionBinary.substring(deadlineOffset, transactionOffset))).toDTO();
    const transactionData = transactionBinary.substring(transactionOffset);

    return CreateTransaction(type, transactionData, networkType, version, deadline, fee, signatureBytes, signer);
};

const CreateTransaction = (type: number, transactionData: string, networkType: NetworkType,
                           version: number, deadline: number[], fee: UInt64, signature?: string,
                           signer?: PublicAccount, transactionInfo?: TransactionInfo): Transaction => {
    switch (type) {
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            const propertyTypeLength = 2;

            const modificationCountOffset = propertyTypeLength;
            const modificationArrayOffset = modificationCountOffset + propertyTypeLength;

            // read bytes
            const propertyType = transactionData.substring(0, propertyTypeLength);
            const modifications = transactionData.substring(modificationArrayOffset, transactionData.length);
            const modificationArray = modifications.match(/.{1,52}/g);

            switch (type) {
                case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
                    const t =  new ModifyAccountPropertyAddressTransaction(
                        networkType,
                        version,
                        Deadline.createFromDTO(deadline),
                        fee,
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountPropertyModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            reverse(modification.substring(2, modification.length)),
                        )) : [],
                        signature,
                        signer,
                        transactionInfo,
                    );
                    return t;
                case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
                    return new ModifyAccountPropertyMosaicTransaction(
                        networkType,
                        version,
                        Deadline.createFromDTO(deadline),
                        fee,
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountPropertyModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            UInt64.fromHex(modification.substring(2, modification.length)).toDTO(),
                        )) : [],
                        signature,
                        signer,
                        transactionInfo,
                    );
                case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
                    return new ModifyAccountPropertyEntityTypeTransaction(
                        networkType,
                        version,
                        Deadline.createFromDTO(deadline),
                        fee,
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountPropertyModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            parseInt(convert.uint8ToHex(convert.hexToUint8(
                                modification.substring(2, modification.length)).reverse()), 16),
                        )) : [],
                        signature,
                        signer,
                        transactionInfo,
                    );
            }
            throw new Error ('Account property transaction type not recognised.');
        case TransactionType.MOSAIC_ALIAS:
            throw new Error ('Transaction type not implemented yet.');
        default:
            throw new Error ('Transaction type not implemented yet.');
        }
};

const extractTransactionTypeFromHex = (hexValue: string): number => {
    return parseInt(convert.uint8ToHex(convert.hexToUint8(hexValue).reverse()), 16);
};

const extractTransactionVersionFromHex = (hexValue: string): number => {
    return convert.hexToUint8(hexValue)[0];
};

const extractNetwork = (versionHex: string): NetworkType => {
    const networkType = convert.hexToUint8(versionHex)[1];
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

const reverse = (hex: string): string => {
    return convert.uint8ToHex(convert.hexToUint8(hex).reverse());
};
