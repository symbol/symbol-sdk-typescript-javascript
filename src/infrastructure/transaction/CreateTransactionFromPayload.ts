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

import {decode} from 'utf8';
import { Convert as convert } from '../../core/format';
import { Address } from '../../model/account/Address';
import { PublicAccount } from '../../model/account/PublicAccount';
import { NetworkType } from '../../model/blockchain/NetworkType';
import { Mosaic } from '../../model/mosaic/Mosaic';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { MosaicNonce } from '../../model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../model/mosaic/MosaicProperties';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { NamespaceType } from '../../model/namespace/NamespaceType';
import { AccountAddressRestrictionModificationTransaction } from '../../model/transaction/AccountAddressRestrictionModificationTransaction';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import { AccountMosaicRestrictionModificationTransaction } from '../../model/transaction/AccountMosaicRestrictionModificationTransaction';
import { AccountOperationRestrictionModificationTransaction } from '../../model/transaction/AccountOperationRestrictionModificationTransaction';
import { AccountRestrictionModification } from '../../model/transaction/AccountRestrictionModification';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { AggregateTransactionCosignature } from '../../model/transaction/AggregateTransactionCosignature';
import { Deadline } from '../../model/transaction/Deadline';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { HashType } from '../../model/transaction/HashType';
import { LockFundsTransaction } from '../../model/transaction/LockFundsTransaction';
import { Message } from '../../model/transaction/Message';
import { MessageType } from '../../model/transaction/MessageType';
import { ModifyMultisigAccountTransaction } from '../../model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAddressRestrictionTransaction } from '../../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicSupplyChangeTransaction } from '../../model/transaction/MosaicSupplyChangeTransaction';
import { MultisigCosignatoryModification } from '../../model/transaction/MultisigCosignatoryModification';
import { PlainMessage } from '../../model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../../model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { SignedTransaction } from '../../model/transaction/SignedTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';
import { UInt64 } from '../../model/UInt64';

/**
 * @internal
 * @param transactionBinary - The transaction binary data
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromPayload = (transactionBinary: string): Transaction => {
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
    const type = extractTransactionTypeFromHex(transactionBinary.substring(typeOffset, feeOffset));
    const deadline = UInt64.fromHex(reverse(transactionBinary.substring(deadlineOffset, transactionOffset))).toDTO();
    const transactionData = transactionBinary.substring(transactionOffset);

    return CreateTransaction(type, transactionData, networkType, deadline);
};

/**
 * @internal
 * @param type - Transaction type
 * @param transactionData - Details per specific transaction type
 * @param networkType - Network type
 * @param deadline - Deadline
 * @returns {Transaction}
 */
const CreateTransaction = (type: number, transactionData: string, networkType: NetworkType, deadline: number[]): Transaction => {
    switch (type) {
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
            const propertyTypeLength = 2;

            const modificationCountOffset = propertyTypeLength;
            const modificationArrayOffset = modificationCountOffset + propertyTypeLength;

            // read bytes
            const propertyType = transactionData.substring(0, propertyTypeLength);
            const modifications = transactionData.substring(modificationArrayOffset, transactionData.length);
            const modificationArray = modifications.match(/.{1,52}/g);

            switch (type) {
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                    const t =  AccountAddressRestrictionModificationTransaction.create(
                        Deadline.createFromDTO(deadline),
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            Address.createFromEncoded(modification.substring(2, modification.length)).plain(),
                        )) : [],
                        networkType,
                    );
                    return t;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                    return AccountMosaicRestrictionModificationTransaction.create(
                        Deadline.createFromDTO(deadline),
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            UInt64.fromHex(reverse(modification.substring(2, modification.length))).toDTO(),
                        )) : [],
                        networkType,
                    );
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                    return AccountOperationRestrictionModificationTransaction.create(
                        Deadline.createFromDTO(deadline),
                        parseInt(convert.uint8ToHex(convert.hexToUint8(propertyType).reverse()), 16),
                        modificationArray ? modificationArray.map((modification) => new AccountRestrictionModification(
                            parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                            parseInt(convert.uint8ToHex(convert.hexToUint8(
                                modification.substring(2, modification.length)).reverse()), 16),
                        )) : [],
                        networkType,
                    );
            }
            throw new Error ('Account restriction transaction type not recognised.');
        case TransactionType.LINK_ACCOUNT:
            // read bytes
            const remoteAccountKey = transactionData.substring(0, 64);
            const linkAction = transactionData.substring(64, 66);

            return AccountLinkTransaction.create(
                Deadline.createFromDTO(deadline),
                remoteAccountKey,
                parseInt(convert.uint8ToHex(convert.hexToUint8(linkAction).reverse()), 16),
                networkType,
            );
        case TransactionType.ADDRESS_ALIAS:
            // read bytes
            const addressAliasAction = transactionData.substring(0, 2);
            const addressAliasNamespaceId = transactionData.substring(2, 18);
            const addressAliasAddress = transactionData.substring(18);

            return AddressAliasTransaction.create(
                Deadline.createFromDTO(deadline),
                parseInt(convert.uint8ToHex(convert.hexToUint8(addressAliasAction).reverse()), 16),
                new NamespaceId(UInt64.fromHex(reverse(addressAliasNamespaceId)).toDTO()),
                Address.createFromEncoded(addressAliasAddress),
                networkType,
            );
        case TransactionType.MOSAIC_ALIAS:
            const mosaicAliasActionLength = 2;

            // read bytes
            const mosaicAliasAction = transactionData.substring(0, mosaicAliasActionLength);
            const mosaicAliasNamespaceId = transactionData.substring(mosaicAliasActionLength, 18);
            const mosaicAliasMosaicId = transactionData.substring(18);

            return MosaicAliasTransaction.create(
                Deadline.createFromDTO(deadline),
                parseInt(convert.uint8ToHex(convert.hexToUint8(mosaicAliasAction).reverse()), 16),
                new NamespaceId(UInt64.fromHex(reverse(mosaicAliasNamespaceId)).toDTO()),
                new MosaicId(UInt64.fromHex(reverse(mosaicAliasMosaicId)).toDTO()),
                networkType,
            );
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

            return MosaicDefinitionTransaction.create(
                Deadline.createFromDTO(deadline),
                new MosaicNonce(new Uint8Array(nonceArray)),
                new MosaicId(UInt64.fromHex(reverse(mosaicId)).toDTO()),
                MosaicProperties.create({
                    supplyMutable: (flags & 1) === 1,
                    transferable: (flags & 2) === 2,
                    divisibility: parseInt(convert.uint8ToHex(convert.hexToUint8(divisibility).reverse()), 16),
                    restrictable: (flags & 4) === 4,
                    duration: duration ? UInt64.fromHex(reverse(duration)) : undefined,
                }),
                networkType,
            );
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            // read bytes
            const mosaicSupMosaicId = transactionData.substring(0, 16);
            const mosaicSupDirection = transactionData.substring(16, 18);
            const delta = transactionData.substring(18, 34);

            return MosaicSupplyChangeTransaction.create(
                Deadline.createFromDTO(deadline),
                new MosaicId(UInt64.fromHex(reverse(mosaicSupMosaicId)).toDTO()),
                parseInt(convert.uint8ToHex(convert.hexToUint8(mosaicSupDirection).reverse()), 16),
                UInt64.fromHex(reverse(delta)),
                networkType,
            );
        case TransactionType.REGISTER_NAMESPACE:
            // read bytes
            const namespaceType = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(0, 2)).reverse()), 16);
            const nameSpaceDurationParentId = transactionData.substring(2, 18);
            const nameSpaceId = transactionData.substring(18, 34);
            const nameSize = transactionData.substring(34, 36);
            const nameSpaceName = transactionData.substring(36);

            return namespaceType === NamespaceType.RootNamespace ?
                RegisterNamespaceTransaction.createRootNamespace(
                    Deadline.createFromDTO(deadline),
                    decodeHex(nameSpaceName),
                    UInt64.fromHex(reverse(nameSpaceDurationParentId)),
                    networkType,
            ) : RegisterNamespaceTransaction.createSubNamespace(
                    Deadline.createFromDTO(deadline),
                    decodeHex(nameSpaceName),
                    new NamespaceId(UInt64.fromHex(reverse(nameSpaceDurationParentId)).toDTO()),
                    networkType,
            );
        case TransactionType.TRANSFER:
            // read bytes
            const transferRecipient = transactionData.substring(0, 50);
            const transferMessageSize = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(50, 54)).reverse()), 16);

            const transferMessageAndMosaicSubString = transactionData.substring(56);
            const transferMessageType = parseInt(convert.uint8ToHex(convert.hexToUint8(
                                                                        transferMessageAndMosaicSubString.substring(0, 2)).reverse()), 16);
            const transferMessage = transferMessageAndMosaicSubString.substring(2, (transferMessageSize - 1) * 2 + 2);
            const transferMosaic = transferMessageAndMosaicSubString.substring(transferMessageSize * 2);
            const transferMosaicArray = transferMosaic.match(/.{1,32}/g);

            return TransferTransaction.create(
                Deadline.createFromDTO(deadline),
                Address.createFromEncoded(transferRecipient),
                transferMosaicArray ? transferMosaicArray.map((mosaic) => new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(mosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(mosaic.substring(16))),
                )) : [],
                extractMessage(transferMessageType, transferMessage),
                networkType,
            );
        case TransactionType.SECRET_LOCK:
            // read bytes
            const secretLockMosaic = transactionData.substring(0, 32);
            const secretLockDuration = transactionData.substring(32, 48);
            const secretLockHashAlgorithm = parseInt(convert.uint8ToHex(convert.hexToUint8(
                transactionData.substring(48, 50)).reverse()), 16);
            const secretLockSecret = transactionData.substring(50, transactionData.length - 50);
            const secretLockRecipient = transactionData.substring(transactionData.length - 50);

            return SecretLockTransaction.create(
                Deadline.createFromDTO(deadline),
                new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(secretLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(secretLockMosaic.substring(16))),
                ),
                UInt64.fromHex(reverse(secretLockDuration)),
                secretLockHashAlgorithm,
                secretLockSecret,
                Address.createFromEncoded(secretLockRecipient),
                networkType,
            );
        case TransactionType.SECRET_PROOF:
            // read bytes
            const secretProofHashAlgorithm = parseInt(convert.uint8ToHex(convert.hexToUint8(
                transactionData.substring(0, 2)).reverse()), 16);

            const secretProofSecretLength = 64;
            const secretProofSecret = transactionData.substring(2, 66);
            const secretProofRecipient = transactionData.substring(66, 116);
            const secretProofSize = transactionData.substring(116, 120);
            const secretProofProof = transactionData.substring(120);

            return SecretProofTransaction.create(
                Deadline.createFromDTO(deadline),
                secretProofHashAlgorithm,
                secretProofSecret,
                Address.createFromEncoded(secretProofRecipient),
                secretProofProof,
                networkType,
            );
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            // read bytes
            const minRemovalDelta = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(0, 2)).reverse()), 16);
            const minApprovalDelta = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(2, 4)).reverse()), 16);
            const modificationsCount = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(4, 6)).reverse()), 16);

            const multiSigModificationSubString = transactionData.substring(6);
            const multiSigModificationArray = multiSigModificationSubString.match(/.{1,66}/g);

            return ModifyMultisigAccountTransaction.create(
                Deadline.createFromDTO(deadline),
                minApprovalDelta,
                minRemovalDelta,
                multiSigModificationArray ? multiSigModificationArray.map((modification) => new MultisigCosignatoryModification(
                    parseInt(convert.uint8ToHex(convert.hexToUint8(modification.substring(0, 2)).reverse()), 16),
                    PublicAccount.createFromPublicKey(modification.substring(2), networkType),
                )) : [],
                networkType,
            );
        case TransactionType.LOCK:
            // read bytes
            const hashLockMosaic = transactionData.substring(0, 32);
            const hashLockDuration = transactionData.substring(32, 48);
            const hashLockHash = transactionData.substring(48);

            return LockFundsTransaction.create(
                Deadline.createFromDTO(deadline),
                new Mosaic(
                    new MosaicId(UInt64.fromHex(reverse(hashLockMosaic.substring(0, 16))).toDTO()),
                    UInt64.fromHex(reverse(hashLockMosaic.substring(16))),
                ),
                UInt64.fromHex(reverse(hashLockDuration)),
                new SignedTransaction('', hashLockHash, '', TransactionType.AGGREGATE_BONDED, networkType),
                networkType,
            );
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
            // read bytes
            const globalRestrictionMosaicId = transactionData.substring(0, 16);
            const globalRestrictionReferenceMosaicId = transactionData.substring(16, 32);
            const globalRestrictionRestrictionKey = transactionData.substring(32, 48);
            const globalRestrictionPrevValue = transactionData.substring(48, 64);
            const globalRestrictionPrevType = transactionData.substring(64, 66);
            const globalRestrictionNewValue = transactionData.substring(66, 82);
            const globalRestrictionNewType = transactionData.substring(82, 84);

            return MosaicGlobalRestrictionTransaction.create(
                Deadline.createFromDTO(deadline),
                new MosaicId(UInt64.fromHex(reverse(globalRestrictionMosaicId)).toDTO()),
                new MosaicId(UInt64.fromHex(reverse(globalRestrictionReferenceMosaicId)).toDTO()),
                UInt64.fromHex(reverse(globalRestrictionRestrictionKey)),
                UInt64.fromHex(reverse(globalRestrictionPrevValue)),
                parseInt(convert.uint8ToHex(convert.hexToUint8(globalRestrictionPrevType).reverse()), 16),
                UInt64.fromHex(reverse(globalRestrictionNewValue)),
                parseInt(convert.uint8ToHex(convert.hexToUint8(globalRestrictionNewType).reverse()), 16),
                networkType,
            );
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            // read bytes
            const addressRestrictionMosaicId = transactionData.substring(0, 16);
            const addressRestrictionRestrictionKey = transactionData.substring(16, 32);
            const addressRestrictionTargetAddress = transactionData.substring(32, 82);
            const addressRestrictionPrevValue = transactionData.substring(82, 98);
            const addressRestrictionNewValue = transactionData.substring(98, 114);

            return MosaicAddressRestrictionTransaction.create(
                Deadline.createFromDTO(deadline),
                new MosaicId(UInt64.fromHex(reverse(addressRestrictionMosaicId)).toDTO()),
                UInt64.fromHex(reverse(addressRestrictionRestrictionKey)),
                Address.createFromEncoded(addressRestrictionTargetAddress),
                UInt64.fromHex(reverse(addressRestrictionPrevValue)),
                UInt64.fromHex(reverse(addressRestrictionNewValue)),
                networkType,
            );
        case TransactionType.AGGREGATE_COMPLETE:
            // read bytes
            const payloadSize = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(0, 8)).reverse()), 16) * 2;
            const cosignatures = transactionData.substring(payloadSize + 8);

            const innerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, payloadSize + 8));
            const consignatureArray = cosignatures.match(/.{1,192}/g);

            return AggregateTransaction.createComplete(
                Deadline.createFromDTO(deadline),
                innerTransactionArray.map((innerTransaction) => {
                    const transaction = CreateTransaction(
                        extractTransactionTypeFromHex(innerTransaction.substring(68, 72)),
                        innerTransaction.substring(72),
                        networkType,
                        deadline,
                    );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), networkType));
                }),
                networkType,
                consignatureArray ? consignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), networkType),
                )) : [],
            );
        case TransactionType.AGGREGATE_BONDED:
            const bondedPayloadSize = parseInt(convert.uint8ToHex(convert.hexToUint8(transactionData.substring(0, 8)).reverse()), 16) * 2;
            const bondedCosignatures = transactionData.substring(bondedPayloadSize + 8);

            const bondedInnerTransactionArray = parseInnerTransactionFromBinary(transactionData.substring(8, bondedPayloadSize + 8));
            const bondedConsignatureArray = bondedCosignatures.match(/.{1,192}/g);

            return AggregateTransaction.createBonded(
                Deadline.createFromDTO(deadline),
                bondedInnerTransactionArray.map((innerTransaction) => {
                    const transaction = CreateTransaction(
                        extractTransactionTypeFromHex(innerTransaction.substring(68, 72)),
                        innerTransaction.substring(72),
                        networkType,
                        deadline,
                        );
                    return transaction.toAggregate(PublicAccount.createFromPublicKey(innerTransaction.substring(0, 64), networkType));
                }),
                networkType,
                bondedConsignatureArray ? bondedConsignatureArray.map((cosignature) => new AggregateTransactionCosignature(
                    cosignature.substring(64, 192),
                    PublicAccount.createFromPublicKey(cosignature.substring(0, 64), networkType),
                )) : [],
            );
        default:
            throw new Error ('Transaction type not implemented yet.');
        }
};

/**
 * @internal
 * @param hexValue - Transaction type in hex
 * @returns {number}
 */
const extractTransactionTypeFromHex = (hexValue: string): number => {
    return parseInt(convert.uint8ToHex(convert.hexToUint8(hexValue).reverse()), 16);
};

/**
 * @internal
 * @param versionHex - Transaction version in hex
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

/**
 * @internal
 * @param innerTransactionBinary - Inner transaction binary data
 * @returns {Array}
 */
const parseInnerTransactionFromBinary = (innerTransactionBinary: string): string[] => {
    const embeddedTransaction: string[] = [];
    let innerBinary = innerTransactionBinary;

    while (innerBinary.length) {
        const payloadSize = parseInt(convert.uint8ToHex(convert.hexToUint8(innerBinary.substring(0, 8)).reverse()), 16) * 2;
        const innerTransaction = innerBinary.substring(8, payloadSize);
        embeddedTransaction.push(innerTransaction);
        innerBinary = innerBinary.substring(payloadSize);
    }
    return embeddedTransaction;
};

/**
 * @internal
 * @param hex - Hex input
 * @returns {string}
 */
const decodeHex = (hex: string): string => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
};

/**
 * @internal
 * @param messageType - Message Type
 * @param payload - Message Payload
 * @returns {Message}
 */
const extractMessage = (messageType: MessageType, payload: string): Message => {
    if (messageType === MessageType.PlainMessage) {
        return PlainMessage.createFromPayload(payload);
    } else if (messageType === MessageType.EncryptedMessage) {
        return EncryptedMessage.createFromPayload(payload);
    } else {
        throw new Error('Invalid message type');
    }
};
