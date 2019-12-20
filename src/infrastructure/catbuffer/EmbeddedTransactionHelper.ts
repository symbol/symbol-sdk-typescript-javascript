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

import { EntityTypeDto } from './EntityTypeDto'
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder'
import { GeneratorUtils } from './GeneratorUtils'
import { EmbeddedTransferTransactionBuilder } from './EmbeddedTransferTransactionBuilder'
import { EmbeddedAccountLinkTransactionBuilder } from './EmbeddedAccountLinkTransactionBuilder'
import { EmbeddedHashLockTransactionBuilder } from './EmbeddedHashLockTransactionBuilder'
import { EmbeddedSecretLockTransactionBuilder } from './EmbeddedSecretLockTransactionBuilder'
import { EmbeddedSecretProofTransactionBuilder } from './EmbeddedSecretProofTransactionBuilder'
import { EmbeddedAccountMetadataTransactionBuilder } from './EmbeddedAccountMetadataTransactionBuilder'
import { EmbeddedMosaicMetadataTransactionBuilder } from './EmbeddedMosaicMetadataTransactionBuilder'
import { EmbeddedNamespaceMetadataTransactionBuilder } from './EmbeddedNamespaceMetadataTransactionBuilder'
import { EmbeddedMosaicDefinitionTransactionBuilder } from './EmbeddedMosaicDefinitionTransactionBuilder'
import { EmbeddedMosaicSupplyChangeTransactionBuilder } from './EmbeddedMosaicSupplyChangeTransactionBuilder'
import { EmbeddedMultisigAccountModificationTransactionBuilder } from './EmbeddedMultisigAccountModificationTransactionBuilder'
import { EmbeddedAddressAliasTransactionBuilder } from './EmbeddedAddressAliasTransactionBuilder'
import { EmbeddedMosaicAliasTransactionBuilder } from './EmbeddedMosaicAliasTransactionBuilder'
import { EmbeddedNamespaceRegistrationTransactionBuilder } from './EmbeddedNamespaceRegistrationTransactionBuilder'
import { EmbeddedAccountAddressRestrictionTransactionBuilder } from './EmbeddedAccountAddressRestrictionTransactionBuilder'
import { EmbeddedAccountMosaicRestrictionTransactionBuilder } from './EmbeddedAccountMosaicRestrictionTransactionBuilder'
import { EmbeddedAccountOperationRestrictionTransactionBuilder } from './EmbeddedAccountOperationRestrictionTransactionBuilder'
import { EmbeddedMosaicAddressRestrictionTransactionBuilder } from './EmbeddedMosaicAddressRestrictionTransactionBuilder'
import { EmbeddedMosaicGlobalRestrictionTransactionBuilder } from './EmbeddedMosaicGlobalRestrictionTransactionBuilder'

export class EmbeddedTransactionHelper {

    public static serialize(transaction: EmbeddedTransactionBuilder): Uint8Array {
        let byte: Uint8Array;
        let padding: Uint8Array;
        switch (transaction.type) {
            case EntityTypeDto.TRANSFER_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedTransferTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ACCOUNT_LINK_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAccountLinkTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.HASH_LOCK_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedHashLockTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.SECRET_LOCK_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedSecretLockTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.SECRET_PROOF_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedSecretProofTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ACCOUNT_METADATA_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAccountMetadataTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_METADATA_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicMetadataTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.NAMESPACE_METADATA_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedNamespaceMetadataTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_DEFINITION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicDefinitionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_SUPPLY_CHANGE_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicSupplyChangeTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MULTISIG_ACCOUNT_MODIFICATION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMultisigAccountModificationTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ADDRESS_ALIAS_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAddressAliasTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_ALIAS_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicAliasTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.NAMESPACE_REGISTRATION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedNamespaceRegistrationTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ACCOUNT_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAccountAddressRestrictionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ACCOUNT_MOSAIC_RESTRICTION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAccountMosaicRestrictionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.ACCOUNT_OPERATION_RESTRICTION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedAccountOperationRestrictionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicAddressRestrictionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            case EntityTypeDto.MOSAIC_GLOBAL_RESTRICTION_TRANSACTION_BUILDER:
                byte = (transaction as EmbeddedMosaicGlobalRestrictionTransactionBuilder).serialize();
                padding = new Uint8Array(GeneratorUtils.getTransactionPaddingSize(byte.length, 8));
                return GeneratorUtils.concatTypedArrays(byte, padding);
            default:
                throw new Error(`Transaction type: ${transaction.type} not recognized.`)
        }
    }

    public static loadFromBinary(bytes: Uint8Array):EmbeddedTransactionBuilder {
        const header = EmbeddedTransactionBuilder.loadFromBinary(bytes);
        switch (header.getType()) {
            case EntityTypeDto.TRANSFER_TRANSACTION_BUILDER:
                return EmbeddedTransferTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ACCOUNT_LINK_TRANSACTION_BUILDER:
                return EmbeddedAccountLinkTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.HASH_LOCK_TRANSACTION_BUILDER:
                return EmbeddedHashLockTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.SECRET_LOCK_TRANSACTION_BUILDER:
                return EmbeddedSecretLockTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.SECRET_PROOF_TRANSACTION_BUILDER:
                return EmbeddedSecretProofTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ACCOUNT_METADATA_TRANSACTION_BUILDER:
                return EmbeddedAccountMetadataTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_METADATA_TRANSACTION_BUILDER:
                return EmbeddedMosaicMetadataTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.NAMESPACE_METADATA_TRANSACTION_BUILDER:
                return EmbeddedNamespaceMetadataTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_DEFINITION_TRANSACTION_BUILDER:
                return EmbeddedMosaicDefinitionTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_SUPPLY_CHANGE_TRANSACTION_BUILDER:
                return EmbeddedMosaicSupplyChangeTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MULTISIG_ACCOUNT_MODIFICATION_TRANSACTION_BUILDER:
                return EmbeddedMultisigAccountModificationTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ADDRESS_ALIAS_TRANSACTION_BUILDER:
                return EmbeddedAddressAliasTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_ALIAS_TRANSACTION_BUILDER:
                return EmbeddedMosaicAliasTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.NAMESPACE_REGISTRATION_TRANSACTION_BUILDER:
                return EmbeddedNamespaceRegistrationTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ACCOUNT_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountAddressRestrictionTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ACCOUNT_MOSAIC_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountMosaicRestrictionTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.ACCOUNT_OPERATION_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedAccountOperationRestrictionTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_ADDRESS_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedMosaicAddressRestrictionTransactionBuilder.loadFromBinary(bytes)
            case EntityTypeDto.MOSAIC_GLOBAL_RESTRICTION_TRANSACTION_BUILDER:
                return EmbeddedMosaicGlobalRestrictionTransactionBuilder.loadFromBinary(bytes)
            default:
                throw new Error(`Transaction type: ${header.getType()} not recognized.`)
        }
    }

    public static getEmbeddedTransactionSize(transactions: EmbeddedTransactionBuilder[]): number {
        return transactions.map((o) => EmbeddedTransactionHelper.serialize(o).length).reduce((a, b) => a + b, 0);
    }
}
