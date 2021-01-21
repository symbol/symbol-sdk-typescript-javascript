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
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { ReceiptType } from '../../model/receipt/ReceiptType';
import { UInt64 } from '../../model/UInt64';
import { SearchCriteria } from './SearchCriteria';

/**
 * Defines the params used to search transaction statement receipts. With this criteria, you can sort and filter
 * receipt queries using rest.
 */
export interface TransactionStatementSearchCriteria extends SearchCriteria {
    /**
     * Block height. (optional)
     */
    height?: UInt64;

    /**
     * From block height. (optional)
     */
    fromHeight?: UInt64;

    /**
     * To block height. (optional)
     */
    toHeight?: UInt64;

    /**
     * receipt types. (optional, TransactionStatement only)
     */
    receiptTypes?: ReceiptType[];

    /**
     * Recipient address. (optional, TransactionStatement only)
     */
    recipientAddress?: Address;

    /**
     * Sender address. (optional, TransactionStatement only)
     */
    senderAddress?: Address;

    /**
     * Target address. (optional, TransactionStatement only)
     */
    targetAddress?: Address;

    /**
     * Artifact id. (optional, TransactionStatement only)
     */
    artifactId?: MosaicId | NamespaceId;
}
