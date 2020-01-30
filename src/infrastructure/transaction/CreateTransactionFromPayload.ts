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

import {
    AccountAddressRestrictionTransactionBuilder,
    AccountLinkTransactionBuilder,
    AccountMetadataTransactionBuilder,
    AccountMosaicRestrictionTransactionBuilder,
    AccountOperationRestrictionTransactionBuilder,
    AddressAliasTransactionBuilder,
    AggregateBondedTransactionBuilder,
    AggregateCompleteTransactionBuilder,
    EmbeddedAccountAddressRestrictionTransactionBuilder,
    EmbeddedAccountLinkTransactionBuilder,
    EmbeddedAccountMetadataTransactionBuilder,
    EmbeddedAccountMosaicRestrictionTransactionBuilder,
    EmbeddedAccountOperationRestrictionTransactionBuilder,
    EmbeddedAddressAliasTransactionBuilder,
    EmbeddedHashLockTransactionBuilder,
    EmbeddedMosaicAddressRestrictionTransactionBuilder,
    EmbeddedMosaicAliasTransactionBuilder,
    EmbeddedMosaicDefinitionTransactionBuilder,
    EmbeddedMosaicGlobalRestrictionTransactionBuilder,
    EmbeddedMosaicMetadataTransactionBuilder,
    EmbeddedMosaicSupplyChangeTransactionBuilder,
    EmbeddedMultisigAccountModificationTransactionBuilder,
    EmbeddedNamespaceMetadataTransactionBuilder,
    EmbeddedNamespaceRegistrationTransactionBuilder,
    EmbeddedSecretLockTransactionBuilder,
    EmbeddedSecretProofTransactionBuilder,
    EmbeddedTransactionBuilder,
    EmbeddedTransactionHelper,
    EmbeddedTransferTransactionBuilder,
    HashLockTransactionBuilder,
    MosaicAddressRestrictionTransactionBuilder,
    MosaicAliasTransactionBuilder,
    MosaicDefinitionTransactionBuilder,
    MosaicGlobalRestrictionTransactionBuilder,
    MosaicMetadataTransactionBuilder,
    MosaicSupplyChangeTransactionBuilder,
    MultisigAccountModificationTransactionBuilder,
    NamespaceMetadataTransactionBuilder,
    NamespaceRegistrationTransactionBuilder,
    SecretLockTransactionBuilder,
    SecretProofTransactionBuilder,
    TransactionHelper,
    TransferTransactionBuilder
} from 'catbuffer';
import { Convert, Convert as convert } from '../../core/format';
import { Deadline, PublicAccount, UInt64 } from '../../model/model';
import { AccountAddressRestrictionTransaction } from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
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
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';

/**
 * @internal
 * @param payload - The transaction binary data
 * @returns Transaction
 */
export const CreateTransactionFromPayload = (payload: string): Transaction => {
    const builder = TransactionHelper.loadFromBinary(convert.hexToUint8(payload));
    const deadline = Deadline.createFromDTO((builder.getDeadline().timestamp));
    const maxFee = new UInt64(builder.fee.amount);
    const toBuilder = (): Transaction => {
        const type = builder.getType().valueOf();
        const networkType = builder.getNetwork().valueOf();
        switch (type) {
            case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
                return AccountAddressRestrictionTransaction.createFromBodyBuilder((builder as AccountAddressRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
                return AccountMosaicRestrictionTransaction.createFromBodyBuilder((builder as AccountMosaicRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
                return AccountOperationRestrictionTransaction.createFromBodyBuilder((builder as AccountOperationRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_LINK:
                return AccountLinkTransaction.createFromBodyBuilder((builder as AccountLinkTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ADDRESS_ALIAS:
                return AddressAliasTransaction.createFromBodyBuilder((builder as AddressAliasTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_ALIAS:
                return MosaicAliasTransaction.createFromBodyBuilder((builder as MosaicAliasTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_DEFINITION:
                return MosaicDefinitionTransaction.createFromBodyBuilder((builder as MosaicDefinitionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                return MosaicSupplyChangeTransaction.createFromBodyBuilder((builder as MosaicSupplyChangeTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.NAMESPACE_REGISTRATION:
                return NamespaceRegistrationTransaction.createFromBodyBuilder((builder as NamespaceRegistrationTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.TRANSFER:
                return TransferTransaction.createFromBodyBuilder((builder as TransferTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.SECRET_LOCK:
                return SecretLockTransaction.createFromBodyBuilder((builder as SecretLockTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.SECRET_PROOF:
                return SecretProofTransaction.createFromBodyBuilder((builder as SecretProofTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
                return MultisigAccountModificationTransaction.createFromBodyBuilder((builder as MultisigAccountModificationTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.HASH_LOCK:
                return LockFundsTransaction.createFromBodyBuilder((builder as HashLockTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
                return MosaicGlobalRestrictionTransaction.createFromBodyBuilder((builder as MosaicGlobalRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
                return MosaicAddressRestrictionTransaction.createFromBodyBuilder((builder as MosaicAddressRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_METADATA:
                return AccountMetadataTransaction.createFromBodyBuilder((builder as AccountMetadataTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_METADATA:
                return MosaicMetadataTransaction.createFromBodyBuilder((builder as MosaicMetadataTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.NAMESPACE_METADATA:
                return NamespaceMetadataTransaction.createFromBodyBuilder((builder as NamespaceMetadataTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.AGGREGATE_COMPLETE:
                return AggregateTransaction.createFromBodyBuilder((builder as AggregateCompleteTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.AGGREGATE_BONDED:
                return AggregateTransaction.createFromBodyBuilder((builder as AggregateBondedTransactionBuilder), networkType, deadline, maxFee);
            default:
                throw new Error(`Transaction type ${networkType} not implemented.`);
        }
    };
    return toBuilder();
};

/**
 * @internal
 * @param payload - The transaction binary data from an inner transaction
 * @returns Transaction
 */
export const CreateTransactionFromInnerPayload = (payload: string): Transaction => {
    const builder = EmbeddedTransactionHelper.loadFromBinary(convert.hexToUint8(payload));
    return CreateTransactionFromEmbeddedTransactionBuilder(builder);
};

/**
 * @internal
 * @param builder - The embedded transaction builder builder.
 * @returns Transaction
 */
export const CreateTransactionFromEmbeddedTransactionBuilder = (builder: EmbeddedTransactionBuilder): Transaction => {
    const deadline = Deadline.create();
    const maxFee = new UInt64([0, 0]);
    const networkType = builder.getNetwork().valueOf();
    const signer = PublicAccount.createFromPublicKey(Convert.uint8ToHex(builder.getSignerPublicKey().key), networkType);

    const toBuilder = (): Transaction => {
        const type = builder.getType().valueOf();
        switch (type) {
            case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
                return AccountAddressRestrictionTransaction.createFromBodyBuilder((builder as EmbeddedAccountAddressRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
                return AccountMosaicRestrictionTransaction.createFromBodyBuilder((builder as EmbeddedAccountMosaicRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
                return AccountOperationRestrictionTransaction.createFromBodyBuilder((builder as EmbeddedAccountOperationRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_LINK:
                return AccountLinkTransaction.createFromBodyBuilder((builder as EmbeddedAccountLinkTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ADDRESS_ALIAS:
                return AddressAliasTransaction.createFromBodyBuilder((builder as EmbeddedAddressAliasTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_ALIAS:
                return MosaicAliasTransaction.createFromBodyBuilder((builder as EmbeddedMosaicAliasTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_DEFINITION:
                return MosaicDefinitionTransaction.createFromBodyBuilder((builder as EmbeddedMosaicDefinitionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                return MosaicSupplyChangeTransaction.createFromBodyBuilder((builder as EmbeddedMosaicSupplyChangeTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.NAMESPACE_REGISTRATION:
                return NamespaceRegistrationTransaction.createFromBodyBuilder((builder as EmbeddedNamespaceRegistrationTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.TRANSFER:
                return TransferTransaction.createFromBodyBuilder((builder as EmbeddedTransferTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.SECRET_LOCK:
                return SecretLockTransaction.createFromBodyBuilder((builder as EmbeddedSecretLockTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.SECRET_PROOF:
                return SecretProofTransaction.createFromBodyBuilder((builder as EmbeddedSecretProofTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
                return MultisigAccountModificationTransaction.createFromBodyBuilder((builder as EmbeddedMultisigAccountModificationTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.HASH_LOCK:
                return LockFundsTransaction.createFromBodyBuilder((builder as EmbeddedHashLockTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
                return MosaicGlobalRestrictionTransaction.createFromBodyBuilder((builder as EmbeddedMosaicGlobalRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
                return MosaicAddressRestrictionTransaction.createFromBodyBuilder((builder as EmbeddedMosaicAddressRestrictionTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.ACCOUNT_METADATA:
                return AccountMetadataTransaction.createFromBodyBuilder((builder as EmbeddedAccountMetadataTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.MOSAIC_METADATA:
                return MosaicMetadataTransaction.createFromBodyBuilder((builder as EmbeddedMosaicMetadataTransactionBuilder), networkType, deadline, maxFee);
            case TransactionType.NAMESPACE_METADATA:
                return NamespaceMetadataTransaction.createFromBodyBuilder((builder as EmbeddedNamespaceMetadataTransactionBuilder), networkType, deadline, maxFee);
            default:
                throw new Error(`Transaction type ${networkType} not implemented.`);
        }
    };

    return toBuilder().toAggregate(signer);
};



