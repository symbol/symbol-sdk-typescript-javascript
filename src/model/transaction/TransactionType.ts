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
 * Static class containing transaction type constants.
 */
export class TransactionType {

    /**
     * Transfer Transaction transaction type.
     * @type {number}
     */
    public static readonly TRANSFER = 0x4154;

    /**
     * Register namespace transaction type.
     * @type {number}
     */
    public static readonly REGISTER_NAMESPACE = 0x414e;

    /**
     * Mosaic definition transaction type.
     * @type {number}
     */
    public static readonly MOSAIC_DEFINITION = 0x414d;

    /**
     * Mosaic supply change transaction.
     * @type {number}
     */
    public static readonly MOSAIC_SUPPLY_CHANGE = 0x424d;

    /**
     * Modify multisig account transaction type.
     * @type {number}
     */
    public static readonly MODIFY_MULTISIG_ACCOUNT = 0x4155;

    /**
     * Aggregate complete transaction type.
     * @type {number}
     */
    public static readonly AGGREGATE_COMPLETE = 0x4141;

    /**
     * Aggregate bonded transaction type
     */
    public static readonly AGGREGATE_BONDED = 0x4241;

    /**
     * Lock transaction type
     * @type {number}
     */
    public static readonly LOCK = 0x414C;

    /**
     * Secret Lock Transaction type
     * @type {number}
     */
    public static readonly SECRET_LOCK = 0x424C;

    /**
     * Secret Proof transaction type
     * @type {number}
     */
    public static readonly SECRET_PROOF = 0x434C;
}
