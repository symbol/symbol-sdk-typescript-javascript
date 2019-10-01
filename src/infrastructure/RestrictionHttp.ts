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

import { ClientResponse } from 'http';
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { AccountRestrictionsInfo } from '../model/restriction/AccountRestrictionsInfo';
import { MosaicAddressRestriction } from '../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../model/restriction/MosaicGlobalRestrictionItem';
import { AccountRestrictionsInfoDTO,
         MosaicAddressRestrictionDTO,
         MosaicGlobalRestrictionDTO,
         RestrictionRoutesApi } from './api';
import {Http} from './Http';
import { RestrictionRepository } from './RestrictionRepository';

/**
 * Restriction http repository.
 *
 * @since 1.0
 */
export class RestrictionHttp extends Http implements RestrictionRepository {
    /**
     * @internal
     */
    private restrictionRoutesApi: RestrictionRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.restrictionRoutesApi = new RestrictionRoutesApi(url);

    }

    /**
     * Get Account restrictions.
     * @param publicAccount public account
     * @returns Observable<AccountRestrictionsInfo>
     */
    public getAccountRestrictions(address: Address): Observable<AccountRestrictionsInfo> {
        return observableFrom(this.restrictionRoutesApi.getAccountRestrictions(address.plain()))
            .pipe(map((response: { response: ClientResponse; body: AccountRestrictionsInfoDTO; }) => {
                const accountRestrictions = response.body;
                return DtoMapping.extractAccountRestrictionFromDto(accountRestrictions);
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    public getAccountRestrictionsFromAccounts(addresses: Address[]): Observable<AccountRestrictionsInfo[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.restrictionRoutesApi.getAccountRestrictionsFromAccounts(accountIds))
                .pipe(map((response: { response: ClientResponse; body: AccountRestrictionsInfoDTO[]; }) => {
                    const accountRestrictions = response.body;
                    return accountRestrictions.map((restriction) => {
                        return DtoMapping.extractAccountRestrictionFromDto(restriction);
                    });
                }),
                catchError((error) =>  throwError(error)),
        );
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
            this.restrictionRoutesApi.getMosaicAddressRestriction(mosaicId.toHex(), address.plain())).pipe(
                map((response: { response: ClientResponse; body: MosaicAddressRestrictionDTO; }) => {
                    const payload = response.body.mosaicRestrictionEntry;
                    const restirctionItems = new Map<string, string>();
                    return new MosaicAddressRestriction(
                        payload.compositeHash,
                        payload.entryType,
                        new MosaicId(payload.mosaicId),
                        Address.createFromEncoded(payload.targetAddress),
                        payload.restrictions.map((restriction) => {
                            return restirctionItems.set(restriction.key, restriction.value);
                        }),
                    );
                }),
                catchError((error) =>  throwError(error)),
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
            this.restrictionRoutesApi.getMosaicAddressRestrictions(mosaicId.toHex(), accountIds)).pipe(
                map((response: { response: ClientResponse; body: MosaicAddressRestrictionDTO[]; }) => {
                    const mosaicAddressRestrictionsDTO = response.body;
                    return mosaicAddressRestrictionsDTO.map((payload) => {
                        const restirctionItems = new Map<string, string>();
                        return new MosaicAddressRestriction(
                            payload.mosaicRestrictionEntry.compositeHash,
                            payload.mosaicRestrictionEntry.entryType,
                            new MosaicId(payload.mosaicRestrictionEntry.mosaicId),
                            Address.createFromEncoded(payload.mosaicRestrictionEntry.targetAddress),
                            payload.mosaicRestrictionEntry.restrictions.map((restriction) => {
                                return restirctionItems.set(restriction.key, restriction.value);
                            }),
                        );
                    });
                }),
                catchError((error) =>  throwError(error)),
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
            this.restrictionRoutesApi.getMosaicGlobalRestriction(mosaicId.toHex())).pipe(
                map((response: { response: ClientResponse; body: MosaicGlobalRestrictionDTO; }) => {
                    const payload = response.body.mosaicRestrictionEntry;
                    const restirctionItems = new Map<string, MosaicGlobalRestrictionItem>();
                    return new MosaicGlobalRestriction(
                        payload.compositeHash,
                        payload.entryType.valueOf(),
                        new MosaicId(payload.mosaicId),
                        payload.restrictions.map((restriction) => {
                            return restirctionItems.set(restriction.key,
                                                        new MosaicGlobalRestrictionItem(
                                                            new MosaicId(restriction.restriction.referenceMosaicId),
                                                            restriction.restriction.restrictionValue,
                                                            restriction.restriction.restrictionType,
                                                        ));
                        }),
                    );
                }),
                catchError((error) =>  throwError(error)),
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
            this.restrictionRoutesApi.getMosaicGlobalRestrictions(mosaicIdsBody)).pipe(
                map((response: { response: ClientResponse; body: MosaicGlobalRestrictionDTO[]; }) => {
                    const mosaicGlobalRestrictionsDTO = response.body;
                    return mosaicGlobalRestrictionsDTO.map((payload) => {
                        const restirctionItems = new Map<string, MosaicGlobalRestrictionItem>();
                        return new MosaicGlobalRestriction(
                            payload.mosaicRestrictionEntry.compositeHash,
                            payload.mosaicRestrictionEntry.entryType.valueOf(),
                            new MosaicId(payload.mosaicRestrictionEntry.mosaicId),
                            payload.mosaicRestrictionEntry.restrictions.map((restriction) => {
                                return restirctionItems.set(restriction.key,
                                    new MosaicGlobalRestrictionItem(
                                        new MosaicId(restriction.restriction.referenceMosaicId),
                                        restriction.restriction.restrictionValue,
                                        restriction.restriction.restrictionType,
                                    ));
                            }),
                        );
                    });
                }),
                catchError((error) =>  throwError(error)),
        );
    }
}
