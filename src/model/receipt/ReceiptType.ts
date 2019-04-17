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
 * @see https://nemtech.github.io/concepts/receipt.html
 */
export enum ReceiptType {

    /**
     * The recipient, account and amount of fees received for harvesting a block. It is recorded when a block is harvested.
     */
    Harvest_Fee = 0x4321,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid address alias instead of an address.
     */
    Address_Alias_Resolution = 0x43F1,
    /**
     * The unresolved and resolved alias. It is recorded when a transaction indicates a valid mosaic alias instead of a mosaicId.
     */
    Mosaic_Alias_Resolution = 0x43F2,
    /**
     * A collection of state changes for a given source. It is recorded when a state change receipt is issued.
     */
    Transaction_Group = 0x43E1,
    /**
     * The mosaicId expiring in this block. It is recorded when a mosaic expires.
     */
    Mosaic_Expired = 0x4D41,
    /**
     * The sender and recipient of the levied mosaic, the mosaicId and amount. It is recorded when a transaction has a levied mosaic.
     */
    Mosaic_Levy = 0x4D12,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of registering the mosaic.
     * It is recorded when a mosaic is registered.
     */
    Mosaic_Rental_Fee = 0x43E1,
    /**
     * The namespaceId expiring in this block. It is recorded when a namespace expires.
     */
    Namespace_Expired = 0x4E41,
    /**
     * The sender and recipient of the mosaicId and amount representing the cost of extending the namespace.
     * It is recorded when a namespace is registered or its duration is extended.
     */
    Namespace_Rental_Fee = 0x4E12,
    /**
     * The lockhash sender, mosaicId and amount locked. It is recorded when a valid HashLockTransaction is announced.
     */
    LockHash_Created = 0x4831,
    /**
     * The haslock sender, mosaicId and amount locked that is returned.
     * It is recorded when an aggregate bonded transaction linked to the hash completes.
     */
    LockHash_Completed = 0x4822,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a lock hash expires.
     */
    LockHash_Expired = 0x4823,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a valid SecretLockTransaction is announced.
     */
    LockSecret_Created = 0x5231,
    /**
     * The secretlock sender, mosaicId and amount locked. It is recorded when a secretlock is proved.
     */
    LockSecret_Completed = 0x5222,
    /**
     * The account receiving the locked mosaic, the mosaicId and the amount. It is recorded when a secretlock expires
     */
    LockSecret_Expired = 0x5223,

}
