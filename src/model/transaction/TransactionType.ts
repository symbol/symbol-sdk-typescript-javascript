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
    TRANSFER = 16724,

    /**
     * Register namespace transaction type.
     * @type {number}
     */
    NAMESPACE_REGISTRATION = 16718,

    /**
     * Address alias transaction type
     * @type {number}
     */
    ADDRESS_ALIAS = 16974,

    /**
     * Mosaic alias transaction type
     * @type {number}
     */
    MOSAIC_ALIAS = 17230,

    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    MOSAIC_DEFINITION = 16717,

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    MOSAIC_SUPPLY_CHANGE = 16973,

    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    MULTISIG_ACCOUNT_MODIFICATION = 16725,

    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    AGGREGATE_COMPLETE = 16705,

    /**
     * Aggregate bonded transaction type
     */
    AGGREGATE_BONDED = 16961,

    /**
     * Lock transaction type
     * @type {number}
     */
    HASH_LOCK = 16712,

    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    SECRET_LOCK = 16722,

    /**
     * Secret Proof transaction type
     * @type {number}
     */
    SECRET_PROOF = 16978,

    /**
     * Account restriction address transaction type
     * @type {number}
     */
    ACCOUNT_ADDRESS_RESTRICTION = 16720,

    /**
     * Account restriction mosaic transaction type
     * @type {number}
     */
    ACCOUNT_MOSAIC_RESTRICTION = 16976,

    /**
     * Account restriction operation transaction type
     * @type {number}
     */
    ACCOUNT_OPERATION_RESTRICTION = 17232,

    /**
     * Link account transaction type
     * @type {number}
     */
    ACCOUNT_KEY_LINK = 16716,

    /**
     * Mosaic address restriction type
     * @type {number}
     */
    MOSAIC_ADDRESS_RESTRICTION = 16977,

    /**
     * Mosaic global restriction type
     * @type {number}
     */
    MOSAIC_GLOBAL_RESTRICTION = 16721,

    /**
     * Account metadata transaction
     * @type {number}
     */
    ACCOUNT_METADATA = 16708,

    /**
     * Mosaic metadata transaction
     * @type {number}
     */
    MOSAIC_METADATA = 16964,

    /**
     * Namespace metadata transaction
     * @type {number}
     */
    NAMESPACE_METADATA = 17220,

    /**
     * Link vrf key transaction
     * @type {number}
     */
    VRF_KEY_LINK = 16963,

    /**
     * Link voting key transaction
     * @type {number}
     */
    VOTING_KEY_LINK = 16707,

    /**
     * Link node key transaction
     * @type {number}
     */
    NODE_KEY_LINK = 16972,
}
