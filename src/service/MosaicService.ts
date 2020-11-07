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

import { Observable, of as observableOf } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { AccountRepository } from '../infrastructure/AccountRepository';
import { MosaicRepository } from '../infrastructure/MosaicRepository';
import { Address } from '../model/account/Address';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { MosaicAmountView } from './MosaicAmountView';
import { MosaicView } from './MosaicView';

/**
 * Mosaic service
 */
export class MosaicService {
    /**
     * Constructor
     * @param accountRepository
     * @param mosaicRepository
     */
    constructor(private readonly accountRepository: AccountRepository, private readonly mosaicRepository: MosaicRepository) {}

    /**
     * Get mosaic view given mosaicIds
     * @param mosaicIds - The ids of the mosaics
     * @returns {Observable<MosaicView[]>}
     */
    mosaicsView(mosaicIds: MosaicId[]): Observable<MosaicView[]> {
        return observableOf(mosaicIds).pipe(
            mergeMap(() =>
                this.mosaicRepository.getMosaics(mosaicIds).pipe(
                    mergeMap((info) => info),
                    map((mosaicInfo: MosaicInfo) => {
                        return new MosaicView(mosaicInfo);
                    }),
                    toArray(),
                ),
            ),
        );
    }

    /**
     * Get mosaic amount view given mosaic array
     * @param mosaics
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountView(mosaics: Mosaic[]): Observable<MosaicAmountView[]> {
        const mosaicIds = mosaics.map((mosaic) => {
            return new MosaicId(mosaic.id.toHex());
        });
        return this.mosaicsView(mosaicIds).pipe(
            map((mosaicViews) => {
                const results: MosaicAmountView[] = [];
                mosaicViews.forEach((view) => {
                    const mosaic = mosaics.find((m) => m.id.toHex() === view.mosaicInfo.id.toHex());
                    if (mosaic) {
                        results.push(new MosaicAmountView(view.mosaicInfo, mosaic.amount));
                    }
                });
                return results;
            }),
        );
    }

    /**
     * Get balance mosaics in form of MosaicAmountViews for a given account address
     * @param address - Account address
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]> {
        return observableOf(address).pipe(
            mergeMap((_) => this.accountRepository.getAccountInfo(_)),
            mergeMap((_) => this.mosaicsAmountView(_.mosaics)),
        );
    }
}
