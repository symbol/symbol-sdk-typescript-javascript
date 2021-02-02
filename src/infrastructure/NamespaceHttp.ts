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
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NamespaceDTO, NamespaceInfoDTO, NamespaceRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { Convert as convert, RawAddress as AddressLibrary } from '../core/format';
import { DtoMapping } from '../core/utils/DtoMapping';
import { AccountNames } from '../model/account/AccountNames';
import { Address } from '../model/account/Address';
import { MerkleStateInfo } from '../model/blockchain';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import { AddressAlias } from '../model/namespace/AddressAlias';
import { Alias } from '../model/namespace/Alias';
import { AliasType } from '../model/namespace/AliasType';
import { EmptyAlias } from '../model/namespace/EmptyAlias';
import { MosaicAlias } from '../model/namespace/MosaicAlias';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceInfo } from '../model/namespace/NamespaceInfo';
import { NamespaceName } from '../model/namespace/NamespaceName';
import { NetworkType } from '../model/network/NetworkType';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { NamespaceRepository } from './NamespaceRepository';
import { Page } from './Page';
import { NamespacePaginationStreamer } from './paginationStreamer';
import { NamespaceSearchCriteria } from './searchCriteria/NamespaceSearchCriteria';

/**
 * Namespace http repository.
 *
 * @since 1.0
 */
export class NamespaceHttp extends Http implements NamespaceRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client namespace routes api
     */
    private namespaceRoutesApi: NamespaceRoutesApi;

    /**
     * @internal
     * network type for the mappings.
     */
    private readonly networkTypeObservable: Observable<NetworkType>;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param networkType the network type.
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, networkType?: NetworkType | Observable<NetworkType>, fetchApi?: any) {
        super(url, fetchApi);
        this.namespaceRoutesApi = new NamespaceRoutesApi(this.config());
        this.networkTypeObservable = this.createNetworkTypeObservable(networkType);
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
        return this.call(this.namespaceRoutesApi.getAccountsNames(accountIdsBody), (body) =>
            body.accountNames.map(
                (accountName) =>
                    new AccountNames(
                        Address.createFromEncoded(accountName.address),
                        accountName.names.map((name) => {
                            return new NamespaceName(new NamespaceId(name), name);
                        }),
                    ),
            ),
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
        return this.call(this.namespaceRoutesApi.getMosaicsNames(mosaicIdsBody), (body) =>
            body.mosaicNames.map(
                (mosaic) =>
                    new MosaicNames(
                        new MosaicId(mosaic.mosaicId),
                        mosaic.names.map((name) => {
                            return new NamespaceName(new NamespaceId(name), name);
                        }),
                    ),
            ),
        );
    }

    /**
     * Gets the NamespaceInfo for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<NamespaceInfo>
     */
    public getNamespace(namespaceId: NamespaceId): Observable<NamespaceInfo> {
        return this.call(this.namespaceRoutesApi.getNamespace(namespaceId.toHex()), (body) => this.toNamespaceInfo(body));
    }

    /**
     * Gets a NamespaceInfo merkle for a given namespaceId
     * @param namespaceId - Namespace id
     * @returns Observable<MerkleStateInfo>
     */
    public getNamespaceMerkle(namespaceId: NamespaceId): Observable<MerkleStateInfo> {
        return this.call(this.namespaceRoutesApi.getNamespaceMerkle(namespaceId.toHex()), DtoMapping.toMerkleStateInfo);
    }

    /**
     * Gets array of NamespaceName for different namespaceIds
     * @param namespaceIds - Array of namespace ids
     * @returns Observable<NamespaceName[]>
     */
    public getNamespacesNames(namespaceIds: NamespaceId[]): Observable<NamespaceName[]> {
        const namespaceIdsBody = {
            namespaceIds: namespaceIds.map((id) => id.toHex()),
        };
        return this.call(this.namespaceRoutesApi.getNamespacesNames(namespaceIdsBody), (body) =>
            body.map((namespaceNameDTO) => {
                return new NamespaceName(
                    NamespaceId.createFromEncoded(namespaceNameDTO.id),
                    namespaceNameDTO.name,
                    namespaceNameDTO.parentId ? NamespaceId.createFromEncoded(namespaceNameDTO.parentId) : undefined,
                );
            }),
        );
    }

    /**
     * Gets an array of namespaces.
     * @param criteria - Namespace search criteria
     * @returns Observable<Page<NamespaceInfo>>
     */
    public search(criteria: NamespaceSearchCriteria): Observable<Page<NamespaceInfo>> {
        return this.call(
            this.namespaceRoutesApi.searchNamespaces(
                criteria.ownerAddress?.plain(),
                criteria.registrationType?.valueOf(),
                criteria.level0?.toHex(),
                criteria.aliasType?.valueOf(),
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
            ),
            (body) => super.toPage(body.pagination, body.data, this.toNamespaceInfo),
        );
    }

    public streamer(): NamespacePaginationStreamer {
        return new NamespacePaginationStreamer(this);
    }

    /**
     * Gets the MosaicId from a MosaicAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<MosaicId | null>
     */
    public getLinkedMosaicId(namespaceId: NamespaceId): Observable<MosaicId> {
        return this.networkTypeObservable.pipe(
            mergeMap(() =>
                this.call(this.namespaceRoutesApi.getNamespace(namespaceId.toHex()), (body) => {
                    const namespaceInfoDTO = body;
                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }
                    if (
                        namespaceInfoDTO.namespace.alias.type.valueOf() === AliasType.None ||
                        namespaceInfoDTO.namespace.alias.type.valueOf() !== AliasType.Mosaic ||
                        !namespaceInfoDTO.namespace.alias.mosaicId
                    ) {
                        throw new Error(`No mosaicId is linked to namespace '${namespaceInfoDTO.namespace.level0}'`);
                    }
                    return new MosaicId(namespaceInfoDTO.namespace.alias.mosaicId);
                }),
            ),
        );
    }

    /**
     * Gets the Address from a AddressAlias
     * @param namespaceId - the namespaceId of the namespace
     * @returns Observable<Address>
     */
    public getLinkedAddress(namespaceId: NamespaceId): Observable<Address> {
        return this.networkTypeObservable.pipe(
            mergeMap(() =>
                this.call(this.namespaceRoutesApi.getNamespace(namespaceId.toHex()), (body) => {
                    const namespaceInfoDTO = body;
                    if (namespaceInfoDTO.namespace === undefined) {
                        // forward catapult-rest error
                        throw namespaceInfoDTO;
                    }
                    if (
                        namespaceInfoDTO.namespace.alias.type.valueOf() === AliasType.None ||
                        namespaceInfoDTO.namespace.alias.type.valueOf() !== AliasType.Address ||
                        !namespaceInfoDTO.namespace.alias.address
                    ) {
                        throw new Error(`No address is linked to namespace '${namespaceInfoDTO.namespace.level0}'`);
                    }

                    const addressDecoded = namespaceInfoDTO.namespace.alias.address;
                    const address = AddressLibrary.addressToString(convert.hexToUint8(addressDecoded));
                    return Address.createFromRawAddress(address);
                }),
            ),
        );
    }

    /**
     * Get rest url
     */
    public getUrl(): string {
        return this.url;
    }

    /**
     * It maps from a NamespaceInfoDTO to NamespaceInfo
     * @param dto the dto
     */
    private toNamespaceInfo(dto: NamespaceInfoDTO): NamespaceInfo {
        return new NamespaceInfo(
            dto.namespace.version || 1,
            dto.meta.active,
            dto.meta.index,
            dto.id,
            dto.namespace.registrationType as number,
            dto.namespace.depth,
            NamespaceHttp.extractLevels(dto.namespace),
            NamespaceId.createFromEncoded(dto.namespace.parentId),
            Address.createFromEncoded(dto.namespace.ownerAddress),
            UInt64.fromNumericString(dto.namespace.startHeight),
            UInt64.fromNumericString(dto.namespace.endHeight),
            NamespaceHttp.extractAlias(dto.namespace),
        );
    }

    /**
     * Extract the namespace levels
     *
     * @internal
     * @param namespace
     */
    private static extractLevels(namespace: NamespaceDTO): NamespaceId[] {
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
     * @param namespace
     */
    private static extractAlias(namespace: NamespaceDTO): Alias {
        if (namespace.alias && namespace.alias.type.valueOf() === AliasType.Mosaic) {
            return new MosaicAlias(new MosaicId(namespace.alias.mosaicId!));
        } else if (namespace.alias && namespace.alias.type.valueOf() === AliasType.Address) {
            return new AddressAlias(Address.createFromEncoded(namespace.alias.address!));
        }
        return new EmptyAlias();
    }
}
