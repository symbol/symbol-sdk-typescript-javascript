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


/** Enumeration of entity types. */
export enum EntityTypeDto {
    /** Reserved entity type. */
    RESERVED = 0,
    /** Transfer transaction builder. */
    TRANSFER_TRANSACTION_BUILDER = 16724,
    /** Account link transaction builder. */
    ACCOUNT_LINK_TRANSACTION_BUILDER = 16716,
    /** Hash lock transaction builder. */
    HASH_LOCK_TRANSACTION_BUILDER = 16712,
    /** Secret lock transaction builder. */
    SECRET_LOCK_TRANSACTION_BUILDER = 16722,
    /** Secret proof transaction builder. */
    SECRET_PROOF_TRANSACTION_BUILDER = 16978,
    /** Account metadata transaction builder. */
    ACCOUNT_METADATA_TRANSACTION_BUILDER = 16708,
    /** Mosaic metadata transaction builder. */
    MOSAIC_METADATA_TRANSACTION_BUILDER = 16964,
    /** Namespace metadata transaction builder. */
    NAMESPACE_METADATA_TRANSACTION_BUILDER = 17220,
    /** Mosaic definition transaction builder. */
    MOSAIC_DEFINITION_TRANSACTION_BUILDER = 16717,
    /** Mosaic supply change transaction builder. */
    MOSAIC_SUPPLY_CHANGE_TRANSACTION_BUILDER = 16973,
    /** Multisig account modification transaction builder. */
    MULTISIG_ACCOUNT_MODIFICATION_TRANSACTION_BUILDER = 16725,
    /** Address alias transaction builder. */
    ADDRESS_ALIAS_TRANSACTION_BUILDER = 16974,
    /** Mosaic alias transaction builder. */
    MOSAIC_ALIAS_TRANSACTION_BUILDER = 17230,
    /** Namespace registration transaction builder. */
    NAMESPACE_REGISTRATION_TRANSACTION_BUILDER = 16718,
    /** Account address restriction transaction builder. */
    ACCOUNT_ADDRESS_RESTRICTION_TRANSACTION_BUILDER = 16720,
    /** Account mosaic restriction transaction builder. */
    ACCOUNT_MOSAIC_RESTRICTION_TRANSACTION_BUILDER = 16976,
    /** Account operation restriction transaction builder. */
    ACCOUNT_OPERATION_RESTRICTION_TRANSACTION_BUILDER = 17232,
    /** Mosaic address restriction transaction builder. */
    MOSAIC_ADDRESS_RESTRICTION_TRANSACTION_BUILDER = 16977,
    /** Mosaic global restriction transaction builder. */
    MOSAIC_GLOBAL_RESTRICTION_TRANSACTION_BUILDER = 16721,
    /** Aggregate complete transaction builder. */
    AGGREGATE_COMPLETE_TRANSACTION_BUILDER = 16705,
    /** Aggregate bonded transaction builder. */
    AGGREGATE_BONDED_TRANSACTION_BUILDER = 16961,
}
