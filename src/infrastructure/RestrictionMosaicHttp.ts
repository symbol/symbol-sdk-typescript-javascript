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

import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Address } from '../model/account/Address';
import { NetworkType } from '../model/blockchain/NetworkType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicAddressRestriction } from '../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../model/restriction/MosaicGlobalRestrictionItem';
import { RestrictionMosaicRoutesApi } from './api/restrictionMosaicRoutesApi';
import {Http} from './Http';
import { RestrictionMosaicRepository } from './RestrictionMosaicRespository';

/**
 * RestrictionMosaic http repository.
 *
 * @since 1.0
 */
export class RestrictionMosaicHttp extends Http implements RestrictionMosaicRepository {
    /**
     * @internal
     */
    private restrictionMosaicRoutesApi: RestrictionMosaicRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkType
     */
    constructor(url: string, networkType?: NetworkType) {
        super(url, networkType);
        this.restrictionMosaicRoutesApi = new RestrictionMosaicRoutesApi(url);

    }

    /**
     * Get mosaic address restriction.
     * @summary Get mosaic address restrictions for a given mosaic and account identifier.
     * @param mosaicId Mosaic identifier.
     * @param address address
     * @returns Observable<MosaicAddressRestriction>
     */
    getMosaicAddressRestriction(mosaicId: MosaicId, address: Address): Observable<MosaicAddressRestriction> {
        return observableFrom(
            this.restrictionMosaicRoutesApi.getMosaicAddressRestriction(mosaicId.toHex(), address.plain())).pipe(
                map(({body}) => {
                    const payload = body.mosaicRestrictionEntry;
                    const restirctionItems = new Map<string, string>();
                    payload.restrictions.forEach((restriction) => {
                        restirctionItems.set(restriction.key, restriction.value);
                    });
                    return new MosaicAddressRestriction(
                        payload.compositeHash,
                        payload.entryType.valueOf(),
                        new MosaicId(payload.mosaicId),
                        Address.createFromEncoded(payload.targetAddress),
                        restirctionItems,
                    );
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get mosaic address restrictions.
     * @summary Get mosaic address restrictions for a given mosaic and account identifiers array
     * @param mosaicId Mosaic identifier.
     * @param addresses list of addresses
     * @returns Observable<MosaicAddressRestriction[]>
     */
    getMosaicAddressRestrictions(mosaicId: MosaicId, addresses: Address[]): Observable<MosaicAddressRestriction[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.restrictionMosaicRoutesApi.getMosaicAddressRestrictions(mosaicId.toHex(), accountIds)).pipe(
                map(({body}) => body.map((payload) => {
                        const restirctionItems = new Map<string, string>();
                        payload.mosaicRestrictionEntry.restrictions.forEach((restriction) => {
                            restirctionItems.set(restriction.key, restriction.value);
                        });
                        return new MosaicAddressRestriction(
                            payload.mosaicRestrictionEntry.compositeHash,
                            payload.mosaicRestrictionEntry.entryType.valueOf(),
                            new MosaicId(payload.mosaicRestrictionEntry.mosaicId),
                            Address.createFromEncoded(payload.mosaicRestrictionEntry.targetAddress),
                            restirctionItems,
                        );
                    })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get mosaic global restriction.
     * @summary Get mosaic global restrictions for a given mosaic identifier.
     * @param mosaicId Mosaic identifier.
     * @returns Observable<MosaicGlobalRestriction>
     */
    getMosaicGlobalRestriction(mosaicId: MosaicId): Observable<MosaicGlobalRestriction> {
        return observableFrom(
            this.restrictionMosaicRoutesApi.getMosaicGlobalRestriction(mosaicId.toHex())).pipe(
                map(({body}) => {
                    const payload = body.mosaicRestrictionEntry;
                    const restirctionItems = new Map<string, MosaicGlobalRestrictionItem>();
                    payload.restrictions.forEach((restriction) =>
                        restirctionItems.set(restriction.key,
                                        new MosaicGlobalRestrictionItem(
                                            new MosaicId(restriction.restriction.referenceMosaicId),
                                            restriction.restriction.restrictionValue,
                                            restriction.restriction.restrictionType.valueOf(),
                    )));
                    return new MosaicGlobalRestriction(
                        payload.compositeHash,
                        payload.entryType.valueOf(),
                        new MosaicId(payload.mosaicId),
                        restirctionItems,
                    );
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get mosaic global restrictions.
     * @summary Get mosaic global restrictions for a given list of mosaics.
     * @param mosaicIds List of mosaic identifier.
     * @returns Observable<MosaicGlobalRestriction[]>
     */
    getMosaicGlobalRestrictions(mosaicIds: MosaicId[]): Observable<MosaicGlobalRestriction[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return observableFrom(
            this.restrictionMosaicRoutesApi.getMosaicGlobalRestrictions(mosaicIdsBody)).pipe(
                map(({body}) => body.map((payload) => {
                        const restirctionItems = new Map<string, MosaicGlobalRestrictionItem>();
                        payload.mosaicRestrictionEntry.restrictions.forEach((restriction) =>
                            restirctionItems.set(restriction.key,
                                            new MosaicGlobalRestrictionItem(
                                                new MosaicId(restriction.restriction.referenceMosaicId),
                                                restriction.restriction.restrictionValue,
                                                restriction.restriction.restrictionType.valueOf(),
                        )));
                        return new MosaicGlobalRestriction(
                            payload.mosaicRestrictionEntry.compositeHash,
                            payload.mosaicRestrictionEntry.entryType.valueOf(),
                            new MosaicId(payload.mosaicRestrictionEntry.mosaicId),
                            restirctionItems,
                        );
                    })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
