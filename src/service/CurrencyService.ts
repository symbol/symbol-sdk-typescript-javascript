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

import { forkJoin, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/internal/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { Currency, MosaicId, MosaicInfo, MosaicNames, NetworkCurrencies } from '../model/mosaic';
import { NamespaceId } from '../model/namespace';
import { ICurrencyService } from './interfaces';

/**
 * A service used to load Currencies objects.
 */
export class CurrencyService implements ICurrencyService {
    constructor(private readonly repositoryFactory: RepositoryFactory) {}

    /**
     * This method loads the network currencies.
     */
    public getNetworkCurrencies(): Observable<NetworkCurrencies> {
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
                    return this.getCurrencies(mosaicIds).pipe(
                        map((networkCurrencies) => {
                            const currency = networkCurrencies.filter((c) => currencyMosaic.equals(c.mosaicId))[0];
                            const harvest = networkCurrencies.filter((c) => harvestingMosaic.equals(c.mosaicId))[0];
                            return new NetworkCurrencies(currency, harvest);
                        }),
                    );
                }),
            );
    }

    public getCurrencies(mosaicIds: MosaicId[]): Observable<Currency[]> {
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
                    return this.getCurrency(mosaicInfo, thisMosaicNames);
                }),
            ),
        );
    }

    /**
     * Creates a network currency model given mosaic info and mosaic names
     * @param {MosaicInfo} mosaicInfo
     * @param {MosaicNames} mosaicName
     * @returns {(Currency | undefined)}
     */
    private getCurrency(mosaicInfo: MosaicInfo, mosaicName: MosaicNames): Currency {
        const mosaicId = mosaicInfo.id;
        const namespaceName = this.getName([mosaicName], mosaicId);
        const namespaceId = namespaceName ? new NamespaceId(namespaceName) : undefined;
        return new Currency({
            mosaicId: mosaicId,
            namespaceId: namespaceId,
            divisibility: mosaicInfo.divisibility,
            transferable: mosaicInfo.flags.transferable,
            supplyMutable: mosaicInfo.flags.supplyMutable,
            restrictable: mosaicInfo.flags.restrictable,
        });
    }

    private getName(mosaicNames: MosaicNames[], accountMosaicDto: MosaicId): string | undefined {
        return mosaicNames
            .filter((n) => n.mosaicId.equals(accountMosaicDto))
            .filter((n) => n.names.length)
            .map((n) => n.names[0].name)?.[0];
    }
}
