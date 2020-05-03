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
import { TransactionTypeEnum } from 'symbol-openapi-typescript-node-client/dist/model/transactionTypeEnum';
import { Order } from 'symbol-openapi-typescript-node-client';

/**
 * Defines the params used to search transactions. With this criteria, you can sort and filter
 * transactions queries using rest.
 */
export class TransactionSearchCriteria extends SearchCriteria {
    /**
     * Transaction identifier up to which transactions are returned. (optional)
     */
    private id?: string;

    /**
     * Filter by address involved in the transaction.
     *
     * An account's address is consider to be involved in the transaction when the account is the
     * sender, recipient, or it is required to cosign the transaction.
     *
     * This filter cannot be combined with ''recipientAddress'' and ''signerPublicKey'' query
     * params.  (optional)
     */
    private address?: Address;

    /**
     * Address of an account receiving the transaction. (optional)
     */
    private recipientAddress?: Address;

    /**
     * Public key of the account signing the entity. (optional)
     */
    private signerPublicKey?: string;

    /**
     * Filter by block height. (optional, default to null)
     */
    private height?: UInt64;

    /**
     * Entry id at which to start pagination. If the ordering parameter is set to -id, the elements
     * returned precede the identifier. Otherwise, newer elements with respect to the id are
     * returned.  (optional)
     */
    private offset?: string;

    /**
     * The group of transaction (optional, default is confirmed)
     */
    private group?: TransactionGroupSubsetEnum;

    /**
     * Filter by transaction type. To filter by multiple transaction type.  (optional, default to
     * new empty array)
     */
    private transactionTypes?: TransactionType[];

    /**
     * When true, the endpoint also returns all the embedded aggregate transactions. When
     * false, only top-level transactions used to calculate the block transactionsHash are
     * returned.  (optional, default to false)
     */
    private embedded: boolean;

    public getId(): string | undefined {
        return this.id;
    }

    public getAddress(): string | undefined {
        return this.address?.plain();
    }

    public getRecipientAddress(): string | undefined {
        return this.recipientAddress?.plain();
    }

    public getSignerPublicKey(): string | undefined {
        return this.signerPublicKey;
    }

    public getHeight(): string | undefined {
        return this.height?.toString();
    }

    public getOffset(): string | undefined {
        return this.offset;
    }

    public getGroup(): TransactionGroupSubsetEnum | undefined {
        return this.group;
    }

    public getTransactionTypes(): TransactionTypeEnum[] | undefined {
        return this.transactionTypes?.map((type) => type.valueOf());
    }

    public getEmbedded(): boolean {
        return this.embedded;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setAddress(address: Address): void {
        this.address = address;
    }

    public setRecipientAddress(recipientAddress: Address): void {
        this.recipientAddress = recipientAddress;
    }

    public setSignerPublicKey(signerPublicKey: string): void {
        this.signerPublicKey = signerPublicKey;
    }

    public setHeight(height: UInt64): void {
        this.height = height;
    }

    public setOffset(offset: string): void {
        this.offset = offset;
    }

    public setGroup(group: TransactionGroupSubsetEnum): void {
        this.group = group;
    }

    public setTransactionTypes(transactionTypes: TransactionType[]): void {
        this.transactionTypes = transactionTypes;
    }

    public setEmbedded(embedded: boolean): void {
        this.embedded = embedded;
    }

    public buildId(id: string): TransactionSearchCriteria {
        this.id = id;
        return this;
    }

    public buildTransactionTypes(transactionTypes: TransactionType[]): TransactionSearchCriteria {
        this.transactionTypes = transactionTypes;
        return this;
    }

    public buildAddress(address: Address): TransactionSearchCriteria {
        this.address = address;
        return this;
    }

    public buildRecipientAddress(recipientAddress: Address): TransactionSearchCriteria {
        this.recipientAddress = recipientAddress;
        return this;
    }

    public buildSignerPublicKey(signerPublicKey: string): TransactionSearchCriteria {
        this.signerPublicKey = signerPublicKey;
        return this;
    }

    public buildHeight(height: UInt64): TransactionSearchCriteria {
        this.height = height;
        return this;
    }

    public buildOffset(offset: string): TransactionSearchCriteria {
        this.offset = offset;
        return this;
    }

    public buildGroup(group: TransactionGroupSubsetEnum): TransactionSearchCriteria {
        this.group = group;
        return this;
    }

    public buildEmbedded(embedded: boolean): TransactionSearchCriteria {
        this.embedded = embedded;
        return this;
    }

    public buildOrder(order: Order): TransactionSearchCriteria {
        super.setOrder(order);
        return this;
    }

    public buildPageSize(pageSize: number): TransactionSearchCriteria {
        super.setPageSize(pageSize);
        return this;
    }

    public buildPageNumber(pageNumber: number): TransactionSearchCriteria {
        super.setPageNumber(pageNumber);
        return this;
    }
}
