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

import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { ResolutionStatement } from './ResolutionStatement';
import { ResolutionType } from './ResolutionType';
import { TransactionStatement } from './TransactionStatement';

export class Statement {

    /**
     * Receipt - transaction statement object
     * @param transactionStatements - The transaction statements.
     * @param addressResolutionStatements - The address resolution statements.
     * @param mosaicResolutionStatements - The mosaic resolution statements.
     */
    constructor(
                /**
                 * The transaction statements.
                 */
                public readonly transactionStatements: TransactionStatement[],
                /**
                 * The address resolution statements.
                 */
                public readonly addressResolutionStatements: ResolutionStatement[],
                /**
                 * The mosaic resolution statements.
                 */
                public readonly mosaicResolutionStatements: ResolutionStatement[]) {
    }

    /**
     * @internal
     * Extract resolved address | mosaic from block receipt
     * @param resolutionType Resolution type: Address / Mosaic
     * @param unresolved Unresolved address / mosaicId
     * @param transactionIndex Transaction index
     * @param height Transaction height
     * @param aggregateTransactionIndex Transaction index for aggregate
     * @returns {MosaicId | Address}
     */
    public getResolvedFromReceipt(resolutionType: ResolutionType,
                                  unresolved: NamespaceId,
                                  transactionIndex: number,
                                  height: string,
                                  aggregateTransactionIndex?: number): MosaicId | Address {

        const resolutionStatement = (resolutionType === ResolutionType.Address ? this.addressResolutionStatements :
            this.mosaicResolutionStatements).find((resolution) => resolution.height.toString() === height &&
            (resolution.unresolved as NamespaceId).equals(unresolved));

        if (!resolutionStatement) {
            throw new Error(`No resolution statement found on block: ${height} for unresolved: ${unresolved.toHex()}`);
        }

        // If only one entry exists on the statement, just return
        if (resolutionStatement.resolutionEntries.length === 1) {
            return resolutionStatement.resolutionEntries[0].resolved;
        }

        // Get the most recent resolution entry
        const resolutionEntry = resolutionStatement.getResolutionEntryById(
            aggregateTransactionIndex !== undefined ? aggregateTransactionIndex + 1 : transactionIndex + 1,
            aggregateTransactionIndex !== undefined ? transactionIndex + 1 : 0,
        );

        if (!resolutionEntry) {
            throw new Error(`No resolution entry found on block: ${height} for unresolved: ${unresolved.toHex()}`);
        }
        return resolutionEntry.resolved;
    }
}
