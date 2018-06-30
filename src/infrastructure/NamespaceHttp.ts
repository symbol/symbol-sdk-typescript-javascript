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
import {NamespaceRoutesApi} from 'nem2-library';
import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {Address} from '../model/account/Address';
import {PublicAccount} from '../model/account/PublicAccount';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {NamespaceInfo} from '../model/namespace/NamespaceInfo';
import {NamespaceName} from '../model/namespace/NamespaceName';
import {UInt64} from '../model/UInt64';
import {Http} from './Http';
import {NamespaceRepository} from './NamespaceRepository';
import {NetworkHttp} from './NetworkHttp';
import {QueryParams} from './QueryParams';

/**
 * Namespace http repository.
 *
 * @since 1.0
 */
export class NamespaceHttp extends Http implements NamespaceRepository {
    /**
     * @internal
     * Nem2 Library namespace routes api
     */
    private namespaceRoutesApi: NamespaceRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
        this.namespaceRoutesApi = new NamespaceRoutesApi(this.apiClient);
    }

    /**
     * Gets the NamespaceInfo for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<NamespaceInfo>
     */
    public getNamespace(namespaceId: NamespaceId): Observable<NamespaceInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.namespaceRoutesApi.getNamespace(namespaceId.toHex())).pipe(map((namespaceInfoDTO) => {
                return new NamespaceInfo(
                    namespaceInfoDTO.meta.active,
                    namespaceInfoDTO.meta.index,
                    namespaceInfoDTO.meta.id,
                    namespaceInfoDTO.namespace.type,
                    namespaceInfoDTO.namespace.depth,
                    this.extractLevels(namespaceInfoDTO.namespace),
                    new NamespaceId(namespaceInfoDTO.namespace.parentId),
                    PublicAccount.createFromPublicKey(namespaceInfoDTO.namespace.owner, networkType),
                    new UInt64(namespaceInfoDTO.namespace.startHeight),
                    new UInt64(namespaceInfoDTO.namespace.endHeight),
                );
            }))));
    }

    /**
     * Gets array of NamespaceInfo for an account
     * @param address - Address
     * @param queryParams - (Optional) Query params
     * @returns Observable<NamespaceInfo[]>
     */
    public getNamespacesFromAccount(address: Address,
                                    queryParams?: QueryParams): Observable<NamespaceInfo[]> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.namespaceRoutesApi.getNamespacesFromAccount(address.plain(), queryParams != null ? queryParams : {})).pipe(
                map((namespaceInfosDTO) => {
                    return namespaceInfosDTO.map((namespaceInfoDTO) => {
                        return new NamespaceInfo(
                            namespaceInfoDTO.meta.active,
                            namespaceInfoDTO.meta.index,
                            namespaceInfoDTO.meta.id,
                            namespaceInfoDTO.namespace.type,
                            namespaceInfoDTO.namespace.depth,
                            this.extractLevels(namespaceInfoDTO.namespace),
                            new NamespaceId(namespaceInfoDTO.namespace.parentId),
                            PublicAccount.createFromPublicKey(namespaceInfoDTO.namespace.owner, networkType),
                            new UInt64(namespaceInfoDTO.namespace.startHeight),
                            new UInt64(namespaceInfoDTO.namespace.endHeight),
                        );
                    });
                }))));
    }

    /**
     * Gets array of NamespaceInfo for different account
     * @param addresses - Array of Address
     * @param queryParams - (Optional) Query params
     * @returns Observable<NamespaceInfo[]>
     */
    public getNamespacesFromAccounts(addresses: Address[],
                                     queryParams?: QueryParams): Observable<NamespaceInfo[]> {
        const publicKeysBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.namespaceRoutesApi.getNamespacesFromAccounts(publicKeysBody, queryParams != null ? queryParams : {})).pipe(
                map((namespaceInfosDTO) => {
                    return namespaceInfosDTO.map((namespaceInfoDTO) => {
                        return new NamespaceInfo(
                            namespaceInfoDTO.meta.active,
                            namespaceInfoDTO.meta.index,
                            namespaceInfoDTO.meta.id,
                            namespaceInfoDTO.namespace.type,
                            namespaceInfoDTO.namespace.depth,
                            this.extractLevels(namespaceInfoDTO.namespace),
                            new NamespaceId(namespaceInfoDTO.namespace.parentId),
                            PublicAccount.createFromPublicKey(namespaceInfoDTO.namespace.owner, networkType),
                            new UInt64(namespaceInfoDTO.namespace.startHeight),
                            new UInt64(namespaceInfoDTO.namespace.endHeight),
                        );
                    });
                }))));
    }

    /**
     * Gets array of NamespaceName for different namespaceIds
     * @param namespaceIds - Array of namespace ids
     * @returns Observable<NamespaceName[]>
     */
    public getNamespacesName(namespaceIds: NamespaceId[]): Observable<NamespaceName[]> {
        const namespaceIdsBody = {
            namespaceIds: namespaceIds.map((id) => id.toHex()),
        };
        return observableFrom(
            this.namespaceRoutesApi.getNamespacesNames(namespaceIdsBody)).pipe(map((namespaceNamesDTO) => {
            return namespaceNamesDTO.map((namespaceNameDTO) => {
                return new NamespaceName(
                    new NamespaceId(namespaceNameDTO.namespaceId),
                    namespaceNameDTO.name,
                    namespaceNameDTO.parentId ? new NamespaceId(namespaceNameDTO.parentId) : undefined,
                );
            });
        }));
    }

    private extractLevels(namespace: any): NamespaceId[] {
        const result: NamespaceId[] = [];
        if (namespace.level0) {
            result.push(new NamespaceId(namespace.level0));
        }
        if (namespace.level1) {
            result.push(new NamespaceId(namespace.level1));
        }
        if (namespace.level2) {
            result.push(new NamespaceId(namespace.level2));
        }
        return result;
    }
}
