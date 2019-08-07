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
     * Transfer Transaction transaction type.
     * @type {number}
     */
    TRANSFER = 0x4154,

    /**
     * Register namespace transaction type.
     * @type {number}
     */
    REGISTER_NAMESPACE = 0x414E,

    /**
     * Address alias transaction type
     * @type {number}
     */
    ADDRESS_ALIAS = 0x424E,

    /**
     * Mosaic alias transaction type
     * @type {number}
     */
    MOSAIC_ALIAS = 0x434E,

    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    MOSAIC_DEFINITION = 0x414D,

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    MOSAIC_SUPPLY_CHANGE = 0x424D,

    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    MODIFY_MULTISIG_ACCOUNT = 0x4155,

    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    AGGREGATE_COMPLETE = 0x4141,

    /**
     * Aggregate bonded transaction type
     */
    AGGREGATE_BONDED = 0x4241,

    /**
     * Lock transaction type
     * @type {number}
     */
    LOCK = 0x4148,

    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    SECRET_LOCK = 0x4152,

    /**
     * Secret Proof transaction type
     * @type {number}
     */
    SECRET_PROOF = 0x4252,

    /**
     * Account restriction address transaction type
     * @type {number}
     */
    ACCOUNT_RESTRICTION_ADDRESS = 0x4150,

    /**
     * Account restriction mosaic transaction type
     * @type {number}
     */
    ACCOUNT_RESTRICTION_MOSAIC = 0x4250,

    /**
     * Account restriction operation transaction type
     * @type {number}
     */
   ACCOUNT_RESTRICTION_OPERATION = 0x4350,

    /**
     * Link account transaction type
     * @type {number}
     */
    LINK_ACCOUNT = 0x414C,

    /**
     * Mosaic address restriction type
     * @type {number}
     */
    MOSAIC_ADDRESS_RESTRICTION = 0x4251,

    /**
     * Mosaic global restriction type
     * @type {number}
     */
    MOSAIC_GLOBAL_RESTRICTION = 0x4151,
}
