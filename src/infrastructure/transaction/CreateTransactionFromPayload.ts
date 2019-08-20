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

import { SignSchema } from '../../core/crypto';
import { Convert as convert } from '../../core/format';
import { InnerTransaction } from '../../model/model';
import { AccountAddressRestrictionTransaction } from '../../model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { AccountMosaicRestrictionTransaction } from '../../model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../model/transaction/AccountOperationRestrictionTransaction';
import { AddressAliasTransaction } from '../../model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { LockFundsTransaction } from '../../model/transaction/LockFundsTransaction';
import { ModifyMultisigAccountTransaction } from '../../model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAddressRestrictionTransaction } from '../../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import { MosaicSupplyChangeTransaction } from '../../model/transaction/MosaicSupplyChangeTransaction';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetaDataTransaction';
import { RegisterNamespaceTransaction } from '../../model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../model/transaction/SecretProofTransaction';
import { Transaction } from '../../model/transaction/Transaction';
import { TransactionType } from '../../model/transaction/TransactionType';
import { TransferTransaction } from '../../model/transaction/TransferTransaction';
import { EmbeddedTransactionBuilder } from '../catbuffer/EmbeddedTransactionBuilder';
import { TransactionBuilder } from '../catbuffer/TransactionBuilder';

/**
 * @internal
 * @param payload - The transaction binary data
 * @param isEmbedded - Is the transaction an embedded inner transaction
 * @param signSchema - The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
 * @returns {Transaction | InnerTransaction}
 * @constructor
 */
export const CreateTransactionFromPayload = (payload: string,
                                             isEmbedded = false,
                                             signSchema = SignSchema.SHA3): Transaction | InnerTransaction => {
    const transactionBuilder = isEmbedded ? EmbeddedTransactionBuilder.loadFromBinary(convert.hexToUint8(payload)) :
        TransactionBuilder.loadFromBinary(convert.hexToUint8(payload));
    const type = transactionBuilder.getType().valueOf();
    switch (type) {
        case TransactionType.ACCOUNT_RESTRICTION_ADDRESS:
        case TransactionType.ACCOUNT_RESTRICTION_OPERATION:
        case TransactionType.ACCOUNT_RESTRICTION_MOSAIC:
            switch (type) {
                case TransactionType.ACCOUNT_RESTRICTION_ADDRESS:
                    return AccountAddressRestrictionTransaction.createFromPayload(payload, isEmbedded, signSchema);
                case TransactionType.ACCOUNT_RESTRICTION_MOSAIC:
                    return AccountMosaicRestrictionTransaction.createFromPayload(payload, isEmbedded, signSchema);
                case TransactionType.ACCOUNT_RESTRICTION_OPERATION:
                    return AccountOperationRestrictionTransaction.createFromPayload(payload, isEmbedded, signSchema);
            }
            throw new Error ('Account restriction transaction type not recognised.');
        case TransactionType.LINK_ACCOUNT:
            return AccountLinkTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.ADDRESS_ALIAS:
            return AddressAliasTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_ALIAS:
            return MosaicAliasTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_DEFINITION:
            return MosaicDefinitionTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            return MosaicSupplyChangeTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.REGISTER_NAMESPACE:
            return RegisterNamespaceTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.TRANSFER:
            return TransferTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.SECRET_LOCK:
            return SecretLockTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.SECRET_PROOF:
            return SecretProofTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            return ModifyMultisigAccountTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.LOCK:
            return LockFundsTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
            return MosaicGlobalRestrictionTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            return MosaicAddressRestrictionTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.ACCOUNT_METADATA_TRANSACTION:
            return AccountMetadataTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.MOSAIC_METADATA_TRANSACTION:
            return MosaicMetadataTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.NAMESPACE_METADATA_TRANSACTION:
            return NamespaceMetadataTransaction.createFromPayload(payload, isEmbedded, signSchema);
        case TransactionType.AGGREGATE_COMPLETE:
        case TransactionType.AGGREGATE_BONDED:
            return AggregateTransaction.createFromPayload(payload, signSchema);
        default:
            throw new Error ('Transaction type not implemented yet.');
        }
};
