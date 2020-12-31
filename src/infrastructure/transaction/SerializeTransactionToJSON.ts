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

import { Convert } from '../../core/format';
import {
    AccountAddressRestrictionTransaction,
    AccountKeyLinkTransaction,
    AccountMetadataTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    AddressAliasTransaction,
    AggregateTransaction,
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
    Transaction,
    TransactionType,
    TransactionVersion,
    TransferTransaction,
    VotingKeyLinkTransaction,
    VrfKeyLinkTransaction,
} from '../../model/transaction';

/**
 * @internal
 * @param transaction - The transaction class object
 * @returns JSON object
 * @constructor
 */
export const SerializeTransactionToJSON = (transaction: Transaction): any => {
    const version = transaction.version;
    if (transaction.type === TransactionType.ACCOUNT_KEY_LINK) {
        const accountLinkTx = transaction as AccountKeyLinkTransaction;
        return {
            linkedPublicKey: accountLinkTx.linkedPublicKey,
            linkAction: accountLinkTx.linkAction,
        };
    } else if (transaction.type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTx = transaction as AddressAliasTransaction;
        return {
            aliasAction: addressAliasTx.aliasAction,
            namespaceId: addressAliasTx.namespaceId.toHex(),
            address: addressAliasTx.address.toDTO(),
        };
    } else if (transaction.type === TransactionType.AGGREGATE_BONDED || transaction.type === TransactionType.AGGREGATE_COMPLETE) {
        const aggregateTx = transaction as AggregateTransaction;
        return {
            transactions: aggregateTx.innerTransactions.map((innerTransaction) => {
                return innerTransaction.toJSON();
            }),
            cosignatures: aggregateTx.cosignatures.map((cosignature) => {
                return cosignature.toDTO();
            }),
        };
    } else if (transaction.type === TransactionType.HASH_LOCK) {
        const lockFundsTransaction = transaction as LockFundsTransaction;
        return {
            mosaicId: lockFundsTransaction.mosaic.id.toHex(),
            amount: lockFundsTransaction.mosaic.amount.toString(),
            duration: lockFundsTransaction.duration.toString(),
            hash: lockFundsTransaction.hash,
        };
    } else if (transaction.type === TransactionType.ACCOUNT_ADDRESS_RESTRICTION) {
        const accountAddressRestrictionTx = transaction as AccountAddressRestrictionTransaction;
        return {
            restrictionFlags: accountAddressRestrictionTx.restrictionFlags,
            restrictionAdditionsCount: accountAddressRestrictionTx.restrictionAdditions.length,
            restrictionDeletionsCount: accountAddressRestrictionTx.restrictionDeletions.length,
            restrictionAdditions: accountAddressRestrictionTx.restrictionAdditions.map((addition) => {
                return addition.toDTO();
            }),
            restrictionDeletions: accountAddressRestrictionTx.restrictionDeletions.map((deletion) => {
                return deletion.toDTO();
            }),
        };
    } else if (transaction.type === TransactionType.ACCOUNT_OPERATION_RESTRICTION) {
        const accountOperationRestrictionTx = transaction as AccountOperationRestrictionTransaction;
        return {
            restrictionFlags: accountOperationRestrictionTx.restrictionFlags,
            restrictionAdditionsCount: accountOperationRestrictionTx.restrictionAdditions.length,
            restrictionDeletionsCount: accountOperationRestrictionTx.restrictionDeletions.length,
            restrictionAdditions: accountOperationRestrictionTx.restrictionAdditions.map((addition) => {
                return addition;
            }),
            restrictionDeletions: accountOperationRestrictionTx.restrictionDeletions.map((deletion) => {
                return deletion;
            }),
        };
    } else if (transaction.type === TransactionType.ACCOUNT_MOSAIC_RESTRICTION) {
        const accountMosaicRestrictionTx = transaction as AccountMosaicRestrictionTransaction;
        return {
            restrictionFlags: accountMosaicRestrictionTx.restrictionFlags,
            restrictionAdditionsCount: accountMosaicRestrictionTx.restrictionAdditions.length,
            restrictionDeletionsCount: accountMosaicRestrictionTx.restrictionDeletions.length,
            restrictionAdditions: accountMosaicRestrictionTx.restrictionAdditions.map((addition) => {
                return addition.toHex();
            }),
            restrictionDeletions: accountMosaicRestrictionTx.restrictionDeletions.map((deletion) => {
                return deletion.toHex();
            }),
        };
    } else if (transaction.type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION) {
        const multisigTx = transaction as MultisigAccountModificationTransaction;
        return {
            minApprovalDelta: multisigTx.minApprovalDelta,
            minRemovalDelta: multisigTx.minRemovalDelta,
            addressAdditions: multisigTx.addressAdditions.map((addition) => {
                return addition.toDTO();
            }),
            addressDeletions: multisigTx.addressDeletions.map((deletion) => {
                return deletion.toDTO();
            }),
        };
    } else if (transaction.type === TransactionType.MOSAIC_ALIAS) {
        const mosaicAliasTx = transaction as MosaicAliasTransaction;
        return {
            aliasAction: mosaicAliasTx.aliasAction,
            namespaceId: mosaicAliasTx.namespaceId.toHex(),
            mosaicId: mosaicAliasTx.mosaicId.toHex(),
        };
    } else if (transaction.type === TransactionType.MOSAIC_DEFINITION) {
        const mosaicDefinitionTx = transaction as MosaicDefinitionTransaction;
        return {
            nonce: mosaicDefinitionTx.nonce.toDTO(),
            id: mosaicDefinitionTx.mosaicId.toHex(),
            flags: mosaicDefinitionTx.flags.getValue(),
            divisibility: mosaicDefinitionTx.divisibility,
            duration: mosaicDefinitionTx.duration.toString(),
        };
    } else if (transaction.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        const mosaicSupplyTx = transaction as MosaicSupplyChangeTransaction;
        return {
            mosaicId: mosaicSupplyTx.mosaicId.toHex(),
            action: mosaicSupplyTx.action,
            delta: mosaicSupplyTx.delta.toString(),
        };
    } else if (transaction.type === TransactionType.NAMESPACE_REGISTRATION) {
        const namespaceTx = transaction as NamespaceRegistrationTransaction;
        const registerNamespaceDuration = namespaceTx.duration;
        const registerNamespaceParentId = namespaceTx.parentId;

        const jsonObject = {
            registrationType: namespaceTx.registrationType,
            name: namespaceTx.namespaceName,
            id: namespaceTx.namespaceId.toHex(),
        };

        if (registerNamespaceDuration) {
            Object.assign(jsonObject, {
                duration: registerNamespaceDuration.toString(),
            });
        }
        if (registerNamespaceParentId) {
            Object.assign(jsonObject, {
                parentId: registerNamespaceParentId.toHex(),
            });
        }
        return jsonObject;
    } else if (transaction.type === TransactionType.SECRET_LOCK) {
        const secretLockTx = transaction as SecretLockTransaction;
        return {
            mosaicId: secretLockTx.mosaic.id.id.toHex(),
            amount: secretLockTx.mosaic.amount.toString(),
            duration: secretLockTx.duration.toString(),
            hashAlgorithm: secretLockTx.hashAlgorithm,
            secret: secretLockTx.secret,
            recipientAddress: secretLockTx.recipientAddress.toDTO(),
        };
    } else if (transaction.type === TransactionType.SECRET_PROOF) {
        const secretProofTx = transaction as SecretProofTransaction;
        return {
            hashAlgorithm: secretProofTx.hashAlgorithm,
            secret: secretProofTx.secret,
            recipientAddress: secretProofTx.recipientAddress.toDTO(),
            proof: secretProofTx.proof,
        };
    } else if (transaction.type === TransactionType.TRANSFER) {
        const transferTx = transaction as TransferTransaction;
        const messageObject = {
            recipientAddress: transferTx.recipientAddress.toDTO(),
            mosaics: transferTx.mosaics.map((mosaic) => {
                return mosaic.toDTO();
            }),
        };
        if (transferTx.message.toDTO().length) {
            Object.assign(messageObject, {
                message: transferTx.message.toDTO(),
            });
        }
        return messageObject;
    } else if (transaction.type === TransactionType.MOSAIC_GLOBAL_RESTRICTION) {
        const mosaicGlobalRestrictionTx = transaction as MosaicGlobalRestrictionTransaction;
        return {
            mosaicId: mosaicGlobalRestrictionTx.mosaicId.toHex(),
            referenceMosaicId: mosaicGlobalRestrictionTx.referenceMosaicId.toHex(),
            restrictionKey: mosaicGlobalRestrictionTx.restrictionKey.toHex(),
            previousRestrictionValue: mosaicGlobalRestrictionTx.previousRestrictionValue.toString(),
            previousRestrictionType: mosaicGlobalRestrictionTx.previousRestrictionType,
            newRestrictionValue: mosaicGlobalRestrictionTx.newRestrictionValue.toString(),
            newRestrictionType: mosaicGlobalRestrictionTx.newRestrictionType,
        };
    } else if (transaction.type === TransactionType.MOSAIC_ADDRESS_RESTRICTION) {
        const mosaicAddressRestrictionTx = transaction as MosaicAddressRestrictionTransaction;
        return {
            mosaicId: mosaicAddressRestrictionTx.mosaicId.toHex(),
            restrictionKey: mosaicAddressRestrictionTx.restrictionKey.toHex(),
            targetAddress: mosaicAddressRestrictionTx.targetAddress.toDTO(),
            previousRestrictionValue: mosaicAddressRestrictionTx.previousRestrictionValue.toString(),
            newRestrictionValue: mosaicAddressRestrictionTx.newRestrictionValue.toString(),
        };
    } else if (transaction.type === TransactionType.ACCOUNT_METADATA) {
        const accountMetadataTx = transaction as AccountMetadataTransaction;
        return {
            targetAddress: accountMetadataTx.targetAddress,
            scopedMetadataKey: accountMetadataTx.scopedMetadataKey.toHex(),
            valueSizeDelta: accountMetadataTx.valueSizeDelta,
            valueSize: accountMetadataTx.value.length,
            value: Convert.utf8ToHex(accountMetadataTx.value),
        };
    } else if (transaction.type === TransactionType.MOSAIC_METADATA) {
        const mosaicMetadataTx = transaction as MosaicMetadataTransaction;
        return {
            targetAddress: mosaicMetadataTx.targetAddress,
            scopedMetadataKey: mosaicMetadataTx.scopedMetadataKey.toHex(),
            valueSizeDelta: mosaicMetadataTx.valueSizeDelta,
            targetMosaicId: mosaicMetadataTx.targetMosaicId.id.toHex(),
            valueSize: mosaicMetadataTx.value.length,
            value: Convert.utf8ToHex(mosaicMetadataTx.value),
        };
    } else if (transaction.type === TransactionType.NAMESPACE_METADATA) {
        const namespaceMetaTx = transaction as NamespaceMetadataTransaction;
        return {
            targetAddress: namespaceMetaTx.targetAddress,
            scopedMetadataKey: namespaceMetaTx.scopedMetadataKey.toHex(),
            valueSizeDelta: namespaceMetaTx.valueSizeDelta,
            targetNamespaceId: namespaceMetaTx.targetNamespaceId.id.toHex(),
            valueSize: namespaceMetaTx.value.length,
            value: Convert.utf8ToHex(namespaceMetaTx.value),
        };
    } else if (transaction.type === TransactionType.VRF_KEY_LINK) {
        const vrfKeyLinkTx = transaction as VrfKeyLinkTransaction;
        return {
            linkedPublicKey: vrfKeyLinkTx.linkedPublicKey,
            linkAction: vrfKeyLinkTx.linkAction,
        };
    } else if (transaction.type === TransactionType.NODE_KEY_LINK) {
        const nodeKeyLinkTx = transaction as NodeKeyLinkTransaction;
        return {
            linkedPublicKey: nodeKeyLinkTx.linkedPublicKey,
            linkAction: nodeKeyLinkTx.linkAction,
        };
    } else if (transaction.type === TransactionType.VOTING_KEY_LINK && version == TransactionVersion.VOTING_KEY_LINK) {
        const votingKeyLinkTx = transaction as VotingKeyLinkTransaction;
        return {
            linkedPublicKey: votingKeyLinkTx.linkedPublicKey,
            startEpoch: votingKeyLinkTx.startEpoch,
            endEpoch: votingKeyLinkTx.endEpoch,
            linkAction: votingKeyLinkTx.linkAction,
        };
    } else {
        throw new Error(`Transaction type ${transaction.type} not implemented yet for version ${version}.`);
    }
};
