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
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { Mosaic } from '../mosaic/Mosaic';
import { MosaicId } from '../mosaic/MosaicId';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { AddressResolutionStatement, MosaicIdResolutionStatement } from './ResolutionStatement';
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
        public readonly addressResolutionStatements: AddressResolutionStatement[],
        /**
         * The mosaic resolution statements.
         */
        public readonly mosaicResolutionStatements: MosaicIdResolutionStatement[],
    ) {}

    /**
     * Resolve unresolvedAddress from statement
     * @param unresolvedAddress Unresolved address
     * @param height Block height
     * @param transactionIndex Transaction index
     * @param aggregateTransactionIndex Aggregate transaction index
     * @returns {Address}
     */
    public resolveAddress(
        unresolvedAddress: UnresolvedAddress,
        height: string,
        transactionIndex: number,
        aggregateTransactionIndex = 0,
    ): Address {
        return unresolvedAddress instanceof NamespaceId
            ? (this.getResolvedFromReceipt(
                  ResolutionType.Address,
                  unresolvedAddress as NamespaceId,
                  transactionIndex,
                  height,
                  aggregateTransactionIndex,
              ) as Address)
            : unresolvedAddress;
    }

    /**
     * Resolve unresolvedMosaicId from statement
     * @param unresolvedMosaicId Unresolved mosaic id
     * @param height Block height
     * @param transactionIndex Transaction index
     * @param aggregateTransactionIndex Aggregate transaction index
     * @returns {MosaicId}
     */
    public resolveMosaicId(
        unresolvedMosaicId: UnresolvedMosaicId,
        height: string,
        transactionIndex: number,
        aggregateTransactionIndex = 0,
    ): MosaicId {
        return unresolvedMosaicId instanceof NamespaceId
            ? (this.getResolvedFromReceipt(
                  ResolutionType.Mosaic,
                  unresolvedMosaicId as NamespaceId,
                  transactionIndex,
                  height,
                  aggregateTransactionIndex,
              ) as MosaicId)
            : unresolvedMosaicId;
    }

    /**
     * Resolve unresolvedMosaic from statement
     * @param unresolvedMosaic Unresolved mosaic
     * @param height Block height
     * @param transactionIndex Transaction index
     * @param aggregateTransactionIndex Aggregate transaction index
     * @returns {Mosaic}
     */
    public resolveMosaic(unresolvedMosaic: Mosaic, height: string, transactionIndex: number, aggregateTransactionIndex = 0): Mosaic {
        return unresolvedMosaic.id instanceof NamespaceId
            ? new Mosaic(
                  this.getResolvedFromReceipt(
                      ResolutionType.Mosaic,
                      unresolvedMosaic.id as NamespaceId,
                      transactionIndex,
                      height,
                      aggregateTransactionIndex,
                  ) as MosaicId,
                  unresolvedMosaic.amount,
              )
            : unresolvedMosaic;
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
    private getResolvedFromReceipt(
        resolutionType: ResolutionType,
        unresolved: NamespaceId,
        transactionIndex: number,
        height: string,
        aggregateTransactionIndex?: number,
    ): MosaicId | Address {
        const list: (AddressResolutionStatement | MosaicIdResolutionStatement)[] =
            resolutionType === ResolutionType.Address ? this.addressResolutionStatements : this.mosaicResolutionStatements;

        const filter = (resolution: AddressResolutionStatement | MosaicIdResolutionStatement): boolean =>
            resolution.height.toString() === height && (resolution.unresolved as NamespaceId).equals(unresolved);

        const resolutionStatement = list.find(filter);

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
