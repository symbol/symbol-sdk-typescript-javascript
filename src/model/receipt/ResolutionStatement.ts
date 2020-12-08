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

import {
    AddressResolutionEntryBuilder,
    AddressResolutionStatementBuilder,
    MosaicResolutionEntryBuilder,
    MosaicResolutionStatementBuilder,
    ReceiptSourceBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { sha3_256 } from 'js-sha3';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { MosaicId } from '../mosaic/MosaicId';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
import { ResolutionEntry } from './ResolutionEntry';
import { ResolutionType } from './ResolutionType';

/**
 * ResolutionStatement alias for Addresses receipts.
 */
export type AddressResolutionStatement = ResolutionStatement<UnresolvedAddress, Address>;

/**
 * ResolutionStatement alias for Mosaic ids receipts.
 */
export type MosaicIdResolutionStatement = ResolutionStatement<UnresolvedMosaicId, MosaicId>;

/**
 * When a transaction includes an alias, a so called resolution statement reflects the resolved value for that block:
 * - Address Resolution: An account alias was used in the block.
 * - Mosaic Resolution: A mosaic alias was used in the block.
 */
export class ResolutionStatement<U extends UnresolvedAddress | UnresolvedMosaicId, R extends Address | MosaicId> {
    /**
     * Receipt - resolution statement object
     * @param resolutionType - The resolution type
     * @param height - The block height
     * @param unresolved - An unresolved address or unresolved mosaicId.
     * @param resolutionEntries - The array of resolution entries.
     */
    constructor(
        /**
         * Resolution type
         */
        public readonly resolutionType: ResolutionType,
        /**
         * The block height.
         */
        public readonly height: UInt64,
        /**
         * An unresolved address or unresolved mosaicId.
         */
        public readonly unresolved: U,
        /**
         * The array of resolution entries.
         */
        public readonly resolutionEntries: ResolutionEntry<R>[],
    ) {}

    /**
     * Generate receipt hash
     * @param {networkType} the network type serialized in the output.
     * @return {string} receipt hash in hex
     */
    public generateHash(networkType: NetworkType): string {
        const type =
            this.resolutionType === ResolutionType.Address ? ReceiptType.Address_Alias_Resolution : ReceiptType.Mosaic_Alias_Resolution;
        const builder =
            this.resolutionType === ResolutionType.Address
                ? new AddressResolutionStatementBuilder(
                      ReceiptVersion.RESOLUTION_STATEMENT,
                      type.valueOf(),
                      new UnresolvedAddressDto(
                          UnresolvedMapping.toUnresolvedAddressBytes(this.unresolved as UnresolvedAddress, networkType),
                      ),
                      this.resolutionEntries.map(
                          (entry) =>
                              new AddressResolutionEntryBuilder(
                                  new ReceiptSourceBuilder(entry.source.primaryId, entry.source.secondaryId),
                                  (entry.resolved as Address).toBuilder(),
                              ),
                      ),
                  )
                : new MosaicResolutionStatementBuilder(
                      ReceiptVersion.RESOLUTION_STATEMENT,
                      type.valueOf(),
                      new UnresolvedMosaicIdDto(UInt64.fromHex((this.unresolved as UnresolvedMosaicId).toHex()).toDTO()),
                      this.resolutionEntries.map(
                          (entry) =>
                              new MosaicResolutionEntryBuilder(
                                  new ReceiptSourceBuilder(entry.source.primaryId, entry.source.secondaryId),
                                  (entry.resolved as MosaicId).toBuilder(),
                              ),
                      ),
                  );
        const hasher = sha3_256.create();
        hasher.update(builder.serialize());
        return hasher.hex().toUpperCase();
    }

    /**
     * @internal
     * Find resolution entry for given primaryId and secondaryId
     * @param primaryId Primary id
     * @param secondaryId Secondary id
     * @returns {ResolutionEntry | undefined}
     */
    public getResolutionEntryById(primaryId: number, secondaryId: number): ResolutionEntry<R> | undefined {
        /*
        Primary id and secondary id do not specifically map to the exact transaction index on the same block.
        The ids are just the order of the resolution reflecting on the order of transactions (ordered by index).
        E.g 1 - Bob -> 1 random.token -> Alice
            2 - Carol -> 1 random.token > Denis
        Based on above example, 2 transactions (index 0 & 1) are created on the same block, however, only 1
        resolution entry get generated for both.
        */
        const resolvedPrimaryId = this.getMaxAvailablePrimaryId(primaryId);

        /*
        If no primaryId found, it means there's no resolution entry available for the process. Invalid entry.

        e.g. Given:
        Entries: [{P:2, S:0}, {P:5, S:6}]
        Transaction: [Inx:1(0+1), AggInx:0]
        It should return Entry: undefined
        */
        if (resolvedPrimaryId === 0) {
            return undefined;
        } else if (primaryId > resolvedPrimaryId) {
            /*
            If the transaction index is greater than the overall most recent source primary id.
            Use the most recent resolution entry (Max.PrimaryId + Max.SecondaryId)

            e.g. Given:
            Entries: [{P:1, S:0}, {P:2, S:0}, {P:4, S:2}, {P:4, S:4} {P:7, S:6}]
            Transaction: [Inx:5(4+1), AggInx:0]
            It should return Entry: {P:4, S:4}

            e.g. Given:
            Entries: [{P:1, S:0}, {P:2, S:0}, {P:4, S:2}, {P:4, S:4}, {P:7, S:6}]
            Transaction: [Inx:3(2+1), AggInx:0]
            It should return Entry: {P:2, S:0}
            */
            return this.resolutionEntries.find(
                (entry) =>
                    entry.source.primaryId === resolvedPrimaryId &&
                    entry.source.secondaryId === this.getMaxSecondaryIdByPrimaryId(resolvedPrimaryId),
            );
        }

        // When transaction index matches a primaryId, get the most recent secondaryId (resolvedPrimaryId can only <= primaryId)
        const resolvedSecondaryId = this.getMaxSecondaryIdByPrimaryIdAndSecondaryId(resolvedPrimaryId, secondaryId);

        /*
        If no most recent secondaryId matched transaction index, find previous resolution entry (most recent).
        This means the resolution entry for the specific inner transaction (inside Aggregate) /
        was generated previously outside the aggregate. It should return the previous entry (previous primaryId)

        e.g. Given:
        Entries: [{P:1, S:0}, {P:2, S:0}, {P:5, S:6}]
        Transaction: [Inx:5(4+1), AggInx:3(2+1)]
        It should return Entry: {P:2, S:0}
        */
        if (resolvedSecondaryId === 0 && resolvedSecondaryId !== secondaryId) {
            const lastPrimaryId = this.getMaxAvailablePrimaryId(resolvedPrimaryId - 1);
            return this.resolutionEntries.find(
                (entry) =>
                    entry.source.primaryId === lastPrimaryId &&
                    entry.source.secondaryId === this.getMaxSecondaryIdByPrimaryId(lastPrimaryId),
            );
        }

        /*
        Found a matched resolution entry on both primaryId and secondaryId

        e.g. Given:
        Entries: [{P:1, S:0}, {P:2, S:0}, {P:5, S:6}]
        Transaction: [Inx:5(4+1), AggInx:6(2+1)]
        It should return Entry: {P:5, S:6}
        */
        return this.resolutionEntries.find(
            (entry) => entry.source.primaryId === resolvedPrimaryId && entry.source.secondaryId === resolvedSecondaryId,
        );
    }

    /**
     * @internal
     * Get max secondary id by a given primaryId
     * @param primaryId Primary source id
     * @returns {number}
     */
    private getMaxSecondaryIdByPrimaryId(primaryId: number): number {
        return Math.max(
            ...this.resolutionEntries
                .filter((entry) => entry.source.primaryId === primaryId)
                .map((filtered) => filtered.source.secondaryId),
        );
    }

    /**
     * Get most `recent` available secondary id by a given primaryId
     * @param primaryId Primary source id
     * @param secondaryId Secondary source id
     * @returns {number}
     */
    private getMaxSecondaryIdByPrimaryIdAndSecondaryId(primaryId: number, secondaryId: number): number {
        return Math.max(
            ...this.resolutionEntries
                .filter((entry) => entry.source.primaryId === primaryId)
                .map((filtered) => (secondaryId >= filtered.source.secondaryId ? filtered.source.secondaryId : 0)),
        );
    }

    /**
     * @internal
     * Get most `recent` primary source id by a given id (transaction index) as PrimaryId might not be the same as block transaction index.
     * @param primaryId Primary source id
     * @returns {number}
     */
    private getMaxAvailablePrimaryId(primaryId: number): number {
        return Math.max(...this.resolutionEntries.map((entry) => (primaryId >= entry.source.primaryId ? entry.source.primaryId : 0)));
    }
}
