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

import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { LockFundsTransaction } from '../../model/transaction/LockFundsTransaction';
import { ModifyAccountPropertyAddressTransaction } from '../../model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from '../../model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from '../../model/transaction/ModifyAccountPropertyMosaicTransaction';
import { ModifyMultisigAccountTransaction } from '../../model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../model/transaction/MosaicSupplyChangeTransaction';
import { RegisterNamespaceTransaction } from '../../model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';

/**
 * @internal
 * @param transaction - The transaction class object
 * @returns JSON object
 * @constructor
 */
export const SerializeTransactionToJSON = (transaction: Transaction): any => {
    switch (transaction.type) {
        case TransactionType.LINK_ACCOUNT:
            return {
                remoteAccountKey: (transaction as AccountLinkTransaction).remoteAccountKey,
                linkAction: (transaction as AccountLinkTransaction).linkAction,
            };
        case TransactionType.ADDRESS_ALIAS:
            return {
                aliasAction: (transaction as AddressAliasTransaction).actionType,
                namespaceId: (transaction as AddressAliasTransaction).namespaceId.toDTO(),
                address: (transaction as AddressAliasTransaction).address.toDTO(),
            };
        case TransactionType.AGGREGATE_BONDED:
        case TransactionType.AGGREGATE_COMPLETE:
            return {
                transactions: (transaction as AggregateTransaction).innerTransactions.map((innerTransaction) => {
                    return innerTransaction.toJSON();
                }),
                cosignatures: (transaction as AggregateTransaction).cosignatures.map((cosignature) => {
                    return cosignature.toDTO();
                }),
            };
        case TransactionType.LOCK:
            return {
                mosaicId: (transaction as LockFundsTransaction).mosaic.id.id,
                amount: (transaction as LockFundsTransaction).mosaic.amount.toDTO(),
                duration: (transaction as LockFundsTransaction).duration.toDTO(),
                hash: (transaction as LockFundsTransaction).hash,
            };
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            return {
                propertyType: (transaction as ModifyAccountPropertyAddressTransaction).propertyType,
                modifications: (transaction as ModifyAccountPropertyAddressTransaction).
                    modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            return {
                propertyType: (transaction as ModifyAccountPropertyEntityTypeTransaction).propertyType,
                modifications: (transaction as ModifyAccountPropertyEntityTypeTransaction).
                    modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            return {
                propertyType: (transaction as ModifyAccountPropertyMosaicTransaction).propertyType,
                modifications: (transaction as ModifyAccountPropertyMosaicTransaction).modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            return {
                minApprovalDelta: (transaction as ModifyMultisigAccountTransaction).minApprovalDelta,
                minRemovalDelta: (transaction as ModifyMultisigAccountTransaction).minRemovalDelta,
                modifications: (transaction as ModifyMultisigAccountTransaction).modifications.map((modification) => {
                        return modification.toDTO();
                    }),
            };
        case TransactionType.MOSAIC_ALIAS:
            return {
                aliasAction: (transaction as MosaicAliasTransaction).actionType,
                namespaceId: (transaction as MosaicAliasTransaction).namespaceId.toDTO(),
                mosaicId: (transaction as MosaicAliasTransaction).mosaicId.toDTO(),
            };
        case TransactionType.MOSAIC_DEFINITION:
            return {
                nonce: (transaction as MosaicDefinitionTransaction).nonce,
                mosaicId: (transaction as MosaicDefinitionTransaction).mosaicId.toDTO(),
                properties: (transaction as MosaicDefinitionTransaction).mosaicProperties.toDTO(),
            };
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            return {
                mosaicId: (transaction as MosaicSupplyChangeTransaction).mosaicId.toDTO(),
                direction: (transaction as MosaicSupplyChangeTransaction).direction,
                delta: (transaction as MosaicSupplyChangeTransaction).delta.toDTO(),
            };
        case TransactionType.REGISTER_NAMESPACE:
            const registerNamespaceDuration = (transaction as RegisterNamespaceTransaction).duration;
            const registerNamespaceParentId = (transaction as RegisterNamespaceTransaction).parentId;

            const jsonObject = {
                namespaceType: (transaction as RegisterNamespaceTransaction).namespaceType,
                namespaceName: (transaction as RegisterNamespaceTransaction).namespaceName,
                namespaceId: (transaction as RegisterNamespaceTransaction).namespaceId.toDTO(),
            };

            if (registerNamespaceDuration) {
                Object.assign(jsonObject, {duration: registerNamespaceDuration.toDTO()});
            }
            if (registerNamespaceParentId) {
                Object.assign(jsonObject, {parentId: registerNamespaceParentId.toDTO()});
            }
            return jsonObject;
        case TransactionType.SECRET_LOCK:
            return {
                mosaicId: (transaction as SecretLockTransaction).mosaic.id.id,
                amount: (transaction as SecretLockTransaction).mosaic.amount.toDTO(),
                duration: (transaction as SecretLockTransaction).duration.toDTO(),
                hashAlgorithm: (transaction as SecretLockTransaction).hashType,
                secret: (transaction as SecretLockTransaction).secret,
                recipient: (transaction as SecretLockTransaction).recipient.toDTO(),
            };
        case TransactionType.SECRET_PROOF:
            return {
                hashAlgorithm: (transaction as SecretProofTransaction).hashType,
                secret: (transaction as SecretProofTransaction).secret,
                proof: (transaction as SecretProofTransaction).proof,
            };
        case TransactionType.TRANSFER:
            return {
                recipient: (transaction as TransferTransaction).recipient.toDTO(),
                mosaics: (transaction as TransferTransaction).mosaics.map((mosaic) => {
                    return mosaic.toDTO();
                }),
                message: (transaction as TransferTransaction).message.toDTO(),
            };
        default:
            throw new Error ('Transaction type not implemented yet.');
    }

};
