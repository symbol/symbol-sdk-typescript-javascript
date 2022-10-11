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
import { Convert } from '../..';
import { UnresolvedMapping } from '../../core/utils';
import { MessageFactory, MosaicSupplyRevocationTransaction, UInt64 } from '../../model';
import { Address, PublicAccount } from '../../model/account';
import { Mosaic, MosaicFlags, MosaicId, MosaicNonce } from '../../model/mosaic';
import { NamespaceId } from '../../model/namespace';
import {
    AccountAddressRestrictionTransaction,
    AccountKeyLinkTransaction,
    AccountMetadataTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    AddressAliasTransaction,
    AggregateTransaction,
    AggregateTransactionCosignature,
    AggregateTransactionInfo,
    Deadline,
    LockFundsTransaction,
    MosaicAddressRestrictionTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicGlobalRestrictionTransaction,
    MosaicMetadataTransaction,
    MosaicSupplyChangeTransaction,
    MultisigAccountModificationTransaction,
    NamespaceMetadataTransaction,
    NamespaceRegistrationTransaction,
    NodeKeyLinkTransaction,
    SecretLockTransaction,
    SecretProofTransaction,
    SignedTransaction,
    Transaction,
    TransactionInfo,
    TransactionType,
    TransferTransaction,
    VotingKeyLinkTransaction,
    VrfKeyLinkTransaction,
} from '../../model/transaction';

/**
 * Extract recipientAddress value from encoded hexadecimal notation.
 *
 * If bit 0 of byte 0 is not set (e.g. 0x90), then it is a regular address.
 * Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
 *
 * @param recipientAddress {string} Encoded hexadecimal recipientAddress notation
 * @return {Address | NamespaceId}
 */
export const extractRecipient = (recipientAddress: any): Address | NamespaceId => {
    if (typeof recipientAddress === 'string') {
        return UnresolvedMapping.toUnresolvedAddress(recipientAddress);
    } else if (typeof recipientAddress === 'object') {
        // Is JSON object
        if (recipientAddress.hasOwnProperty('address')) {
            return Address.createFromRawAddress(recipientAddress.address);
        } else if (recipientAddress.hasOwnProperty('id')) {
            return NamespaceId.createFromEncoded(recipientAddress.id);
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
        const id = UnresolvedMapping.toUnresolvedMosaic(mosaicDTO.id);
        return new Mosaic(id, UInt64.fromNumericString(mosaicDTO.amount));
    });
};

/**
 * Extract deadline from json payload.
 * @param deadline - deadline dto
 */
const extractDeadline = (deadline?: string): Deadline => {
    if (!deadline) {
        return Deadline.createEmtpy();
    }
    return Deadline.createFromDTO(deadline);
};

/**
 * @internal
 * Extract transaction meta data
 *
 * @param meta - Transaction meta data
 * @param id - TransactionId
 * @return {TransactionInfo | AggregateTransactionInfo | undefined}
 */
const extractTransactionMeta = (meta: any, id: string): TransactionInfo | AggregateTransactionInfo | undefined => {
    if (!meta) {
        return undefined;
    }
    if (meta.aggregateHash || meta.aggregateId) {
        return new AggregateTransactionInfo(
            UInt64.fromNumericString(meta.height),
            meta.index,
            id,
            UInt64.fromNumericString(meta.timestamp ?? '0'),
            meta.feeMultiplier ?? 0,
            meta.aggregateHash,
            meta.aggregateId,
        );
    }
    return new TransactionInfo(
        UInt64.fromNumericString(meta.height),
        meta.index,
        id,
        UInt64.fromNumericString(meta.timestamp ?? '0'),
        meta.feeMultiplier ?? 0,
        meta.hash,
        meta.merkleComponentHash,
    );
};
/**
 * @internal
 * @param transactionDTO
 * @param isEmbedded
 * @returns {any}
 * @constructor
 */
const CreateStandaloneTransactionFromDTO = (transactionDTO, transactionInfo): Transaction => {
    const type: TransactionType = transactionDTO.type;
    const version: number = transactionDTO.version;
    const signature = Transaction.resolveSignature(transactionDTO.signature, false);
    const maxFee = UInt64.fromNumericString(transactionDTO.maxFee || '0');
    const deadline = extractDeadline(transactionDTO.deadline);
    const networkType = transactionDTO.network;
    const signer = transactionDTO.signerPublicKey
        ? PublicAccount.createFromPublicKey(transactionDTO.signerPublicKey, networkType)
        : undefined;
    switch (type) {
        case TransactionType.TRANSFER:
            return new TransferTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                extractRecipient(transactionDTO.recipientAddress),
                extractMosaics(transactionDTO.mosaics),
                MessageFactory.createMessageFromHex(transactionDTO.message),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);

        case TransactionType.NAMESPACE_REGISTRATION:
            return new NamespaceRegistrationTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.registrationType,
                transactionDTO.name,
                NamespaceId.createFromEncoded(transactionDTO.id),
                transactionDTO.registrationType === 0 ? UInt64.fromNumericString(transactionDTO.duration) : undefined,
                transactionDTO.registrationType === 1 ? NamespaceId.createFromEncoded(transactionDTO.parentId) : undefined,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_DEFINITION:
            return new MosaicDefinitionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                MosaicNonce.createFromNumber(transactionDTO.nonce),
                new MosaicId(transactionDTO.id),
                new MosaicFlags(transactionDTO.flags),
                transactionDTO.divisibility,
                UInt64.fromNumericString(transactionDTO.duration),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            return new MosaicSupplyChangeTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                UnresolvedMapping.toUnresolvedMosaic(transactionDTO.mosaicId),
                transactionDTO.action,
                UInt64.fromNumericString(transactionDTO.delta),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_SUPPLY_REVOCATION:
            return new MosaicSupplyRevocationTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                extractRecipient(transactionDTO.sourceAddress),
                new Mosaic(new MosaicId(transactionDTO.mosaicId), UInt64.fromNumericString(transactionDTO.amount)),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
            return new MultisigAccountModificationTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.minApprovalDelta,
                transactionDTO.minRemovalDelta,
                transactionDTO.addressAdditions ? transactionDTO.addressAdditions.map((addition) => extractRecipient(addition)) : [],
                transactionDTO.addressDeletions ? transactionDTO.addressDeletions.map((deletion) => extractRecipient(deletion)) : [],
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.HASH_LOCK:
            return new LockFundsTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                new Mosaic(new MosaicId(transactionDTO.mosaicId), UInt64.fromNumericString(transactionDTO.amount)),
                UInt64.fromNumericString(transactionDTO.duration),
                new SignedTransaction('', transactionDTO.hash, '', TransactionType.AGGREGATE_BONDED, networkType),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.SECRET_LOCK:
            const recipientAddress = transactionDTO.recipientAddress;
            const mosaicId = UnresolvedMapping.toUnresolvedMosaic(transactionDTO.mosaicId);
            return new SecretLockTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                new Mosaic(mosaicId, UInt64.fromNumericString(transactionDTO.amount)),
                UInt64.fromNumericString(transactionDTO.duration),
                transactionDTO.hashAlgorithm,
                transactionDTO.secret,
                extractRecipient(recipientAddress),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.SECRET_PROOF:
            return new SecretProofTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.hashAlgorithm,
                transactionDTO.secret,
                extractRecipient(transactionDTO.recipientAddress),
                transactionDTO.proof,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_ALIAS:
            return new MosaicAliasTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.aliasAction,
                NamespaceId.createFromEncoded(transactionDTO.namespaceId),
                new MosaicId(transactionDTO.mosaicId),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ADDRESS_ALIAS:
            return new AddressAliasTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.aliasAction,
                NamespaceId.createFromEncoded(transactionDTO.namespaceId),
                extractRecipient(transactionDTO.address) as Address,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
            return new AccountAddressRestrictionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.restrictionFlags,
                transactionDTO.restrictionAdditions
                    ? transactionDTO.restrictionAdditions.map((addition) => extractRecipient(addition))
                    : [],
                transactionDTO.restrictionDeletions
                    ? transactionDTO.restrictionDeletions.map((deletion) => extractRecipient(deletion))
                    : [],
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
            return new AccountOperationRestrictionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.restrictionFlags,
                transactionDTO.restrictionAdditions ? transactionDTO.restrictionAdditions : [],
                transactionDTO.restrictionDeletions ? transactionDTO.restrictionDeletions : [],
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
            return new AccountMosaicRestrictionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.restrictionFlags,
                transactionDTO.restrictionAdditions
                    ? transactionDTO.restrictionAdditions.map((addition) => UnresolvedMapping.toUnresolvedMosaic(addition))
                    : [],
                transactionDTO.restrictionDeletions
                    ? transactionDTO.restrictionDeletions.map((deletion) => UnresolvedMapping.toUnresolvedMosaic(deletion))
                    : [],
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ACCOUNT_KEY_LINK:
            return new AccountKeyLinkTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.linkedPublicKey,
                transactionDTO.linkAction,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
            return new MosaicGlobalRestrictionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                UnresolvedMapping.toUnresolvedMosaic(transactionDTO.mosaicId),
                UnresolvedMapping.toUnresolvedMosaic(transactionDTO.referenceMosaicId),
                UInt64.fromHex(transactionDTO.restrictionKey),
                UInt64.fromNumericString(transactionDTO.previousRestrictionValue),
                transactionDTO.previousRestrictionType,
                UInt64.fromNumericString(transactionDTO.newRestrictionValue),
                transactionDTO.newRestrictionType,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            return new MosaicAddressRestrictionTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                UnresolvedMapping.toUnresolvedMosaic(transactionDTO.mosaicId),
                UInt64.fromHex(transactionDTO.restrictionKey),
                extractRecipient(transactionDTO.targetAddress),
                UInt64.fromNumericString(transactionDTO.previousRestrictionValue),
                UInt64.fromNumericString(transactionDTO.newRestrictionValue),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.ACCOUNT_METADATA:
            return new AccountMetadataTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                extractRecipient(transactionDTO.targetAddress),
                UInt64.fromHex(transactionDTO.scopedMetadataKey),
                transactionDTO.valueSizeDelta,
                Convert.hexToUint8(transactionDTO.value),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.MOSAIC_METADATA:
            return new MosaicMetadataTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                extractRecipient(transactionDTO.targetAddress),
                UInt64.fromHex(transactionDTO.scopedMetadataKey),
                UnresolvedMapping.toUnresolvedMosaic(transactionDTO.targetMosaicId),
                transactionDTO.valueSizeDelta,
                Convert.hexToUint8(transactionDTO.value),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.NAMESPACE_METADATA:
            return new NamespaceMetadataTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                extractRecipient(transactionDTO.targetAddress),
                UInt64.fromHex(transactionDTO.scopedMetadataKey),
                NamespaceId.createFromEncoded(transactionDTO.targetNamespaceId),
                transactionDTO.valueSizeDelta,
                Convert.hexToUint8(transactionDTO.value),
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.VRF_KEY_LINK:
            return new VrfKeyLinkTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.linkedPublicKey,
                transactionDTO.linkAction,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.NODE_KEY_LINK:
            return new NodeKeyLinkTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.linkedPublicKey,
                transactionDTO.linkAction,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        case TransactionType.VOTING_KEY_LINK:
            return new VotingKeyLinkTransaction(
                networkType,
                version,
                deadline,
                maxFee,
                transactionDTO.linkedPublicKey,
                transactionDTO.startEpoch,
                transactionDTO.endEpoch,
                transactionDTO.linkAction,
                signature,
                signer,
                transactionInfo,
            ).setPayloadSize(transactionDTO.size);
        default:
            throw new Error(`Unimplemented transaction with type ${type} for version ${version}`);
    }
};

/**
 * @internal
 * @param transactionDTO
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromDTO = (transactionDTO): Transaction => {
    if (
        transactionDTO.transaction.type === TransactionType.AGGREGATE_COMPLETE ||
        transactionDTO.transaction.type === TransactionType.AGGREGATE_BONDED
    ) {
        const innerTransactions = transactionDTO.transaction.transactions
            ? transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
                  const aggregateTransactionInfo = extractTransactionMeta(innerTransactionDTO.meta, innerTransactionDTO.id);
                  innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
                  innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
                  innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
                  return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo);
              })
            : [];
        return new AggregateTransaction(
            transactionDTO.transaction.network,
            transactionDTO.transaction.type,
            transactionDTO.transaction.version,
            extractDeadline(transactionDTO.transaction.deadline),
            UInt64.fromNumericString(transactionDTO.transaction.maxFee || '0'),
            innerTransactions,
            transactionDTO.transaction.cosignatures
                ? transactionDTO.transaction.cosignatures.map((aggregateCosignatureDTO) => {
                      return new AggregateTransactionCosignature(
                          aggregateCosignatureDTO.signature,
                          PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signerPublicKey, transactionDTO.transaction.network),
                          UInt64.fromNumericString(aggregateCosignatureDTO.version),
                      );
                  })
                : [],
            Transaction.resolveSignature(transactionDTO.transaction.signature, false),
            transactionDTO.transaction.signerPublicKey
                ? PublicAccount.createFromPublicKey(transactionDTO.transaction.signerPublicKey, transactionDTO.transaction.network)
                : undefined,
            extractTransactionMeta(transactionDTO.meta, transactionDTO.id),
        ).setPayloadSize(transactionDTO.transaction.size);
    } else {
        return CreateStandaloneTransactionFromDTO(
            transactionDTO.transaction,
            extractTransactionMeta(transactionDTO.meta, transactionDTO.id),
        );
    }
};
