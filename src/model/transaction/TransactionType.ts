/*
 * Copyright 2018 NEM
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

/**
 * Enum containing transaction type constants.
 */
export enum TransactionType {

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
    NAMESPACE_REGISTRATION = 0x414E,

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
    MULTISIG_ACCOUNT_MODIFICATION = 0x4155,

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
    HASH_LOCK = 0x4148,

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
    ACCOUNT_ADDRESS_RESTRICTION = 0x4150,

    /**
     * Account restriction mosaic transaction type
     * @type {number}
     */
    ACCOUNT_MOSAIC_RESTRICTION = 0x4250,

    /**
     * Account restriction operation transaction type
     * @type {number}
     */
    ACCOUNT_OPERATION_RESTRICTION = 0x4350,

    /**
     * Link account transaction type
     * @type {number}
     */
    ACCOUNT_LINK = 0x414C,

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

    /**
     * Account metadata transaction
     * @type {number}
     */
    ACCOUNT_METADATA = 0x4144,

    /**
     * Mosaic metadata transaction
     * @type {number}
     */
    MOSAIC_METADATA = 0x4244,

    /**
     * Namespace metadata transaction
     * @type {number}
     */
    NAMESPACE_METADATA = 0x4344,
}
