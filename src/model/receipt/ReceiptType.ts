/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, type 2.0 (the "License"),
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
 * Receipt type enums.
 *
 * @see https://github.com/nemtech/catapult-server/blob/main/src/catapult/model/ReceiptType.h
 * @see https://github.com/nemtech/catapult-server/blob/main/src/catapult/model/ReceiptType.cpp
 */
export enum ReceiptType {
    /**
     * The recipient, account and amount of fees received for harvesting a block. It is recorded when a block is harvested.
     */
    Harvest_Fee = 0x2143,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid address alias instead of an address.
     */
    Address_Alias_Resolution = 0xf143,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid mosaic alias instead of a mosaicId.
     */
    Mosaic_Alias_Resolution = 0xf243,
    /**
     * A collection of state changes for a given source. It is recorded when a state change receipt is issued.
     */
    Transaction_Group = 0xe143,
    /**
     * The mosaicId expiring in this block. It is recorded when a mosaic expires.
     */
    Mosaic_Expired = 0x414d,
    /**
     * The sender and recipient of the levied mosaic, the mosaicId and amount. It is recorded when a transaction has a levied mosaic.
     */
    Mosaic_Levy = 0x124d,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of registering the mosaic.
     * It is recorded when a mosaic is registered.
     */
    Mosaic_Rental_Fee = 0x124d,
    /**
     * The identifier of the namespace expiring in this block. It is recorded when the namespace lifetime elapses.
     */
    Namespace_Expired = 0x414e,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of extending the namespace.
     * It is recorded when a namespace is registered or its duration is extended.
     */
    Namespace_Rental_Fee = 0x134e,
    /**
     * The identifier of the namespace deleted in this block. It is recorded when the namespace grace period elapses.
     */
    Namespace_Deleted = 0x424e,
    /**
     * The lockhash sender, mosaicId and amount locked. It is recorded when a valid HashLockTransaction is announced.
     */
    LockHash_Created = 0x3148,
    /**
     * The haslock sender, mosaicId and amount locked that is returned.
     * It is recorded when an aggregate bonded transaction linked to the hash completes.
     */
    LockHash_Completed = 0x2248,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a lock hash expires.
     */
    LockHash_Expired = 0x2348,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a valid SecretLockTransaction is announced.
     */
    LockSecret_Created = 0x3152,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a secretlock is proved.
     */
    LockSecret_Completed = 0x2252,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a secretlock expires
     */
    LockSecret_Expired = 0x2352,

    /**
     * The amount of native currency mosaics created. The receipt is recorded when the network has inflation configured,
     * and a new block triggers the creation of currency mosaics.
     */
    Inflation = 0x5143,
}
