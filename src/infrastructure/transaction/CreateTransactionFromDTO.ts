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
import {convert} from 'nem2-library';
import {uint64 as UInt64Library} from 'nem2-library';
import {Address} from '../../model/account/Address';
import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import {Id} from '../../model/Id';
import {Mosaic} from '../../model/mosaic/Mosaic';
import {MosaicId} from '../../model/mosaic/MosaicId';
import {MosaicProperties} from '../../model/mosaic/MosaicProperties';
import {NamespaceId} from '../../model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import {AccountPropertyModification} from '../../model/transaction/AccountPropertyModification';
import {AddressAliasTransaction} from '../../model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../model/transaction/AggregateTransaction';
import {AggregateTransactionCosignature} from '../../model/transaction/AggregateTransactionCosignature';
import {AggregateTransactionInfo} from '../../model/transaction/AggregateTransactionInfo';
import {Deadline} from '../../model/transaction/Deadline';
import { LinkAction } from '../../model/transaction/LinkAction';
import {LockFundsTransaction} from '../../model/transaction/LockFundsTransaction';
import {ModifyAccountPropertyAddressTransaction} from '../../model/transaction/ModifyAccountPropertyAddressTransaction';
import {ModifyAccountPropertyEntityTypeTransaction} from '../../model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import {ModifyAccountPropertyMosaicTransaction} from '../../model/transaction/ModifyAccountPropertyMosaicTransaction';
import {ModifyMultisigAccountTransaction} from '../../model/transaction/ModifyMultisigAccountTransaction';
import {MosaicAliasTransaction} from '../../model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../model/transaction/MultisigCosignatoryModification';
import {EmptyMessage, PlainMessage} from '../../model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../model/transaction/RegisterNamespaceTransaction';
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
                new UInt64(innerTransactionDTO.meta.height),
                innerTransactionDTO.meta.index,
                innerTransactionDTO.meta.id,
                innerTransactionDTO.meta.aggregateHash,
                innerTransactionDTO.meta.aggregateId,
            ) : undefined;
            innerTransactionDTO.transaction.fee = transactionDTO.transaction.fee;
            innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
            innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
            return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo);
        });
        return new AggregateTransaction(
            extractNetworkType(transactionDTO.transaction.version),
            transactionDTO.transaction.type,
            extractTransactionVersion(transactionDTO.transaction.version),
            Deadline.createFromDTO(transactionDTO.transaction.deadline),
            new UInt64(transactionDTO.transaction.fee || [0, 0]),
            innerTransactions,
            transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
                .map((aggregateCosignatureDTO) => {
                    return new AggregateTransactionCosignature(
                        aggregateCosignatureDTO.signature,
                        PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signer,
                            extractNetworkType(transactionDTO.transaction.version)));
                }) : [],
            transactionDTO.transaction.signature,
            PublicAccount.createFromPublicKey(transactionDTO.transaction.signer, extractNetworkType(transactionDTO.transaction.version)),
            new TransactionInfo(
                new UInt64(transactionDTO.meta.height),
                transactionDTO.meta.index,
                transactionDTO.meta.id,
                transactionDTO.meta.hash,
                transactionDTO.meta.merkleComponentHash,
            ),
        );
    } else {
        const transactionInfo = new TransactionInfo(
            new UInt64(transactionDTO.meta.height),
            transactionDTO.meta.index,
            transactionDTO.meta.id,
            transactionDTO.meta.hash,
            transactionDTO.meta.merkleComponentHash,
        );
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
            new UInt64(transactionDTO.fee || [0, 0]),
            extractRecipient(transactionDTO.recipient),
            extractMosaics(transactionDTO.mosaics),
            transactionDTO.message !== undefined ?
                PlainMessage.createFromDTO(transactionDTO.message.payload) : EmptyMessage,
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.REGISTER_NAMESPACE) {
        return new RegisterNamespaceTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.namespaceType,
            transactionDTO.name,
            new NamespaceId(transactionDTO.namespaceId),
            transactionDTO.namespaceType === 0 ? new UInt64(transactionDTO.duration) : undefined,
            transactionDTO.namespaceType === 1 ? new NamespaceId(transactionDTO.parentId) : undefined,
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_DEFINITION) {
        return new MosaicDefinitionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.nonce,
            new MosaicId(transactionDTO.mosaicId),
            new MosaicProperties(
                new UInt64(transactionDTO.properties[0].value),
                (new UInt64(transactionDTO.properties[1].value)).compact(),
                new UInt64(transactionDTO.properties.length === 3 ? transactionDTO.properties[2].value : [0, 0]),
            ),
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        return new MosaicSupplyChangeTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            new MosaicId(transactionDTO.mosaicId),
            transactionDTO.direction,
            new UInt64(transactionDTO.delta),
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        return new ModifyMultisigAccountTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.minApprovalDelta,
            transactionDTO.minRemovalDelta,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new MultisigCosignatoryModification(
                modificationDTO.type,
                PublicAccount.createFromPublicKey(modificationDTO.cosignatoryPublicKey, extractNetworkType(transactionDTO.version)),
            )) : [],
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.LOCK) {
        const networkType = extractNetworkType(transactionDTO.version);
        return new LockFundsTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
            new UInt64(transactionDTO.duration),
            new SignedTransaction('', transactionDTO.hash, '', TransactionType.AGGREGATE_BONDED, networkType),
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, networkType),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.SECRET_LOCK) {
        return new SecretLockTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
            new UInt64(transactionDTO.duration),
            transactionDTO.hashAlgorithm,
            transactionDTO.secret,
            Address.createFromEncoded(transactionDTO.recipient),
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.SECRET_PROOF) {
        return new SecretProofTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.hashAlgorithm,
            transactionDTO.secret,
            transactionDTO.proof,
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MOSAIC_ALIAS) {
        return new MosaicAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.aliasAction,
            new NamespaceId(transactionDTO.namespaceId),
            new MosaicId(transactionDTO.mosaicId),
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.ADDRESS_ALIAS) {
        return new AddressAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.aliasAction,
            new NamespaceId(transactionDTO.namespaceId),
            extractRecipient(transactionDTO.address) as Address,
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS) {
        return new ModifyAccountPropertyAddressTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification(
                modificationDTO.modificationType,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE) {
        return new ModifyAccountPropertyEntityTypeTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification(
                modificationDTO.modificationType,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC) {
        return new ModifyAccountPropertyMosaicTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountPropertyModification(
                modificationDTO.modificationType,
                modificationDTO.value,
            )) : [],
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    } else if (transactionDTO.type === TransactionType.LINK_ACCOUNT) {
        return new AccountLinkTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            Deadline.createFromDTO(transactionDTO.deadline),
            new UInt64(transactionDTO.fee || [0, 0]),
            transactionDTO.remoteAccountKey,
            transactionDTO.linkAction,
            transactionDTO.signature,
            PublicAccount.createFromPublicKey(transactionDTO.signer, extractNetworkType(transactionDTO.version)),
            transactionInfo,
        );
    }

    throw new Error('Unimplemented transaction with type ' + transactionDTO.type);
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

const extractTransactionVersion = (version: number): number => {
    return parseInt(version.toString(16).substr(2, 2), 16);
};

/**
 * Extract recipient value from encoded hexadecimal notation.
 *
 * If bit 0 of byte 0 is not set (e.g. 0x90), then it is a regular address.
 * Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
 *
 * @param recipient {string} Encoded hexadecimal recipient notation
 * @return {Address | NamespaceId}
 */
const extractRecipient = (recipient: string): Address | NamespaceId => {
    // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
    // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
    const bit0 = convert.hexToUint8(recipient.substr(1, 2))[0];

    if ((bit0 & 16) === 16) {
        // namespaceId encoded hexadecimal notation provided
        // only 8 bytes are relevant to resolve the NamespaceId
        const relevantPart = recipient.substr(2, 16);
        return NamespaceId.createFromEncoded(relevantPart);
    }

    // read address from encoded hexadecimal notation
    return Address.createFromEncoded(recipient);
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
const extractMosaics = (mosaics: any): Mosaic[] => {

    if (mosaics === undefined) {
        return [];
    }

    return mosaics.map((mosaicDTO) => {

        // convert ID to UInt8 bytes array and get first byte (most significant byte)
        const uint64 = new Id(mosaicDTO.id);
        const bytes = convert.hexToUint8(UInt64Library.toHex(uint64.toDTO()));
        const byte0 = bytes[0];

        // if most significant bit of byte 0 is set, then we have a namespaceId
        if ((byte0 & 128) === 128) {
            return new Mosaic(new NamespaceId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
        }

        // most significant bit of byte 0 is not set => mosaicId
        return new Mosaic(new MosaicId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
    });
};
