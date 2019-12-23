// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/

import { EmbeddedAccountAddressRestrictionTransactionBuilder } from './EmbeddedAccountAddressRestrictionTransactionBuilder';
import { EmbeddedAccountLinkTransactionBuilder } from './EmbeddedAccountLinkTransactionBuilder';
import { EmbeddedAccountMetadataTransactionBuilder } from './EmbeddedAccountMetadataTransactionBuilder';
import { EmbeddedAccountMosaicRestrictionTransactionBuilder } from './EmbeddedAccountMosaicRestrictionTransactionBuilder';
import { EmbeddedAccountOperationRestrictionTransactionBuilder } from './EmbeddedAccountOperationRestrictionTransactionBuilder';
import { EmbeddedAddressAliasTransactionBuilder } from './EmbeddedAddressAliasTransactionBuilder';
import { EmbeddedHashLockTransactionBuilder } from './EmbeddedHashLockTransactionBuilder';
import { EmbeddedMosaicAddressRestrictionTransactionBuilder } from './EmbeddedMosaicAddressRestrictionTransactionBuilder';
import { EmbeddedMosaicAliasTransactionBuilder } from './EmbeddedMosaicAliasTransactionBuilder';
import { EmbeddedMosaicDefinitionTransactionBuilder } from './EmbeddedMosaicDefinitionTransactionBuilder';
import { EmbeddedMosaicGlobalRestrictionTransactionBuilder } from './EmbeddedMosaicGlobalRestrictionTransactionBuilder';
import { EmbeddedMosaicMetadataTransactionBuilder } from './EmbeddedMosaicMetadataTransactionBuilder';
import { EmbeddedMosaicSupplyChangeTransactionBuilder } from './EmbeddedMosaicSupplyChangeTransactionBuilder';
import { EmbeddedMultisigAccountModificationTransactionBuilder } from './EmbeddedMultisigAccountModificationTransactionBuilder';
import { EmbeddedNamespaceMetadataTransactionBuilder } from './EmbeddedNamespaceMetadataTransactionBuilder';
import { EmbeddedNamespaceRegistrationTransactionBuilder } from './EmbeddedNamespaceRegistrationTransactionBuilder';
import { EmbeddedSecretLockTransactionBuilder } from './EmbeddedSecretLockTransactionBuilder';
import { EmbeddedSecretProofTransactionBuilder } from './EmbeddedSecretProofTransactionBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EmbeddedTransferTransactionBuilder } from './EmbeddedTransferTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';

export class EmbeddedTransactionHelper {

    public static serialize(transaction: EmbeddedTransactionBuilder): Uint8Array {
        const byte = transaction.serialize();
        const padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
        return GeneratorUtils.concatTypedArrays(byte, padding);
    }

    public static loadFromBinary(bytes: Uint8Array): EmbeddedTransactionBuilder {
        const header = EmbeddedTransactionBuilder.loadFromBinary(bytes);
        switch (header.getType()) {
            case EntityTypeDto.TRANSFER_TRANSACTION_BUILDER:
                return EmbeddedTransferTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ACCOUNT_LINK_TRANSACTION_BUILDER:
                return EmbeddedAccountLinkTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.HASH_LOCK_TRANSACTION_BUILDER:
                return EmbeddedHashLockTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.SECRET_LOCK_TRANSACTION_BUILDER:
                return EmbeddedSecretLockTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.SECRET_PROOF_TRANSACTION_BUILDER:
                return EmbeddedSecretProofTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ACCOUNT_METADATA_TRANSACTION_BUILDER:
                return EmbeddedAccountMetadataTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_METADATA_TRANSACTION_BUILDER:
                return EmbeddedMosaicMetadataTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.NAMESPACE_METADATA_TRANSACTION_BUILDER:
                return EmbeddedNamespaceMetadataTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_DEFINITION_TRANSACTION_BUILDER:
                return EmbeddedMosaicDefinitionTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_SUPPLY_CHANGE_TRANSACTION_BUILDER:
                return EmbeddedMosaicSupplyChangeTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MULTISIG_ACCOUNT_MODIFICATION_TRANSACTION_BUILDER:
                return EmbeddedMultisigAccountModificationTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ADDRESS_ALIAS_TRANSACTION_BUILDER:
                return EmbeddedAddressAliasTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_ALIAS_TRANSACTION_BUILDER:
                return EmbeddedMosaicAliasTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.NAMESPACE_REGISTRATION_TRANSACTION_BUILDER:
                return EmbeddedNamespaceRegistrationTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ACCOUNT_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountAddressRestrictionTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ACCOUNT_MOSAIC_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountMosaicRestrictionTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.ACCOUNT_OPERATION_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountOperationRestrictionTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedMosaicAddressRestrictionTransactionBuilder.loadFromBinary(bytes);
            case EntityTypeDto.MOSAIC_GLOBAL_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedMosaicGlobalRestrictionTransactionBuilder.loadFromBinary(bytes);
            default:
                throw new Error(`Transaction type: ${header.getType()} not recognized.`);
        }
    }

    public static getEmbeddedTransactionSize(transactions: EmbeddedTransactionBuilder[]): number {
        return transactions.map((o) => EmbeddedTransactionHelper.serialize(o).length).reduce((a, b) => a + b, 0);
    }
}
