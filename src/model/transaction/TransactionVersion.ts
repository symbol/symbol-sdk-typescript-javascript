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
 * @see https://github.com/nemtech/catapult-server/blob/master/plugins/txes/transfer/src/model/TransferTransaction.h#L37
 */
export class TransactionVersion {

    /**
     * Transfer Transaction transaction version.
     * @type {number}
     */
    public static readonly TRANSFER = 0x01;

    /**
     * Register namespace transaction version.
     * @type {number}
     */
    public static readonly NAMESPACE_REGISTRATION = 0x01;

    /**
     * Mosaic definition transaction version.
     * @type {number}
     */
    public static readonly MOSAIC_DEFINITION = 0x01;

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    public static readonly MOSAIC_SUPPLY_CHANGE = 0x01;

    /**
     * Modify multisig account transaction version.
     * @type {number}
     */
    public static readonly MULTISIG_ACCOUNT_MODIFICATION = 0x01;

    /**
     * Aggregate complete transaction version.
     * @type {number}
     */
    public static readonly AGGREGATE_COMPLETE = 0x01;

    /**
     * Aggregate bonded transaction version
     */
    public static readonly AGGREGATE_BONDED = 0x01;

    /**
     * Lock transaction version
     * @type {number}
     */
    public static readonly HASH_LOCK = 0x01;

    /**
     * Secret Lock transaction version
     * @type {number}
     */
    public static readonly SECRET_LOCK = 0x01;

    /**
     * Secret Proof transaction version
     * @type {number}
     */
    public static readonly SECRET_PROOF = 0x01;

    /**
     * Address Alias transaction version
     * @type {number}
     */
    public static readonly ADDRESS_ALIAS = 0x01;

    /**
     * Mosaic Alias transaction version
     * @type {number}
     */
    public static readonly MOSAIC_ALIAS = 0x01;

    /**
     * Mosaic global restriction transaction version
     * @type {number}
     */
    public static readonly MOSAIC_GLOBAL_RESTRICTION = 0x01;

    /**
     * Mosaic address restriction transaction version
     * @type {number}
     */
    public static readonly MOSAIC_ADDRESS_RESTRICTION = 0x01;

    /**
     * Account Restriction address transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_ADDRESS_RESTRICTION = 0x01;

    /**
     * Account Restriction mosaic transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_MOSAIC_RESTRICTION = 0x01;

    /**
     * Account Restriction operation transaction version
     * @type {number}
     */
    public static readonly MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE = 0x01;

    /**
     * Link account transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_LINK = 0x01;

    /**
     * Account metadata transaction version
     * @type {number}
     */
    public static readonly ACCOUNT_METADATA = 0x01;

    /**
     * Mosaic metadata transaction version
     * @type {number}
     */
    public static readonly MOSAIC_METADATA = 0x01;

    /**
     * Namespace metadata transaction version
     * @type {number}
     */
    public static readonly NAMESPACE_METADATA = 0x01;
}
