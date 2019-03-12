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
import { Address } from '../model/account/Address';
import { PublicAccount } from '../model/account/PublicAccount';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicNonce } from '../model/mosaic/MosaicNonce';
import { MosaicProperties } from '../model/mosaic/MosaicProperties';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { AccountPropertyModification } from '../model/transaction/AccountPropertyModification';
import { AddressAliasTransaction } from '../model/transaction/AddressAliasTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { HashLockTransaction } from '../model/transaction/HashLockTransaction';
import { HashType } from '../model/transaction/HashType';
import { Message } from '../model/transaction/Message';
import { ModifyAccountPropertyAddressTransaction } from '../model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from '../model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from '../model/transaction/ModifyAccountPropertyMosaicTransaction';
import { ModifyMultisigAccountTransaction } from '../model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../model/transaction/MosaicSupplyChangeTransaction';
import { MultisigCosignatoryModification } from '../model/transaction/MultisigCosignatoryModification';
import { PlainMessage } from '../model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../model/transaction/SecretProofTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionInfo } from '../model/transaction/TransactionInfo';
import { TransactionType } from '../model/transaction/TransactionType';
import { TransferTransaction } from '../model/transaction/TransferTransaction';
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
    const signatureBytes = transactionBinary.substring(signatureOffset, publicKeyOffset);
    const signer = PublicAccount.createFromPublicKey(transactionBinary.substring(publicKeyOffset, versionOffset), networkType);
    const version = extractTransactionVersionFromHex(transactionBinary.substring(versionOffset, typeOffset));
    const type = extractTransactionTypeFromHex(transactionBinary.substring(typeOffset, feeOffset));
    const fee = UInt64.fromHex(reverse(transactionBinary.substring(feeOffset, deadlineOffset)));
    const deadline = UInt64.fromHex(reverse(transactionBinary.substring(deadlineOffset, transactionOffset))).toDTO();
    const transactionData = transactionBinary.substring(transactionOffset);

    return CreateTransactionBody(type, transactionData, networkType, version, deadline, fee, signatureBytes, signer);
};

/**
 * @internal
 * @param type
 * @param transactionData
 * @param networkType
 * @param version
 * @param deadline
 * @param signature
 * @param signer
 * @param transactionInfo
 * @returns {Transaction}
 */
const CreateTransactionBody = (type: number, transactionData: string, networkType: NetworkType,
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
                            Address.createFromEncoded(modification.substring(2, modification.length)).plain(),
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
                            UInt64.fromHex(reverse(modification.substring(2, modification.length))).toDTO(),
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
        case TransactionType.ADDRESS_ALIAS:
            const addressAliasActionLength = 2;

            // read bytes
            const addressAliasAction = transactionData.substring(0, addressAliasActionLength);
            const addressAliasNamespaceId = transactionData.substring(addressAliasActionLength, 18);
            const addressAliasAddress = transactionData.substring(18);

            return new AddressAliasTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                parseInt(convert.uint8ToHex(convert.hexToUint8(addressAliasAction).reverse()), 16),
                new NamespaceId(UInt64.fromHex(reverse(addressAliasNamespaceId)).toDTO()),
                Address.createFromEncoded(addressAliasAddress),
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.MOSAIC_ALIAS:
            const mosaicAliasActionLength = 2;

            // read bytes
            const mosaicAliasAction = transactionData.substring(0, mosaicAliasActionLength);
            const mosaicAliasNamespaceId = transactionData.substring(mosaicAliasActionLength, 18);
            const mosaicAliasMosaicId = transactionData.substring(18);

            return new MosaicAliasTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                parseInt(convert.uint8ToHex(convert.hexToUint8(mosaicAliasAction).reverse()), 16),
                new NamespaceId(UInt64.fromHex(reverse(mosaicAliasNamespaceId)).toDTO()),
                new MosaicId(UInt64.fromHex(reverse(mosaicAliasMosaicId)).toDTO()),
                signature,
                signer,
                transactionInfo,
            );
        // case TransactionType.REGISTER_NAMESPACE:
        //     const registerNameSpaceTypeLength = 2;

        //     // read bytes
        //     const namespaceType = transactionData.substring(0, registerNameSpaceTypeLength);
        //     const duration = transactionData.substring(registerNameSpaceTypeLength, 18);
        //     const ParentId = transactionData.substring(18, 34);
        //     const NameSpaceId = transactionData.substring(34, 50);
        //     const NameSize = transactionData.substring(50, 52);
        //     const name = transactionData.substring(52);

        //     return new RegisterNamespaceTransaction(
        //         networkType,
        //         version,
        //         Deadline.createFromDTO(deadline),
        //         fee,
        //         parseInt(convert.uint8ToHex(convert.hexToUint8(namespaceType).reverse()), 16),
        //         new NamespaceId(UInt64.fromHex(reverse(mosaicAliasNamespaceId)).toDTO()),
        //         new MosaicId(UInt64.fromHex(reverse(mosaicAliasMosaicId)).toDTO()),
        //         signature,
        //         signer,
        //         transactionInfo,
        //     );
        case TransactionType.MOSAIC_DEFINITION:
            const mosaicDefMosaicNonceLength = 8;
            const mosaicDefMosaicIdLength    = 16;
            const mosaicDefPropsNumLength    = 2;
            const mosaicDefPropsFlagsLength  = 2;
            const mosaicDefDivisibilityLength = 2;
            const mosaicDefDurationIndLength = 2;
            const mosaicDefDurationLength    = 16;

            const mosaicIdOffset     = mosaicDefMosaicNonceLength;
            const propsOffset        = mosaicIdOffset + mosaicDefMosaicIdLength;
            const flagsOffset        = propsOffset + mosaicDefPropsNumLength;
            const divisibilityOffset = flagsOffset + mosaicDefPropsFlagsLength;
            const durationIndOffset  = divisibilityOffset + mosaicDefDivisibilityLength;
            const durationOffset     = durationIndOffset + mosaicDefDurationIndLength;

            // read bytes
            const mosaicNonce = transactionData.substring(0, mosaicDefMosaicNonceLength);
            const mosaicId = transactionData.substring(mosaicIdOffset, propsOffset);
            const props = transactionData.substring(propsOffset, flagsOffset);
            const flags = parseInt(convert.uint8ToHex(convert.hexToUint8(
                transactionData.substring(flagsOffset, divisibilityOffset)).reverse()), 16);
            const divisibility = transactionData.substring(divisibilityOffset, durationIndOffset);
            const durationInd = transactionData.substring(durationIndOffset, durationOffset);
            const duration = transactionData.substring(durationOffset);

            const regexArray = mosaicNonce.match(/.{1,2}/g);

            const nonceArray = regexArray ? regexArray.map((n) => {
                return parseInt(convert.uint8ToHex(convert.hexToUint8(n).reverse()), 16);
            }) : [];

            return new MosaicDefinitionTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                new MosaicNonce(new Uint8Array(nonceArray)),
                new MosaicId(UInt64.fromHex(reverse(mosaicId)).toDTO()),
                MosaicProperties.create({
                    supplyMutable: (flags & 1) === 1,
                    transferable: (flags & 2) === 2,
                    levyMutable: (flags & 4) === 4,
                    divisibility: parseInt(convert.uint8ToHex(convert.hexToUint8(divisibility).reverse()), 16),
                    duration: UInt64.fromHex(reverse(duration)),
                }),
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            // read bytes
            const mosaicSupMosaicId = transactionData.substring(0, 16);
            const mosaicSupDirection = transactionData.substring(16, 18);
            const delta = transactionData.substring(18, 34);

            return new MosaicSupplyChangeTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                new MosaicId(UInt64.fromHex(reverse(mosaicSupMosaicId)).toDTO()),
                parseInt(convert.uint8ToHex(convert.hexToUint8(mosaicSupDirection).reverse()), 16),
                UInt64.fromHex(reverse(delta)),
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.TRANSFER:
            // read bytes
            const transferRecipient = transactionData.substring(0, 50);
            const transferMessageSize = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(50, 54)).reverse()), 16);

            const transferMessageAndMosaicSubString = transactionData.substring(56);
            const transferMessageType = transferMessageAndMosaicSubString.substring(0, 2);
            const transferMessage = transferMessageAndMosaicSubString.substring(2, (transferMessageSize - 1) * 2 + 2);
            const transferMosaic = transferMessageAndMosaicSubString.substring(transferMessageSize * 2);
            const transferMosaicArray = transferMosaic.match(/.{1,32}/g);

            return new TransferTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                Address.createFromEncoded(transferRecipient),
                transferMosaicArray ? transferMosaicArray.map((mosaic) => new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(mosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(mosaic.substring(16))),
                )) : [],
                PlainMessage.createFromDTO(transferMessage),
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.SECRET_LOCK:
            // read bytes
            const secretLockMosaic = transactionData.substring(0, 32);
            const secretLockDuration = transactionData.substring(32, 48);
            const secretLockHashAlgorithm = parseInt(convert.uint8ToHex(convert.hexToUint8(
                transactionData.substring(48, 50)).reverse()), 16);
            const secretLockSecret = transactionData.substring(50, transactionData.length - 50);
            const secretLockRecipient = transactionData.substring(transactionData.length - 50);

            return new SecretLockTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(secretLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(secretLockMosaic.substring(16))),
                ),
                UInt64.fromHex(reverse(secretLockDuration)),
                secretLockHashAlgorithm,
                secretLockSecret,
                Address.createFromEncoded(secretLockRecipient),
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.SECRET_PROOF:
            // read bytes
            const secretProofHashAlgorithm = parseInt(convert.uint8ToHex(convert.hexToUint8(
                transactionData.substring(0, 2)).reverse()), 16);

            const secretProofSecretLength = HashType.Op_Hash_160 === secretProofHashAlgorithm ? 40 : 64;
            const secretProofSecret = transactionData.substring(2, 2 + secretProofSecretLength);
            const secretProofSize = transactionData.substring(2 + secretProofSecretLength, 6 + secretProofSecretLength);
            const mosaicProof = transactionData.substring(6 + secretProofSecretLength);

            return new SecretProofTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                secretProofHashAlgorithm,
                secretProofSecret,
                mosaicProof,
                signature,
                signer,
                transactionInfo,
            );
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            // read bytes
            const minRemovalDelta = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(0, 2)).reverse()), 16);
            const minApprovalDelta = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(2, 4)).reverse()), 16);
            const modificationsCount = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(4, 6)).reverse()), 16);

            const multiSigModificationSubString = transactionData.substring(6);
            const multiSigModificationArray = multiSigModificationSubString.match(/.{1,66}/g);

            return new ModifyMultisigAccountTransaction(
                networkType,
                version,
                Deadline.createFromDTO(deadline),
                fee,
                minApprovalDelta,
                minRemovalDelta,
                multiSigModificationArray ? multiSigModificationArray.map((modification) => new MultisigCosignatoryModification(
                    parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                    PublicAccount.createFromPublicKey(modification.substring(2), networkType),
                )) : [],
                signature,
                signer,
                transactionInfo,
            );
        // case TransactionType.LOCK:
        //     // read bytes
        //     const hashLockMosaic = transactionData.substring(0, 32);
        //     const hashLockDuration = transactionData.substring(32, 48);
        //     const hashLockHash = transactionData.substring(48);

        //     return new HashLockTransaction(
        //         networkType,
        //         version,
        //         Deadline.createFromDTO(deadline),
        //         fee,
        //         new Mosaic(
        //             new MosaicId(UInt64.fromHex(reverse(hashLockMosaic.substring(0, 16))).toDTO()),
        //             UInt64.fromHex(reverse(hashLockMosaic.substring(16))),
        //         ),
        //         UInt64.fromHex(reverse(hashLockDuration)),
        //         ,
        //         signature,
        //         signer,
        //         transactionInfo,
        //     );
        default:
            throw new Error ('Transaction type not implemented yet.');
        }
};

/**
 * @internal
 * @param hexValue
 * @returns {number}
 */
const extractTransactionTypeFromHex = (hexValue: string): number => {
    return parseInt(convert.uint8ToHex(convert.hexToUint8(hexValue).reverse()), 16);
};

/**
 * @internal
 * @param hexValue
 * @returns {number}
 */
const extractTransactionVersionFromHex = (hexValue: string): number => {
    return convert.hexToUint8(hexValue)[0];
};

/**
 * @internal
 * @param versionHex
 * @returns {NetworkType}
 */
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

/**
 * @internal
 * @param hex
 * @returns {string}
 */
const reverse = (hex: string): string => {
    return convert.uint8ToHex(convert.hexToUint8(hex).reverse());
};
