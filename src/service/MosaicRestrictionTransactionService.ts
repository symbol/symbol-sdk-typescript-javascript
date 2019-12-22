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

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Address } from '../model/account/Address';
import { NetworkType } from '../model/blockchain/NetworkType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../model/restriction/MosaicGlobalRestrictionItem';
import { MosaicRestrictionType } from '../model/restriction/MosaicRestrictionType';
import { Deadline } from '../model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../model/transaction/MosaicGlobalRestrictionTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import { RestrictionMosaicRepository } from "../infrastructure/RestrictionMosaicRepository";
import { NamespaceId } from "../model/namespace/NamespaceId";

/**
 * MosaicRestrictionTransactionService service
 */
export class MosaicRestrictionTransactionService {

    private readonly defaultMosaicAddressRestrictionValue = UInt64.fromHex('FFFFFFFFFFFFFFFF');
    private readonly defaultMosaicGlobalRestrictionValue = UInt64.fromUint(0);

    /**
     * Constructor
     * @param restrictionMosaicRepository
     */
    constructor(private readonly restrictionMosaicRepository: RestrictionMosaicRepository) {
    }

    /**
     * Create a MosaicGlobalRestrictionTransaction object without previous restriction data
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param mosaicId - MosaicId
     * @param restrictionKey - Restriction key
     * @param restrictionValue - New restriction value
     * @param restrictionType - New restriction type
     * @param referenceMosaicId - Reference mosaic Id
     * @param maxFee - Max fee
     */
    public createMosaicGlobalRestrictionTransaction(deadline: Deadline,
                                                    networkType: NetworkType,
                                                    mosaicId: MosaicId,
                                                    restrictionKey: UInt64,
                                                    restrictionValue: string,
                                                    restrictionType: MosaicRestrictionType,
                                                    referenceMosaicId: MosaicId | NamespaceId = new MosaicId(UInt64.fromUint(0).toDTO()),
                                                    maxFee: UInt64 = new UInt64([0, 0])): Observable<Transaction> {
        this.validateInput(restrictionValue);
        return this.getGlobalRestrictionEntry(mosaicId, restrictionKey).pipe(
            map((restrictionEntry: MosaicGlobalRestrictionItem | undefined) => {
                const currentValue = restrictionEntry ? UInt64.fromNumericString(restrictionEntry.restrictionValue) :
                    this.defaultMosaicGlobalRestrictionValue;
                const currentType = restrictionEntry ? restrictionEntry.restrictionType : MosaicRestrictionType.NONE;

                return MosaicGlobalRestrictionTransaction.create(
                    deadline,
                    mosaicId,
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
            catchError((err) => {
                throw Error(err);
            }));
    }

    /**
     * Create a MosaicAddressRestrictionTransaction object without previous restriction data
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param mosaicId - MosaicId
     * @param restrictionKey - Restriction key
     * @param targetAddress - Target address
     * @param restrictionValue - New restriction value
     * @param maxFee - Max fee
     */
    public createMosaicAddressRestrictionTransaction(deadline: Deadline,
                                                     networkType: NetworkType,
                                                     mosaicId: MosaicId,
                                                     restrictionKey: UInt64,
                                                     targetAddress: Address,
                                                     restrictionValue: string,
                                                     maxFee: UInt64 = new UInt64([0, 0])): Observable<Transaction> {
        this.validateInput(restrictionValue);
        return this.getGlobalRestrictionEntry(mosaicId, restrictionKey).pipe(
            switchMap((restrictionEntry: MosaicGlobalRestrictionItem | undefined) => {
                if (!restrictionEntry) {
                    throw Error('Global restriction is not valid for RestrictionKey: ' + restrictionKey);
                }
                return this.getAddressRestrictionEntry(mosaicId, restrictionKey, targetAddress).pipe(
                    map((optionalValue) => {
                        const currentValue = optionalValue ? UInt64.fromNumericString(optionalValue) : this.defaultMosaicAddressRestrictionValue;
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
                    }));
            }),
        );
    }

    /**
     * Get address global restriction previous value and type
     * @param mosaicId - Mosaic identifier
     * @param restrictionKey - Mosaic global restriction key
     * @param targetAddress - The target address
     * @return {Observable<string | undefined>}
     */
    private getAddressRestrictionEntry(mosaicId: MosaicId, restrictionKey: UInt64, targetAddress: Address): Observable<string | undefined> {
        return this.restrictionMosaicRepository.getMosaicAddressRestriction(mosaicId, targetAddress).pipe(
            map((mosaicRestriction) => {
                return mosaicRestriction.restrictions.get(restrictionKey.toHex());
            }),
            catchError((err: Error) => {
                const error = JSON.parse(err.message);
                if (error && error.statusCode && error.statusCode === 404) {
                    return of(undefined);
                }
                throw Error(err.message);
            }));
    }

    /**
     * Get mosaic global restriction prvious value and type
     * @param mosaicId - Mosaic identifier
     * @param restrictionKey - Mosaic global restriction key
     * @return {Observable<MosaicGlobalRestrictionItem | undefined>}
     */
    private getGlobalRestrictionEntry(mosaicId: MosaicId, restrictionKey: UInt64): Observable<MosaicGlobalRestrictionItem | undefined> {
        return this.restrictionMosaicRepository.getMosaicGlobalRestriction(mosaicId).pipe(
            map((mosaicRestriction: MosaicGlobalRestriction) => {
                return mosaicRestriction.restrictions.get(restrictionKey.toHex());
            }),
            catchError((err: Error) => {
                const error = JSON.parse(err.message);
                if (error && error.statusCode && error.statusCode === 404) {
                    return of(undefined);
                }
                throw Error(err.message);
            }));
    }

    /**
     * Check if input restriction key and value are invalid or not
     * @param value - Restriction value
     */
    private validateInput(value: string) {
        if (!UInt64.isLongNumericString(value)) {
            throw Error(`RestrictionValue: ${value} is not a valid numeric string.`);
        }
    }
}
