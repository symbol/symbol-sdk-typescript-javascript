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

import { EmbeddedTransactionBuilder, TransactionBuilder } from 'catbuffer-typescript';
import { Convert as convert } from '../../core/format';
import { AccountAddressRestrictionTransaction } from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountKeyLinkTransaction } from '../../model/transaction/AccountKeyLinkTransaction';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { AccountMosaicRestrictionTransaction } from '../../model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../model/transaction/AccountOperationRestrictionTransaction';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { InnerTransaction } from '../../model/transaction/InnerTransaction';
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
 * @param payload - The transaction binary data
 * @param isEmbedded - Is the transaction an embedded inner transaction
 * @returns {Transaction | InnerTransaction}
 * @constructor
 */
export const CreateTransactionFromPayload = (payload: string, isEmbedded = false): Transaction | InnerTransaction => {
    const transactionBuilder = isEmbedded
        ? EmbeddedTransactionBuilder.loadFromBinary(convert.hexToUint8(payload))
        : TransactionBuilder.loadFromBinary(convert.hexToUint8(payload));
    const type = transactionBuilder.getType().valueOf();
    switch (type) {
        case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
            return AccountAddressRestrictionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
            return AccountMosaicRestrictionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
            return AccountOperationRestrictionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.ACCOUNT_KEY_LINK:
            return AccountKeyLinkTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.ADDRESS_ALIAS:
            return AddressAliasTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_ALIAS:
            return MosaicAliasTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_DEFINITION:
            return MosaicDefinitionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            return MosaicSupplyChangeTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.NAMESPACE_REGISTRATION:
            return NamespaceRegistrationTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.TRANSFER:
            return TransferTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.SECRET_LOCK:
            return SecretLockTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.SECRET_PROOF:
            return SecretProofTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
            return MultisigAccountModificationTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.HASH_LOCK:
            return LockFundsTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
            return MosaicGlobalRestrictionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            return MosaicAddressRestrictionTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.ACCOUNT_METADATA:
            return AccountMetadataTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.MOSAIC_METADATA:
            return MosaicMetadataTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.NAMESPACE_METADATA:
            return NamespaceMetadataTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.VRF_KEY_LINK:
            return VrfKeyLinkTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.NODE_KEY_LINK:
            return NodeKeyLinkTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.VOTING_KEY_LINK:
            return VotingKeyLinkTransaction.createFromPayload(payload, isEmbedded);
        case TransactionType.AGGREGATE_COMPLETE:
        case TransactionType.AGGREGATE_BONDED:
            return AggregateTransaction.createFromPayload(payload);
        default:
            throw new Error('Transaction type not implemented yet.');
    }
};
