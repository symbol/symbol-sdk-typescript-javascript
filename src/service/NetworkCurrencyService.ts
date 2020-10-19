/*
 * Copyright 2020 NEM
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

import { defer, forkJoin, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/internal/operators';
import { shareReplay } from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { MosaicId } from '../model/mosaic';
import { MosaicInfo } from '../model/mosaic';
import { MosaicNames } from '../model/mosaic';
import { NetworkCurrency } from '../model/mosaic';
import { NetworkCurrencies } from '../model/mosaic/NetworkCurrencies';
import { NamespaceId } from '../model/namespace';
import { INetworkCurrencyService } from './interfaces';

/**
 * A service used to load network currencies.
 */
export class NetworkCurrencyService implements INetworkCurrencyService {
    /**
     * Local cache for symbol network currencies.
     */
    private readonly networkCurrenciesObservable: Observable<NetworkCurrencies>;

    constructor(private readonly repositoryFactory: RepositoryFactory) {
        this.networkCurrenciesObservable = defer(() => this.loadMainNetworkCurrencies()).pipe(shareReplay(1));
    }

    public getMainNetworkCurrencies(): Observable<NetworkCurrencies> {
        return this.networkCurrenciesObservable;
    }

    public loadMainNetworkCurrencies(): Observable<NetworkCurrencies> {
        return this.repositoryFactory
            .createNetworkRepository()
            .getNetworkProperties()
            .pipe(
                flatMap((properties) => {
                    if (!properties.chain.currencyMosaicId) {
                        throw new Error('currencyMosaicId could not be loaded from network properties!!');
                    }
                    if (!properties.chain.harvestingMosaicId) {
                        throw new Error('harvestingMosaicId could not be loaded from network properties!!');
                    }
                    const currencyMosaic = new MosaicId(DtoMapping.toSimpleHex(properties.chain.currencyMosaicId));
                    const harvestingMosaic = new MosaicId(DtoMapping.toSimpleHex(properties.chain.harvestingMosaicId));
                    const mosaicIds = currencyMosaic.equals(harvestingMosaic) ? [currencyMosaic] : [currencyMosaic, harvestingMosaic];
                    return this.loadCurrencies(mosaicIds).pipe(
                        map((networkCurrencies) => {
                            const currency = networkCurrencies.filter((c) => currencyMosaic.equals(c.mosaicId))[0];
                            const harvest = networkCurrencies.filter((c) => harvestingMosaic.equals(c.mosaicId))[0];
                            return new NetworkCurrencies(currency, harvest);
                        }),
                    );
                }),
            );
    }

    public loadCurrencies(mosaicIds: MosaicId[]): Observable<NetworkCurrency[]> {
        const mosaicHttp = this.repositoryFactory.createMosaicRepository();
        const namespaceHttp = this.repositoryFactory.createNamespaceRepository();

        // get mosaicInfo and mosaic names from the network,
        // build network currency models
        return forkJoin({
            mosaicsInfo: mosaicHttp.getMosaics(mosaicIds).toPromise(),
            mosaicNames: namespaceHttp.getMosaicsNames(mosaicIds).toPromise(),
        }).pipe(
            map(({ mosaicsInfo, mosaicNames }) =>
                mosaicsInfo.map((mosaicInfo) => {
                    const thisMosaicNames =
                        mosaicNames.find((mn) => mn.mosaicId.equals(mosaicInfo.id)) || new MosaicNames(mosaicInfo.id, []);
                    return this.getNetworkCurrency(mosaicInfo, thisMosaicNames);
                }),
            ),
        );
    }

    /**
     * Creates a network currency model given mosaic info and mosaic names
     * @param {MosaicInfo} mosaicInfo
     * @param {MosaicNames} mosaicName
     * @returns {(NetworkCurrency | undefined)}
     */
    private getNetworkCurrency(mosaicInfo: MosaicInfo, mosaicName: MosaicNames): NetworkCurrency {
        const mosaicId = mosaicInfo.id;
        const namespaceName = this.getName([mosaicName], mosaicId);
        const namespaceId = namespaceName ? new NamespaceId(namespaceName) : undefined;
        return new NetworkCurrency({
            unresolvedMosaicId: namespaceId,
            mosaicId: mosaicId,
            namespaceId: namespaceId,
            divisibility: mosaicInfo.divisibility,
            transferable: mosaicInfo.flags.transferable,
            supplyMutable: mosaicInfo.flags.supplyMutable,
        });
    }

    private getName(mosaicNames: MosaicNames[], accountMosaicDto: MosaicId): string | undefined {
        return mosaicNames
            .filter((n) => n.mosaicId.equals(accountMosaicDto))
            .filter((n) => n.names.length)
            .map((n) => n.names[0].name)?.[0];
    }
}
