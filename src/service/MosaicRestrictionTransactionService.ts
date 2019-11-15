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
import { RestrictionMosaicHttp } from '../infrastructure/RestrictionMosaicHttp';
import { Address } from '../model/account/Address';
import { NetworkType } from '../model/blockchain/NetworkType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicAddressRestriction } from '../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../model/restriction/MosaicGlobalRestrictionItem';
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

    private readonly defaultMosaicAddressRestrictionVaule = UInt64.fromHex('FFFFFFFFFFFFFFFF');
    private readonly defaultMosaicGlobalRestrictionVaule = UInt64.fromUint(0);
    /**
     * Constructor
     * @param restrictionHttp
     */
    constructor(private readonly restrictionHttp: RestrictionMosaicHttp) {
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
                                                    referenceMosaicId: MosaicId = new MosaicId(UInt64.fromUint(0).toDTO()),
                                                    maxFee: UInt64 = new UInt64([0, 0])): Observable<Transaction> {
        this.validateInput(restrictionValue);
        return this.getGlobalRestrictionEntry(mosaicId, restrictionKey).pipe(
            map((restrictionEntry: MosaicGlobalRestrictionItem | undefined) => {
                const currentValue = restrictionEntry ? UInt64.fromNumericString(restrictionEntry.restrictionValue) :
                              this.defaultMosaicGlobalRestrictionVaule;
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
                    throw Error('Global restriction is not valid for RetrictionKey: ' + restrictionKey);
                }
                return this.restrictionHttp.getMosaicAddressRestriction(mosaicId, targetAddress).pipe(
                    map((addressRestriction: MosaicAddressRestriction) => {
                        const addressEntry = addressRestriction.restrictions.get(restrictionKey.toHex());
                        const currentValue = addressEntry ? UInt64.fromNumericString(addressEntry) :
                                                this.defaultMosaicAddressRestrictionVaule;
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
                    catchError((err: Error) => {
                        const error = JSON.parse(err.message);
                        if (error && error.statusCode && error.statusCode === 404) {
                            return of(MosaicAddressRestrictionTransaction.create(
                                deadline,
                                mosaicId,
                                restrictionKey,
                                targetAddress,
                                UInt64.fromNumericString(restrictionValue),
                                networkType,
                                this.defaultMosaicAddressRestrictionVaule,
                                maxFee,
                            ));
                        }
                        throw Error(err.message);
                }));
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
        return this.restrictionHttp.getMosaicGlobalRestriction(mosaicId).pipe(
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
