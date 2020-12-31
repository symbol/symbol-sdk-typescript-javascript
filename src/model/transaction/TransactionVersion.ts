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

/**
 * Static class containing transaction version constants.
 *
 * Transaction format versions are defined in catapult-server in
 * each transaction's plugin source code.
 *
 * In [catapult-server](https://github.com/nemtech/catapult-server), the `DEFINE_TRANSACTION_CONSTANTS` macro
 * is used to define the `TYPE` and `VERSION` of the transaction format.
 *
 * @see https://github.com/nemtech/catapult-server/blob/main/plugins/txes/transfer/src/model/TransferTransaction.h#L37
 */
export class TransactionVersion {
    /**
     * Transfer Transaction transaction version.
     * @type {number}
     */
    public static readonly TRANSFER = 1;

    /**
     * Register namespace transaction version.
     * @type {number}
     */
    public static readonly NAMESPACE_REGISTRATION = 1;

    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    public static readonly MOSAIC_DEFINITION = 1;

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    public static readonly MOSAIC_SUPPLY_CHANGE = 1;

    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    public static readonly MULTISIG_ACCOUNT_MODIFICATION = 1;

    /**
     * Aggregate complete transaction version.
     * @type {number}
     */
    public static readonly AGGREGATE_COMPLETE = 1;

    /**
     * Aggregate bonded transaction version
     */
    public static readonly AGGREGATE_BONDED = 1;

    /**
     * Lock transaction version
     * @type {number}
     */
    public static readonly HASH_LOCK = 1;

    /**
     * Secret Lock transaction version
     * @type {number}
     */
    public static readonly SECRET_LOCK = 1;

    /**
     * Secret Proof transaction version
     * @type {number}
     */
    public static readonly SECRET_PROOF = 1;

    /**
     * Address Alias transaction version
     * @type {number}
     */
    public static readonly ADDRESS_ALIAS = 1;

    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    public static readonly MOSAIC_ALIAS = 1;

    /**
     * Mosaic global restriction transaction version
     * @type {number}
     */
    public static readonly MOSAIC_GLOBAL_RESTRICTION = 1;

    /**
     * Mosaic address restriction transaction version
     * @type {number}
     */
    public static readonly MOSAIC_ADDRESS_RESTRICTION = 1;

    /**
     * Account Restriction address transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_ADDRESS_RESTRICTION = 1;

    /**
     * Account Restriction mosaic transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_MOSAIC_RESTRICTION = 1;

    /**
     * Account Restriction operation transaction version
     * @type {number}
     */
    public static readonly MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE = 1;

    /**
     * Link account transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_KEY_LINK = 1;

    /**
     * Account metadata transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_METADATA = 1;

    /**
     * Mosaic metadata transaction version
     * @type {number}
     */
    public static readonly MOSAIC_METADATA = 1;

    /**
     * Namespace metadata transaction version
     * @type {number}
     */
    public static readonly NAMESPACE_METADATA = 1;

    /**
     * Vrf key link transaction version.
     * @type {number}
     */
    public static readonly VRF_KEY_LINK = 1;

    /**
     * Voting key link transaction version.
     * @type {number}
     */
    public static readonly VOTING_KEY_LINK = 1;

    /**
     * Node key link transaction version.
     * @type {number}
     */
    public static readonly NODE_KEY_LINK = 1;
}
