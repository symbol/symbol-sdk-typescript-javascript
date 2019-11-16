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
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Convert as convert, RawAddress as AddressLibrary} from '../core/format';
import { AccountNames } from '../model/account/AccountNames';
import {Address} from '../model/account/Address';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import {AddressAlias} from '../model/namespace/AddressAlias';
import {Alias} from '../model/namespace/Alias';
import {AliasType} from '../model/namespace/AliasType';
import {EmptyAlias} from '../model/namespace/EmptyAlias';
import {MosaicAlias} from '../model/namespace/MosaicAlias';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {NamespaceInfo} from '../model/namespace/NamespaceInfo';
import {NamespaceName} from '../model/namespace/NamespaceName';
import {UInt64} from '../model/UInt64';
import { NamespaceRoutesApi } from './api';
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
        super(networkHttp);
        this.namespaceRoutesApi = new NamespaceRoutesApi(url);
    }

    /**
     * Returns friendly names for array of addresses.
     * @summary Get readable names for a set of array of addresses
     * @param addresses - Array of addresses
     */
    public getAccountsNames(addresses: Address[]): Observable<AccountNames[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.namespaceRoutesApi.getAccountsNames(accountIdsBody)).pipe(
                map(({body}) => body.accountNames.map((accountName) => {
                    return new AccountNames(
                        Address.createFromEncoded(accountName.address),
                        accountName.names.map((name) => {
                            return new NamespaceName(new NamespaceId(name), name);
                        }),
                    );
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get readable names for a set of mosaics
     * Returns friendly names for mosaics.
     * @param mosaicIds - Array of mosaic ids
     * @return Observable<MosaicNames[]>
     */
    public getMosaicsNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return observableFrom(
            this.namespaceRoutesApi.getMosaicsNames(mosaicIdsBody)).pipe(
                map(({body}) => body.mosaicNames.map((mosaic) => {
                    return new MosaicNames(
                        new MosaicId(mosaic.mosaicId),
                        mosaic.names.map((name) => {
                        return new NamespaceName(new NamespaceId(name), name);
                        }),
                    );
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
            );
    }

    /**
     * Gets the NamespaceInfo for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<NamespaceInfo>
     */
    public getNamespace(namespaceId: NamespaceId): Observable<NamespaceInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.namespaceRoutesApi.getNamespace(namespaceId.toHex())).pipe(
                    map(({body}) => new NamespaceInfo(
                            body.meta.active,
                            body.meta.index,
                            body.meta.id,
                            body.namespace.registrationType as number,
                            body.namespace.depth,
                            this.extractLevels(body.namespace),
                            NamespaceId.createFromEncoded(body.namespace.parentId),
                            PublicAccount.createFromPublicKey(body.namespace.ownerPublicKey, networkType),
                            UInt64.fromNumericString(body.namespace.startHeight),
                            UInt64.fromNumericString(body.namespace.endHeight),
                            this.extractAlias(body.namespace),
                        )),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                ),
            ),
        );
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
                this.namespaceRoutesApi.getNamespacesFromAccount(address.plain(),
                                                                 this.queryParams(queryParams).pageSize,
                                                                 this.queryParams(queryParams).id,
                                                                 this.queryParams(queryParams).order)).pipe(
                map(({body}) => body.namespaces.map((namespaceInfoDTO) => {
                    return new NamespaceInfo(
                        namespaceInfoDTO.meta.active,
                        namespaceInfoDTO.meta.index,
                        namespaceInfoDTO.meta.id,
                        namespaceInfoDTO.namespace.registrationType as number,
                        namespaceInfoDTO.namespace.depth,
                        this.extractLevels(namespaceInfoDTO.namespace),
                        NamespaceId.createFromEncoded(namespaceInfoDTO.namespace.parentId),
                        PublicAccount.createFromPublicKey(namespaceInfoDTO.namespace.ownerPublicKey, networkType),
                        UInt64.fromNumericString(namespaceInfoDTO.namespace.startHeight),
                        UInt64.fromNumericString(namespaceInfoDTO.namespace.endHeight),
                        this.extractAlias(namespaceInfoDTO.namespace),
                    );
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
            ),
        ));
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
                this.namespaceRoutesApi.getNamespacesFromAccounts(publicKeysBody)).pipe(
                map(({body}) => body.namespaces.map((namespaceInfoDTO) => {
                    return new NamespaceInfo(
                        namespaceInfoDTO.meta.active,
                        namespaceInfoDTO.meta.index,
                        namespaceInfoDTO.meta.id,
                        namespaceInfoDTO.namespace.registrationType as number,
                        namespaceInfoDTO.namespace.depth,
                        this.extractLevels(namespaceInfoDTO.namespace),
                        NamespaceId.createFromEncoded(namespaceInfoDTO.namespace.parentId),
                        PublicAccount.createFromPublicKey(namespaceInfoDTO.namespace.ownerPublicKey, networkType),
                        UInt64.fromNumericString(namespaceInfoDTO.namespace.startHeight),
                        UInt64.fromNumericString(namespaceInfoDTO.namespace.endHeight),
                        this.extractAlias(namespaceInfoDTO.namespace),
                    );
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
            ),
        ));
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
            this.namespaceRoutesApi.getNamespacesNames(namespaceIdsBody)).pipe(
                map(({body}) => body.map((namespaceNameDTO) => {
                    return new NamespaceName(
                        NamespaceId.createFromEncoded(namespaceNameDTO.id),
                        namespaceNameDTO.name,
                        namespaceNameDTO.parentId ? NamespaceId.createFromEncoded(namespaceNameDTO.parentId) : undefined,
                    );
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets the MosaicId from a MosaicAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<MosaicId | null>
     */
    public getLinkedMosaicId(namespaceId: NamespaceId): Observable<MosaicId> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap(() => observableFrom(
                this.namespaceRoutesApi.getNamespace(namespaceId.toHex())).pipe(
                map(({body}) => {
                    const namespaceInfoDTO = body;
                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }

                    if (namespaceInfoDTO.namespace.alias.type.valueOf() === AliasType.None
                        || namespaceInfoDTO.namespace.alias.type.valueOf() !== AliasType.Mosaic
                        || !namespaceInfoDTO.namespace.alias.mosaicId) {
                        throw new Error('No mosaicId is linked to namespace \'' + namespaceInfoDTO.namespace.level0 + '\'');
                    }
                    return new MosaicId(namespaceInfoDTO.namespace.alias.mosaicId);
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
            ),
        ));
    }

    /**
     * Gets the Address from a AddressAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<Address>
     */
    public getLinkedAddress(namespaceId: NamespaceId): Observable<Address> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap(() => observableFrom(
                this.namespaceRoutesApi.getNamespace(namespaceId.toHex())).pipe(
                map(({body}) => {
                    const namespaceInfoDTO = body;
                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }

                    if (namespaceInfoDTO.namespace.alias.type.valueOf() === AliasType.None
                        || namespaceInfoDTO.namespace.alias.type.valueOf() !== AliasType.Address
                        || !namespaceInfoDTO.namespace.alias.address) {
                        throw new Error('No address is linked to namespace \'' + namespaceInfoDTO.namespace.level0 + '\'');
                    }

                    const addressDecoded = namespaceInfoDTO.namespace.alias.address;
                    const address = AddressLibrary.addressToString(convert.hexToUint8(addressDecoded));
                    return Address.createFromRawAddress(address);
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
            ),
        ));
    }

    private extractLevels(namespace: any): NamespaceId[] {
        const result: NamespaceId[] = [];
        if (namespace.level0) {
            result.push(NamespaceId.createFromEncoded(namespace.level0));
        }
        if (namespace.level1) {
            result.push(NamespaceId.createFromEncoded(namespace.level1));
        }
        if (namespace.level2) {
            result.push(NamespaceId.createFromEncoded(namespace.level2));
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
            return new MosaicAlias(new MosaicId(namespace.alias.mosaicId));
        } else if (namespace.alias && namespace.alias.type === AliasType.Address) {
            return new AddressAlias(Address.createFromEncoded(namespace.alias.address));
        }

        return new EmptyAlias();
    }
}
