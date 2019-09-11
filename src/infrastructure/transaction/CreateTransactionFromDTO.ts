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
import {Convert as convert} from '../../core/format';
import {RawUInt64 as UInt64Library} from '../../core/format';
import {Address} from '../../model/account/Address';
import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import {Id} from '../../model/Id';
import {Mosaic} from '../../model/mosaic/Mosaic';
import {MosaicId} from '../../model/mosaic/MosaicId';
import {MosaicProperties} from '../../model/mosaic/MosaicProperties';
import {NamespaceId} from '../../model/namespace/NamespaceId';
import {AccountAddressRestrictionTransaction} from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import {AccountMosaicRestrictionTransaction} from '../../model/transaction/AccountMosaicRestrictionTransaction';
import {AccountOperationRestrictionTransaction} from '../../model/transaction/AccountOperationRestrictionTransaction';
import {AccountRestrictionModification} from '../../model/transaction/AccountRestrictionModification';
import {AddressAliasTransaction} from '../../model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../model/transaction/AggregateTransaction';
import {AggregateTransactionCosignature} from '../../model/transaction/AggregateTransactionCosignature';
import {AggregateTransactionInfo} from '../../model/transaction/AggregateTransactionInfo';
import {Deadline} from '../../model/transaction/Deadline';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import {LockFundsTransaction} from '../../model/transaction/LockFundsTransaction';
import { MessageType } from '../../model/transaction/MessageType';
import { MosaicAddressRestrictionTransaction } from '../../model/transaction/MosaicAddressRestrictionTransaction';
import {MosaicAliasTransaction} from '../../model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import {MosaicSupplyChangeTransaction} from '../../model/transaction/MosaicSupplyChangeTransaction';
import {MultisigAccountModificationTransaction} from '../../model/transaction/MultisigAccountModificationTransaction';
import {MultisigCosignatoryModification} from '../../model/transaction/MultisigCosignatoryModification';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetadataTransaction';
import {NamespaceRegistrationTransaction} from '../../model/transaction/NamespaceRegistrationTransaction';
import {EmptyMessage, PlainMessage} from '../../model/transaction/PlainMessage';
import {SecretLockTransaction} from '../../model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../model/transaction/SecretProofTransaction';
import {SignedTransaction} from '../../model/transaction/SignedTransaction';
import {Transaction} from '../../model/transaction/Transaction';
import {TransactionInfo} from '../../model/transaction/TransactionInfo';
import {TransactionType} from '../../model/transaction/TransactionType';
import {TransferTransaction} from '../../model/transaction/TransferTransaction';
import {UInt64} from '../../model/UInt64';

/**
 * @internal
 * @param transactionDTO
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromDTO = (transactionDTO): Transaction => {
    if (transactionDTO.transaction.type === TransactionType.AGGREGATE_COMPLETE ||
        transactionDTO.transaction.type === TransactionType.AGGREGATE_BONDED) {
        const innerTransactions = transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
            const aggregateTransactionInfo = innerTransactionDTO.meta ? new AggregateTransactionInfo(
                UInt64.fromNumericString(innerTransactionDTO.meta.height),
                innerTransactionDTO.meta.index,
                innerTransactionDTO.meta.id,
                innerTransactionDTO.meta.aggregateHash,
                innerTransactionDTO.meta.aggregateId,
            ) : undefined;
            innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
            innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
            innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
            return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo);
        });
        return new AggregateTransaction(
            extractNetworkType(transactionDTO.transaction.version),
            transactionDTO.transaction.type,
            extractTransactionVersion(transactionDTO.transaction.version),
            Deadline.createFromDTO(transactionDTO.transaction.deadline),
            UInt64.fromNumericString(transactionDTO.transaction.maxFee || '0'),
            innerTransactions,
            transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
                .map((aggregateCosignatureDTO) => {
                    return new AggregateTransactionCosignature(
                        aggregateCosignatureDTO.signature,
                        PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.transaction.version)));
                }) : [],
            transactionDTO.transaction.signature,
            transactionDTO.transaction.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.transaction.signerPublicKey,
                            extractNetworkType(transactionDTO.transaction.version)) : undefined,
            transactionDTO.meta ? new TransactionInfo(
                UInt64.fromNumericString(transactionDTO.meta.height),
                transactionDTO.meta.index,
                transactionDTO.meta.id,
                transactionDTO.meta.hash,
                transactionDTO.meta.merkleComponentHash,
            ) : undefined,
        );
    } else {
        const transactionInfo = transactionDTO.meta ? new TransactionInfo(
            UInt64.fromNumericString(transactionDTO.meta.height),
            transactionDTO.meta.index,
            transactionDTO.meta.id,
            transactionDTO.meta.hash,
            transactionDTO.meta.merkleComponentHash,
        ) : undefined;
        return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, transactionInfo);
    }
};

/**
 * @internal
 * @param transactionDTO
 * @param transactionInfo
 * @returns {any}
 * @constructor
 */
const CreateStandaloneTransactionFromDTO = (transactionDTO, transactionInfo): Transaction => {

    if (transactionDTO.type === TransactionType.TRANSFER) {
        return new TransferTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            extractRecipient(transactionDTO.recipientAddress),
            extractMosaics(transactionDTO.mosaics),
            extractMessage(transactionDTO.message !== undefined ? transactionDTO.message : undefined),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.REGISTER_NAMESPACE) {
        return new NamespaceRegistrationTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.registrationType,
            transactionDTO.name,
            new NamespaceId(UInt64.fromHex(transactionDTO.id).toDTO()),
            transactionDTO.registrationType === 0 ? UInt64.fromNumericString(transactionDTO.duration) : undefined,
            transactionDTO.registrationType === 1 ? new NamespaceId(UInt64.fromHex(transactionDTO.parentId).toDTO()) : undefined,
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_DEFINITION) {
        return new MosaicDefinitionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.nonce,
            new MosaicId(transactionDTO.id),
            new MosaicProperties(
                transactionDTO.flags,
                transactionDTO.divisibility,
                UInt64.fromNumericString(transactionDTO.duration),
            ),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        return new MosaicSupplyChangeTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            new MosaicId(transactionDTO.mosaicId),
            transactionDTO.direction,
            UInt64.fromNumericString(transactionDTO.delta),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        return new MultisigAccountModificationTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.minApprovalDelta,
            transactionDTO.minRemovalDelta,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new MultisigCosignatoryModification(
                modificationDTO.modificiationType,
                PublicAccount.createFromPublicKey(modificationDTO.cosignatoryPublicKey, extractNetworkType(transactionDTO.version)),
            )) : [],
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.LOCK) {
        const networkType = extractNetworkType(transactionDTO.version);
        return new LockFundsTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), UInt64.fromNumericString(transactionDTO.amount)),
            UInt64.fromNumericString(transactionDTO.duration),
            new SignedTransaction('', transactionDTO.hash, '', TransactionType.AGGREGATE_BONDED, networkType),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey, networkType) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.SECRET_LOCK) {
        const recipientAddress = transactionDTO.recipientAddress;
        return new SecretLockTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), UInt64.fromNumericString(transactionDTO.amount)),
            UInt64.fromNumericString(transactionDTO.duration),
            transactionDTO.hashAlgorithm,
            transactionDTO.secret,
            typeof recipientAddress === 'object' && recipientAddress.hasOwnProperty('address') ?
                Address.createFromRawAddress(recipientAddress.address) : Address.createFromEncoded(recipientAddress),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.SECRET_PROOF) {
        const recipientAddress = transactionDTO.recipientAddress;
        return new SecretProofTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.hashAlgorithm,
            transactionDTO.secret,
            typeof recipientAddress === 'object' && recipientAddress.hasOwnProperty('address') ?
                Address.createFromRawAddress(recipientAddress.address) : Address.createFromEncoded(recipientAddress),
            transactionDTO.proof,
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_ALIAS) {
        return new MosaicAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.aliasAction,
            new NamespaceId(UInt64.fromHex(transactionDTO.namespaceId).toDTO()),
            new MosaicId(transactionDTO.mosaicId),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ADDRESS_ALIAS) {
        return new AddressAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.aliasAction,
            new NamespaceId(UInt64.fromHex(transactionDTO.namespaceId).toDTO()),
            extractRecipient(transactionDTO.address) as Address,
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ACCOUNT_RESTRICTION_ADDRESS) {
        return new AccountAddressRestrictionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.restrictionType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification(
                modificationDTO.modificationAction,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ACCOUNT_RESTRICTION_OPERATION) {
        return new AccountOperationRestrictionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.restrictionType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification(
                modificationDTO.modificationAction,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ACCOUNT_RESTRICTION_MOSAIC) {
        return new AccountMosaicRestrictionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.restrictionType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification(
                modificationDTO.modificationAction,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.LINK_ACCOUNT) {
        return new AccountLinkTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.remotePublicKey,
            transactionDTO.linkAction,
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_GLOBAL_RESTRICTION) {
        return new MosaicGlobalRestrictionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            new MosaicId(transactionDTO.mosaicId),
            new MosaicId(transactionDTO.referenceMosaicId),
            UInt64.fromNumericString(transactionDTO.restrictionKey),
            UInt64.fromNumericString(transactionDTO.previousRestrictionValue),
            transactionDTO.previousRestrictionType,
            UInt64.fromNumericString(transactionDTO.newRestrictionValue),
            transactionDTO.newRestrictionType,
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_ADDRESS_RESTRICTION) {
        const targetAddress = transactionDTO.targetAddress;
        return new MosaicAddressRestrictionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            new MosaicId(transactionDTO.mosaicId),
            UInt64.fromNumericString(transactionDTO.restrictionKey),
            typeof targetAddress === 'object' && targetAddress.hasOwnProperty('address') ?
                Address.createFromRawAddress(targetAddress.address) : Address.createFromEncoded(targetAddress),
                UInt64.fromNumericString(transactionDTO.previousRestrictionValue),
            UInt64.fromNumericString(transactionDTO.newRestrictionValue),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ACCOUNT_METADATA_TRANSACTION) {
        return new AccountMetadataTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.targetPublicKey,
            UInt64.fromNumericString(transactionDTO.scopedMetadataKey),
            transactionDTO.valueSizeDelta,
            convert.hexToUint8(transactionDTO.value),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_METADATA_TRANSACTION) {
        return new MosaicMetadataTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.targetPublicKey,
            UInt64.fromNumericString(transactionDTO.scopedMetadataKey),
            new MosaicId(transactionDTO.targetMosaicId),
            transactionDTO.valueSizeDelta,
            convert.hexToUint8(transactionDTO.value),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.NAMESPACE_METADATA_TRANSACTION) {
        return new NamespaceMetadataTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            UInt64.fromNumericString(transactionDTO.maxFee || '0'),
            transactionDTO.targetPublicKey,
            UInt64.fromNumericString(transactionDTO.scopedMetadataKey),
            new NamespaceId(UInt64.fromHex(transactionDTO.targetNamespaceId).toDTO()),
            transactionDTO.valueSizeDelta,
            convert.hexToUint8(transactionDTO.value),
            transactionDTO.signature,
            transactionDTO.signerPublicKey ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
    }
    throw new Error('Unimplemented transaction with type ' + transactionDTO.type);
};

export const extractNetworkType = (version: number): NetworkType => {
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

export const extractTransactionVersion = (version: number): number => {
    return parseInt(version.toString(16).substr(2, 2), 16);
};

/**
 * Extract recipientAddress value from encoded hexadecimal notation.
 *
 * If bit 0 of byte 0 is not set (e.g. 0x90), then it is a regular address.
 * Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
 *
 * @param recipientAddress {string} Encoded hexadecimal recipientAddress notation
 * @return {Address | NamespaceId}
 */
export const extractRecipient = (recipientAddress: any): Address | NamespaceId => {
    if (typeof recipientAddress === 'string') {
        // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
        // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
        const bit0 = convert.hexToUint8(recipientAddress.substr(1, 2))[0];
        if ((bit0 & 16) === 16) {
            // namespaceId encoded hexadecimal notation provided
            // only 8 bytes are relevant to resolve the NamespaceId
            const relevantPart = recipientAddress.substr(2, 16);
            return NamespaceId.createFromEncoded(relevantPart);
        }

        // read address from encoded hexadecimal notation
        return Address.createFromEncoded(recipientAddress);
    } else if (typeof recipientAddress === 'object') { // Is JSON object
        if (recipientAddress.hasOwnProperty('address')) {
            return Address.createFromRawAddress(recipientAddress.address);
        } else if (recipientAddress.hasOwnProperty('id')) {
            return new NamespaceId(UInt64.fromHex(recipientAddress.id).toDTO());
        }
    }
    throw new Error(`Recipient: ${recipientAddress} type is not recognised`);
};

/**
 * Extract mosaics from encoded UInt64 notation.
 *
 * If most significant bit of byte 0 is set, then it is a namespaceId.
 * If most significant bit of byte 0 is not set, then it is a mosaicId.
 *
 * @param mosaics {Array | undefined} The DTO array of mosaics (with UInt64 Id notation)
 * @return {Mosaic[]}
 */
export const extractMosaics = (mosaics: any): Mosaic[] => {

    if (mosaics === undefined) {
        return [];
    }

    return mosaics.map((mosaicDTO) => {

        // convert ID to UInt8 bytes array and get first byte (most significant byte)
        const bytes = convert.hexToUint8(mosaicDTO.id).reverse();
        const byte0 = bytes[0];

        // if most significant bit of byte 0 is set, then we have a namespaceId
        if ((byte0 & 128) === 128) {
            const namespaceId = new NamespaceId(UInt64.fromHex(mosaicDTO.id).toDTO());
            return new Mosaic(namespaceId, UInt64.fromNumericString(mosaicDTO.amount));
        }

        // most significant bit of byte 0 is not set => mosaicId
        return new Mosaic(new MosaicId(mosaicDTO.id), UInt64.fromNumericString(mosaicDTO.amount));
    });
};

/**
 * Extract message from either JSON payload (unencoded) or DTO (encoded)
 *
 * @param message - message payload
 * @return {PlainMessage}
 */
const extractMessage = (message: any): PlainMessage | EncryptedMessage => {
    let msgObj = EmptyMessage;
    if (message) {
        if (message.type === MessageType.PlainMessage) {
            msgObj = convert.isHexString(message.payload) ? PlainMessage.createFromPayload(message.payload) :
                                                    PlainMessage.create(message.payload);
        } else if (message.type === MessageType.EncryptedMessage) {
            msgObj = EncryptedMessage.createFromPayload(message.payload);
        }
    }
    return msgObj;
};

/**
 * Extract beneficiary public key from DTO.
 *
 * @todo Upgrade of catapult-rest WITH catapult-service-bootstrap versioning.
 *
 * With `cow` upgrade (nemtech/catapult-server@0.3.0.2), `catapult-rest` block DTO
 * was updated and latest catapult-service-bootstrap uses the wrong block DTO.
 * This will be fixed with next catapult-server upgrade to `dragon`.
 *
 * :warning It is currently not possible to read the block's beneficiary public key
 * except when working with a local instance of `catapult-rest`.
 *
 * @param beneficiary {string | undefined} The beneficiary public key if set
 * @return {Mosaic[]}
 */
export const extractBeneficiary = (
    blockDTO: any,
    networkType: NetworkType,
): PublicAccount | undefined => {

    let dtoPublicAccount: PublicAccount | undefined;
    let dtoFieldValue: string | undefined;
    if (blockDTO.beneficiaryPublicKey) {
        dtoFieldValue = blockDTO.beneficiaryPublicKey;
    } else if (blockDTO.beneficiary) {
        dtoFieldValue = blockDTO.beneficiary;
    }

    if (! dtoFieldValue) {
        return undefined;
    }

    try {
        // @FIX with latest catapult-service-bootstrap version, catapult-rest still returns
        //      a `string` formatted copy of the public *when it is set at all*.
        dtoPublicAccount = PublicAccount.createFromPublicKey(dtoFieldValue, networkType);
    } catch (e) { dtoPublicAccount =  undefined; }

    return dtoPublicAccount;
};
