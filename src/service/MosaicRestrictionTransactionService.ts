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

import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NamespaceRepository } from '../infrastructure/NamespaceRepository';
import { Page } from '../infrastructure/Page';
import { RestrictionMosaicRepository } from '../infrastructure/RestrictionMosaicRepository';
import { Address } from '../model/account/Address';
import { UnresolvedAddress } from '../model/account/UnresolvedAddress';
import { MosaicId } from '../model/mosaic/MosaicId';
import { UnresolvedMosaicId } from '../model/mosaic/UnresolvedMosaicId';
import { NetworkType } from '../model/network/NetworkType';
import { MosaicAddressRestriction } from '../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../model/restriction/MosaicGlobalRestrictionItem';
import { MosaicRestrictionEntryType } from '../model/restriction/MosaicRestrictionEntryType';
import { MosaicRestrictionType } from '../model/restriction/MosaicRestrictionType';
import { Deadline } from '../model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../model/transaction/MosaicGlobalRestrictionTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';

/**
 * MosaicRestrictionTransactionService service
 */
export class MosaicRestrictionTransactionService {
    private readonly defaultMosaicAddressRestrictionValue = UInt64.fromHex('FFFFFFFFFFFFFFFF');
    private readonly defaultMosaicGlobalRestrictionValue = UInt64.fromUint(0);

    /**
     * Constructor
     * @param restrictionMosaicRepository
     * @param namespaceRepository
     */
    constructor(
        private readonly restrictionMosaicRepository: RestrictionMosaicRepository,
        private readonly namespaceRepository: NamespaceRepository,
    ) {}

    /**
     * Create a MosaicGlobalRestrictionTransaction object without previous restriction data
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param mosaicId - Unresolved mosaicId
     * @param restrictionKey - Restriction key
     * @param restrictionValue - New restriction value
     * @param restrictionType - New restriction type
     * @param referenceMosaicId - Reference mosaic Id
     * @param maxFee - Max fee
     */
    public createMosaicGlobalRestrictionTransaction(
        deadline: Deadline,
        networkType: NetworkType,
        mosaicId: UnresolvedMosaicId,
        restrictionKey: UInt64,
        restrictionValue: string,
        restrictionType: MosaicRestrictionType,
        referenceMosaicId: UnresolvedMosaicId = new MosaicId(UInt64.fromUint(0).toDTO()),
        maxFee: UInt64 = new UInt64([0, 0]),
    ): Observable<Transaction> {
        this.validateInput(restrictionValue);
        return this.getResolvedMosaicId(mosaicId).pipe(
            mergeMap((resolvedMosaicId) =>
                this.getGlobalRestrictionEntry(resolvedMosaicId, restrictionKey).pipe(
                    map((restrictionEntry: MosaicGlobalRestrictionItem | undefined) => {
                        const currentValue = restrictionEntry
                            ? restrictionEntry.restrictionValue
                            : this.defaultMosaicGlobalRestrictionValue;
                        const currentType = restrictionEntry ? restrictionEntry.restrictionType : MosaicRestrictionType.NONE;
                        return MosaicGlobalRestrictionTransaction.create(
                            deadline,
                            resolvedMosaicId,
                            restrictionKey,
                            currentValue,
                            currentType,
                            UInt64.fromNumericString(restrictionValue),
                            restrictionType,
                            networkType,
                            referenceMosaicId,
                            maxFee,
                        );
                    }),
                ),
            ),
        );
    }

    /**
     * Create a MosaicAddressRestrictionTransaction object without previous restriction data
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param mosaicId - Unresolved mosaicId
     * @param restrictionKey - Restriction key
     * @param targetAddress - Unresolved target address
     * @param restrictionValue - New restriction value
     * @param maxFee - Max fee
     */
    public createMosaicAddressRestrictionTransaction(
        deadline: Deadline,
        networkType: NetworkType,
        mosaicId: UnresolvedMosaicId,
        restrictionKey: UInt64,
        targetAddress: UnresolvedAddress,
        restrictionValue: string,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): Observable<Transaction> {
        this.validateInput(restrictionValue);
        const combinedUnresolved = combineLatest(this.getResolvedMosaicId(mosaicId), this.getResolvedAddress(targetAddress));
        return combinedUnresolved.pipe(
            mergeMap(([resolvedMosaicId, resolvedAddress]) =>
                this.getGlobalRestrictionEntry(resolvedMosaicId, restrictionKey).pipe(
                    mergeMap((restrictionEntry: MosaicGlobalRestrictionItem | undefined) => {
                        if (!restrictionEntry) {
                            throw new Error(
                                `Global restriction for mosaic: ${mosaicId.toHex()} is not valid for with RestrictionKey: ${restrictionKey}`,
                            );
                        }
                        return this.getAddressRestrictionEntry(resolvedMosaicId, restrictionKey, resolvedAddress).pipe(
                            map((optionalValue) => {
                                const currentValue = optionalValue || this.defaultMosaicAddressRestrictionValue;
                                return MosaicAddressRestrictionTransaction.create(
                                    deadline,
                                    mosaicId,
                                    restrictionKey,
                                    targetAddress,
                                    UInt64.fromNumericString(restrictionValue),
                                    networkType,
                                    currentValue,
                                    maxFee,
                                );
                            }),
                        );
                    }),
                ),
            ),
        );
    }

    /**
     * Get address global restriction previous value and type
     * @param mosaicId - Mosaic identifier
     * @param restrictionKey - Mosaic global restriction key
     * @param targetAddress - The target address
     * @return {Observable<string | undefined>}
     */
    private getAddressRestrictionEntry(mosaicId: MosaicId, restrictionKey: UInt64, targetAddress: Address): Observable<UInt64 | undefined> {
        return this.restrictionMosaicRepository.search({ mosaicId, targetAddress, entryType: MosaicRestrictionEntryType.ADDRESS }).pipe(
            map((mosaicRestriction) => {
                const addressRestriction = mosaicRestriction.data.find(
                    (r) => r instanceof MosaicAddressRestriction && r.mosaicId.equals(mosaicId) && r.targetAddress.equals(targetAddress),
                );
                return addressRestriction ? addressRestriction.getRestriction(restrictionKey)?.restrictionValue : undefined;
            }),
        );
    }

    /**
     * Get mosaic global restriction prvious value and type
     * @param mosaicId - Mosaic identifier
     * @param restrictionKey - Mosaic global restriction key
     * @return {Observable<MosaicGlobalRestrictionItem | undefined>}
     */
    private getGlobalRestrictionEntry(mosaicId: MosaicId, restrictionKey: UInt64): Observable<MosaicGlobalRestrictionItem | undefined> {
        return this.restrictionMosaicRepository.search({ mosaicId, entryType: MosaicRestrictionEntryType.GLOBAL }).pipe(
            map((mosaicRestrictionPage: Page<MosaicGlobalRestriction>) => {
                const globalRestriction = mosaicRestrictionPage.data.find(
                    (r) => r instanceof MosaicGlobalRestriction && r.mosaicId.equals(mosaicId),
                );

                return globalRestriction ? globalRestriction.getRestriction(restrictionKey) : undefined;
            }),
        );
    }

    /**
     * Check if input restriction key and value are invalid or not
     * @param value - Restriction value
     */
    private validateInput(value: string): void {
        if (!UInt64.isLongNumericString(value)) {
            throw new Error(`RestrictionValue: ${value} is not a valid numeric string.`);
        }
    }

    /**
     * @internal
     * Get resolved mosaicId from namespace repository
     * @param unresolvedMosaicId unresolved mosaicId
     * @returns {MosaicId}
     */
    private getResolvedMosaicId(unresolvedMosaicId: UnresolvedMosaicId): Observable<MosaicId> {
        if (unresolvedMosaicId instanceof MosaicId) {
            return of(unresolvedMosaicId);
        }

        return this.namespaceRepository.getLinkedMosaicId(unresolvedMosaicId).pipe(
            map((mosaicId) => {
                if (!mosaicId) {
                    throw new Error(`Invalid unresolvedMosaicId: ${unresolvedMosaicId.toHex()}`);
                }
                return mosaicId;
            }),
            catchError((err) => {
                throw new Error(err);
            }),
        );
    }

    /**
     * @internal
     * Get resolved address from namespace repository
     * @param unresolvedAddress unresolved address
     * @returns {Address}
     */
    private getResolvedAddress(unresolvedAddress: UnresolvedAddress): Observable<Address> {
        if (unresolvedAddress instanceof Address) {
            return of(unresolvedAddress);
        }

        return this.namespaceRepository.getLinkedAddress(unresolvedAddress).pipe(
            map((address) => {
                if (!address) {
                    throw new Error(`Invalid unresolvedAddress: ${unresolvedAddress.toHex()}`);
                }
                return address;
            }),
            catchError((err) => {
                throw new Error(err);
            }),
        );
    }
}
