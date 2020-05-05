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

import { SearchCriteria } from './SearchCriteria';
import { Address } from '../model/account/Address';
import { UInt64 } from '../model/UInt64';
import { TransactionType } from '../model/transaction/TransactionType';
import { TransactionGroupSubsetEnum } from 'symbol-openapi-typescript-node-client/dist/model/transactionGroupSubsetEnum';

/**
 * Defines the params used to search transactions. With this criteria, you can sort and filter
 * transactions queries using rest.
 */
export class TransactionSearchCriteria extends SearchCriteria {
    /**
     * Transaction identifier up to which transactions are returned. (optional)
     */
    id?: string;

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
     * Entry id at which to start pagination. If the ordering parameter is set to -id, the elements
     * returned precede the identifier. Otherwise, newer elements with respect to the id are
     * returned.  (optional)
     */
    offset?: string;

    /**
     * The group of transaction (optional, default is confirmed)
     */
    group?: TransactionGroupSubsetEnum;

    /**
     * Filter by transaction type. To filter by multiple transaction type.  (optional, default to
     * new empty array)
     */
    transactionTypes?: TransactionType[];

    /**
     * When true, the endpoint also returns all the embedded aggregate transactions. When
     * false, only top-level transactions used to calculate the block transactionsHash are
     * returned.  (optional, default to false)
     */
    embedded?: boolean;
}
