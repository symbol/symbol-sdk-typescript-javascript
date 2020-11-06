/*
 * Copyright 2020 NEM
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

import { Address } from '../../model/account/Address';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { TransactionType } from '../../model/transaction/TransactionType';
import { UInt64 } from '../../model/UInt64';
import { TransactionGroup } from '../TransactionGroup';
import { SearchCriteria } from './SearchCriteria';

/**
 * Defines the params used to search transactions. With this criteria, you can sort and filter
 * transactions queries using rest.
 */
export interface TransactionSearchCriteria extends SearchCriteria {
    /**
     * The group of transaction (confirmed, unconfirmed or partial). Required.
     */
    group: TransactionGroup;
    /**
     * Filter by address involved in the transaction.
     *
     * An account's address is consider to be involved in the transaction when the account is the
     * sender, recipient, or it is required to cosign the transaction.
     *
     * This filter cannot be combined with ''recipientAddress'' and ''signerPublicKey'' query
     * params.  (optional)
     */
    address?: Address;

    /**
     * Address of an account receiving the transaction. (optional)
     */
    recipientAddress?: Address;

    /**
     * Public key of the account signing the entity. (optional)
     */
    signerPublicKey?: string;

    /**
     * Filter by block height. (optional, default to null)
     */
    height?: UInt64;

    /**
     * Filter by transaction type. To filter by multiple transaction type.  (optional, default to
     * new empty array)
     */
    type?: TransactionType[];

    /**
     * When true, the endpoint also returns all the embedded aggregate transactions. When
     * false, only top-level transactions used to calculate the block transactionsHash are
     * returned.  (optional, default to false)
     */
    embedded?: boolean;

    /**
     * Only blocks with height greater or equal than this one are returned.
     */
    fromHeight?: UInt64;

    /**
     * Only blocks with height smaller or equal than this one are returned.
     */
    toHeight?: UInt64;

    /**
     * Filters transactions involving a specific `mosaicId` hex.
     */
    transferMosaicId?: MosaicId;

    /**
     * Requires providing the `transferMosaicId` filter.
     * Only transfer transactions with a transfer amount of the provided mosaic id, greater or equal than this amount are returned.
     */
    fromTransferAmount?: UInt64;

    /**
     * Requires providing the `transferMosaicId` filter. Only transfer transactions with a transfer amount of the provided mosaic id, lesser or equal than this amount are returned.
     */
    toTransferAmount?: UInt64;
}
