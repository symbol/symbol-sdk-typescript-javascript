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

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import {Observable} from 'rxjs/Observable';
import {AccountHttp} from '../infrastructure/AccountHttp';
import {MosaicHttp} from '../infrastructure/MosaicHttp';
import {NamespaceHttp} from '../infrastructure/NamespaceHttp';
import {Address} from '../model/account/Address';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicAmountView} from './MosaicAmountView';
import {MosaicView} from './MosaicView';

/**
 * Mosaic service
 */
export class MosaicService {

    /**
     * Constructor
     * @param accountHttp
     * @param mosaicHttp
     * @param namespaceHttp
     */
    constructor(private readonly accountHttp: AccountHttp,
                private readonly mosaicHttp: MosaicHttp,
                private readonly namespaceHttp: NamespaceHttp) {

    }

    /**
     * Get mosaic view given mosaicIds
     * @param mosaicIds - The ids of the mosaics
     * @returns {Observable<MosaicView[]>}
     */
    mosaicsView(mosaicIds: MosaicId[]): Observable<MosaicView[]> {
        return Observable.of(mosaicIds)
            .flatMap((_) => this.mosaicHttp.getMosaics(mosaicIds))
            .flatMap((_) => _)
            .flatMap((mosaicInfo) => this.mosaicHttp.getMosaicsName([mosaicInfo.mosaicId]).map((mosaicsName) => {
                return {mosaicInfo, mosaicName: mosaicsName[0].name};
            }))
            .flatMap((_) => this.namespaceHttp.getNamespacesName([_.mosaicInfo.namespaceId]).map((namespacesName) => {
                return new MosaicView(_.mosaicInfo, namespacesName[0].name, _.mosaicName);
            }))
            .toArray();
    }

    /**
     * Get mosaic amount view given mosaic array
     * @param mosaics
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountView(mosaics: Mosaic[]): Observable<MosaicAmountView[]> {
        return Observable.of(mosaics)
            .flatMap((_) => _)
            .flatMap((mosaic) => this.mosaicsView([mosaic.id]).map((mosaicViews) => {
                return new MosaicAmountView(mosaicViews[0].mosaicInfo,
                    mosaicViews[0].namespaceName,
                    mosaicViews[0].mosaicName,
                    mosaic.amount);
            }))
            .toArray()
            .catch(() => {
                return Observable.of([]);
            });
    }

    /**
     * Get balance mosaics in form of MosaicAmountViews for a given account address
     * @param address - Account address
     * @returns {Observable<MosaicAmountView[]>}
     */
    mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]> {
        return Observable.of(address)
            .flatMap((_) => this.accountHttp.getAccountInfo(_))
            .flatMap((_) => this.mosaicsAmountView(_.mosaics));
    }
}
