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

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { Convert as convert } from '../core/format/Convert';
import { RawAddress as AddressLibrary } from '../core/format/RawAddress';
import {Address} from '../model/account/Address';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {AddressAlias} from '../model/namespace/AddressAlias';
import {Alias} from '../model/namespace/Alias';
import {AliasType} from '../model/namespace/AliasType';
import {EmptyAlias} from '../model/namespace/EmptyAlias';
import {MosaicAlias} from '../model/namespace/MosaicAlias';
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
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
    }

    /**
     * Gets the NamespaceInfo for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<NamespaceInfo>
     */
    public getNamespace(namespaceId: NamespaceId): Observable<NamespaceInfo> {
        const postBody = null;

        // verify the required parameter 'namespaceId' is set
        if (namespaceId === undefined || namespaceId === null) {
            throw new Error('Missing the required parameter \'namespaceId\' when calling getNamespace');
        }

        const pathParams = {
            namespaceId: namespaceId.toHex(),
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];
        const response = this.apiClient.callApi(
            '/namespace/{namespaceId}', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(map((namespaceInfoDTO: any) => {
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
                    this.extractAlias(namespaceInfoDTO.namespace),
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
        const postBody = null;
        const accountId = address.plain();
        // verify the required parameter 'accountId' is set
        if (accountId === undefined || accountId === null) {
            throw new Error('Missing the required parameter \'accountId\' when calling getNamespacesFromAccount');
        }
        const pathParams = {
            accountId,
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{accountId}/namespaces', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(
                map((namespaceInfosDTO: any) => {
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
                            this.extractAlias(namespaceInfoDTO.namespace),
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
        const accountsIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        const postBody = accountsIds;

        // verify the required parameter 'accountsIds' is set
        if (accountsIds === undefined || accountsIds === null) {
            throw new Error('Missing the required parameter \'accountsIds\' when calling getNamespacesFromAccounts');
        }

        const pathParams = {
        };

        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/namespaces', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(
                map((namespaceInfosDTO: any) => {
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
                            this.extractAlias(namespaceInfoDTO.namespace),
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
        const postBody = namespaceIdsBody;

        // verify the required parameter 'accountsIds' is set
        if (namespaceIdsBody === undefined || namespaceIdsBody === null) {
            throw new Error('Missing the required parameter \'accountsIds\' when calling getNamespacesNames');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/namespace/names', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((namespaceNamesDTO: any) => {
            return namespaceNamesDTO.map((namespaceNameDTO) => {
                return new NamespaceName(
                    new NamespaceId(namespaceNameDTO.namespaceId),
                    namespaceNameDTO.name,
                    namespaceNameDTO.parentId ? new NamespaceId(namespaceNameDTO.parentId) : undefined,
                );
            });
        }));
    }

    /**
     * Gets the MosaicId from a MosaicAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<MosaicId | null>
     */
    public getLinkedMosaicId(namespaceId: NamespaceId): Observable<MosaicId> {
        // verify the required parameter 'namespaceId' is set
        if (namespaceId === undefined || namespaceId === null) {
            throw new Error('Missing the required parameter \'namespaceId\' when calling getLinkedMosaicId');
        }

        const pathParams = {
            namespaceId: namespaceId.toHex(),
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];
        const response = this.apiClient.callApi(
            '/namespace/{namespaceId}', 'GET',
            pathParams, queryParams, headerParams, formParams, null,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(
                map((namespaceInfoDTO: any) => {
                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }

                    if (namespaceInfoDTO.namespace.alias.type === AliasType.None
                        || namespaceInfoDTO.namespace.alias.type !== AliasType.Mosaic) {
                        throw new Error('No mosaicId is linked to namespace \'' + namespaceInfoDTO.namespace.name + '\'');
                    }

                    return new MosaicId(namespaceInfoDTO.namespace.alias.mosaicId);
                }))));
    }

    /**
     * Gets the Address from a AddressAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<Address>
     */
    public getLinkedAddress(namespaceId: NamespaceId): Observable<Address> {
        // verify the required parameter 'namespaceId' is set
        if (namespaceId === undefined || namespaceId === null) {
            throw new Error('Missing the required parameter \'namespaceId\' when calling getNamespace');
        }

        const pathParams = {
            namespaceId: namespaceId.toHex(),
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];
        const response = this.apiClient.callApi(
            '/namespace/{namespaceId}', 'GET',
            pathParams, queryParams, headerParams, formParams, null,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(
                map((namespaceInfoDTO: any) => {

                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }

                    if (namespaceInfoDTO.namespace.alias.type === AliasType.None
                        || namespaceInfoDTO.namespace.alias.type !== AliasType.Address) {
                        throw new Error('No address is linked to namespace \'' + namespaceInfoDTO.namespace.name + '\'');
                    }

                    const addressDecoded = namespaceInfoDTO.namespace.alias.address;
                    const address = AddressLibrary.addressToString(convert.hexToUint8(addressDecoded));
                    return Address.createFromRawAddress(address);
                }))));
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

    /**
     * Extract the alias from a namespace
     *
     * @internal
     * @access private
     * @param namespace
     */
    private extractAlias(namespace: any): Alias {
        if (namespace.alias && namespace.alias.type === AliasType.Mosaic) {
            return new MosaicAlias(namespace.alias.type, namespace.alias.mosaicId);
        } else if (namespace.alias && namespace.alias.type === AliasType.Address) {
            return new AddressAlias(namespace.alias.type, namespace.alias.address);
        }

        return new EmptyAlias();
    }
}
