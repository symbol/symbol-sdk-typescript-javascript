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

import { Convert } from '../../core/format/Convert';
import { AccountAddressRestrictionTransaction } from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountKeyLinkTransaction } from '../../model/transaction/AccountKeyLinkTransaction';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { AccountMosaicRestrictionTransaction } from '../../model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../model/transaction/AccountOperationRestrictionTransaction';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { LockFundsTransaction } from '../../model/transaction/LockFundsTransaction';
import { MosaicAddressRestrictionTransaction } from '../../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import { MosaicSupplyChangeTransaction } from '../../model/transaction/MosaicSupplyChangeTransaction';
import { MultisigAccountModificationTransaction } from '../../model/transaction/MultisigAccountModificationTransaction';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../model/transaction/NamespaceRegistrationTransaction';
import { NodeKeyLinkTransaction } from '../../model/transaction/NodeKeyLinkTransaction';
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';
import { VotingKeyLinkTransaction } from '../../model/transaction/VotingKeyLinkTransaction';
import { VrfKeyLinkTransaction } from '../../model/transaction/VrfKeyLinkTransaction';

/**
 * @internal
 * @param transaction - The transaction class object
 * @returns JSON object
 * @constructor
 */
export const SerializeTransactionToJSON = (transaction: Transaction): any => {
    switch (transaction.type) {
        case TransactionType.ACCOUNT_KEY_LINK:
            const accountLinkTx = transaction as AccountKeyLinkTransaction;
            return {
                linkedPublicKey: accountLinkTx.linkedPublicKey,
                linkAction: accountLinkTx.linkAction,
            };
        case TransactionType.ADDRESS_ALIAS:
            const addressAliasTx = transaction as AddressAliasTransaction;
            return {
                aliasAction: addressAliasTx.aliasAction,
                namespaceId: addressAliasTx.namespaceId.toHex(),
                address: addressAliasTx.address.toDTO(),
            };
        case TransactionType.AGGREGATE_BONDED:
        case TransactionType.AGGREGATE_COMPLETE:
            const aggregateTx = transaction as AggregateTransaction;
            return {
                transactions: aggregateTx.innerTransactions.map((innerTransaction) => {
                    return innerTransaction.toJSON();
                }),
                cosignatures: aggregateTx.cosignatures.map((cosignature) => {
                    return cosignature.toDTO();
                }),
            };
        case TransactionType.HASH_LOCK:
            const LockFundTx = transaction as LockFundsTransaction;
            return {
                mosaicId: LockFundTx.mosaic.id.id,
                amount: LockFundTx.mosaic.amount.toString(),
                duration: LockFundTx.duration.toString(),
                hash: LockFundTx.hash,
            };
        case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
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
        case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
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
        case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
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
        case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
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
        case TransactionType.MOSAIC_ALIAS:
            const mosaicAliasTx = transaction as MosaicAliasTransaction;
            return {
                aliasAction: mosaicAliasTx.aliasAction,
                namespaceId: mosaicAliasTx.namespaceId.toHex(),
                mosaicId: mosaicAliasTx.mosaicId.toHex(),
            };
        case TransactionType.MOSAIC_DEFINITION:
            const mosaicDefinitionTx = transaction as MosaicDefinitionTransaction;
            return {
                nonce: mosaicDefinitionTx.nonce.toDTO(),
                id: mosaicDefinitionTx.mosaicId.toHex(),
                flags: mosaicDefinitionTx.flags.getValue(),
                divisibility: mosaicDefinitionTx.divisibility,
                duration: mosaicDefinitionTx.duration.toString(),
            };
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            const mosaicSupplyTx = transaction as MosaicSupplyChangeTransaction;
            return {
                mosaicId: mosaicSupplyTx.mosaicId.toHex(),
                action: mosaicSupplyTx.action,
                delta: mosaicSupplyTx.delta.toString(),
            };
        case TransactionType.NAMESPACE_REGISTRATION:
            const namespaceTx = transaction as NamespaceRegistrationTransaction;
            const registerNamespaceDuration = namespaceTx.duration;
            const registerNamespaceParentId = namespaceTx.parentId;

            const jsonObject = {
                registrationType: namespaceTx.registrationType,
                namespaceName: namespaceTx.namespaceName,
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
        case TransactionType.SECRET_LOCK:
            const secretLockTx = transaction as SecretLockTransaction;
            return {
                mosaicId: secretLockTx.mosaic.id.id.toHex(),
                amount: secretLockTx.mosaic.amount.toString(),
                duration: secretLockTx.duration.toString(),
                hashAlgorithm: secretLockTx.hashAlgorithm,
                secret: secretLockTx.secret,
                recipientAddress: secretLockTx.recipientAddress.toDTO(),
            };
        case TransactionType.SECRET_PROOF:
            const secretProofTx = transaction as SecretProofTransaction;
            return {
                hashAlgorithm: secretProofTx.hashAlgorithm,
                secret: secretProofTx.secret,
                recipientAddress: secretProofTx.recipientAddress.toDTO(),
                proof: secretProofTx.proof,
            };
        case TransactionType.TRANSFER:
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
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
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
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            const mosaicAddressRestrictionTx = transaction as MosaicAddressRestrictionTransaction;
            return {
                mosaicId: mosaicAddressRestrictionTx.mosaicId.toHex(),
                restrictionKey: mosaicAddressRestrictionTx.restrictionKey.toHex(),
                targetAddress: mosaicAddressRestrictionTx.targetAddress.toDTO(),
                previousRestrictionValue: mosaicAddressRestrictionTx.previousRestrictionValue.toString(),
                newRestrictionValue: mosaicAddressRestrictionTx.newRestrictionValue.toString(),
            };
        case TransactionType.ACCOUNT_METADATA:
            const accountMetadataTx = transaction as AccountMetadataTransaction;
            return {
                targetAddress: accountMetadataTx.targetAddress,
                scopedMetadataKey: accountMetadataTx.scopedMetadataKey.toHex(),
                valueSizeDelta: accountMetadataTx.valueSizeDelta,
                valueSize: accountMetadataTx.value.length,
                value: Convert.utf8ToHex(accountMetadataTx.value),
            };
        case TransactionType.MOSAIC_METADATA:
            const mosaicMetadataTx = transaction as MosaicMetadataTransaction;
            return {
                targetAddress: mosaicMetadataTx.targetAddress,
                scopedMetadataKey: mosaicMetadataTx.scopedMetadataKey.toHex(),
                valueSizeDelta: mosaicMetadataTx.valueSizeDelta,
                targetMosaicId: mosaicMetadataTx.targetMosaicId.id.toHex(),
                valueSize: mosaicMetadataTx.value.length,
                value: Convert.utf8ToHex(mosaicMetadataTx.value),
            };
        case TransactionType.NAMESPACE_METADATA:
            const namespaceMetaTx = transaction as NamespaceMetadataTransaction;
            return {
                targetAddress: namespaceMetaTx.targetAddress,
                scopedMetadataKey: namespaceMetaTx.scopedMetadataKey.toHex(),
                valueSizeDelta: namespaceMetaTx.valueSizeDelta,
                targetNamespaceId: namespaceMetaTx.targetNamespaceId.id.toHex(),
                valueSize: namespaceMetaTx.value.length,
                value: Convert.utf8ToHex(namespaceMetaTx.value),
            };
        case TransactionType.VRF_KEY_LINK:
            const vrfKeyLinkTx = transaction as VrfKeyLinkTransaction;
            return {
                linkedPublicKey: vrfKeyLinkTx.linkedPublicKey,
                linkAction: vrfKeyLinkTx.linkAction,
            };
        case TransactionType.NODE_KEY_LINK:
            const nodeKeyLinkTx = transaction as NodeKeyLinkTransaction;
            return {
                linkedPublicKey: nodeKeyLinkTx.linkedPublicKey,
                linkAction: nodeKeyLinkTx.linkAction,
            };
        case TransactionType.VOTING_KEY_LINK:
            const votingKeyLinkTx = transaction as VotingKeyLinkTransaction;
            return {
                linkedPublicKey: votingKeyLinkTx.linkedPublicKey,
                startEpoch: votingKeyLinkTx.startEpoch.toString(),
                endEpoch: votingKeyLinkTx.endEpoch.toString(),
                linkAction: votingKeyLinkTx.linkAction,
            };
        default:
            throw new Error('Transaction type not implemented yet.');
    }
};
