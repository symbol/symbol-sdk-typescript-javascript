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
    /**
     * Account address restriction transaction.
     */
    ACCOUNT_ADDRESS_RESTRICTION_TRANSACTION = 0x4150,
    /**
     * Account mosaic restriction transaction.
     */
    ACCOUNT_MOSAIC_RESTRICTION_TRANSACTION = 0x4250,
    /**
     * Account operation restriction transaction.
     */
    ACCOUNT_OPERATION_RESTRICTION_TRANSACTION = 0x4350,
    /**
     * Account link transaction.
     */
    ACCOUNT_LINK_TRANSACTION = 0x414C,
    /**
     * Address alias transaction.
     */
    ADDRESS_ALIAS_TRANSACTION = 0x424E,
    /**
     * Aggregate bonded transaction.
     */
    AGGREGATE_BONDED_TRANSACTION = 0x4241,
    /**
     * Aggregate complete transaction.
     */
    AGGREGATE_COMPLETE_TRANSACTION = 0x4141,
    /**
     * Hash lock transaction.
     */
    HASH_LOCK_TRANSACTION = 0x4148,
    /**
     * Modify multisig account transaction.
     */
    MODIFY_MULTISIG_ACCOUNT_TRANSACTION = 0x4155,
    /**
     * Mosaic definition transaction.
     */
    MOSAIC_DEFINITION_TRANSACTION = 0x414D,
    /**
     * Mosaic supply change transaction.
     */
    MOSAIC_SUPPLY_CHANGE_TRANSACTION = 0x424D,
    /**
     * Mosaic alias transaction.
     */
    MOSAIC_ALIAS_TRANSACTION = 0x434E,
    /**
     * Register namespace transaction.
     */
    REGISTER_NAMESPACE_TRANSACTION = 0x414E,
    /**
     * Secret lock transaction.
     */
    SECRET_LOCK_TRANSACTION = 0x4152,
    /**
     * Secret Proof transaction.
     */
    SECRET_PROOF_TRANSACTION = 0x4252,
    /**
     * Transfer transaction.
     */
    TRANSFER_TRANSACTION = 0x4154,
}
