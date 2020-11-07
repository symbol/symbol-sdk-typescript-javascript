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

import { Observable, of } from 'rxjs';
import { map, mergeMap, toArray, withLatestFrom } from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { AccountRepository } from '../infrastructure/AccountRepository';
import { NamespaceRepository } from '../infrastructure/NamespaceRepository';
import { NamespacePaginationStreamer } from '../infrastructure/paginationStreamer/NamespacePaginationStreamer';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { AccountInfo } from '../model/account/AccountInfo';
import { AccountInfoResolvedMosaic } from '../model/account/AccountInfoResolvedMosaic';
import { Address } from '../model/account/Address';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { ResolvedMosaic } from '../model/mosaic/ResolvedMosaic';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceInfoWithName } from '../model/namespace/NamespaceInfoWithName';
import { NamespaceName } from '../model/namespace/NamespaceName';
import { IAccountService } from './interfaces/IAccountService';

/**
 * Account Service
 */
export class AccountService implements IAccountService {
    private readonly accountRepository: AccountRepository;

    private readonly namespaceRepository: NamespaceRepository;

    /**
     * Constructor
     * @param repositoryFactory
     */
    constructor(public readonly repositoryFactory: RepositoryFactory) {
        this.accountRepository = repositoryFactory.createAccountRepository();
        this.namespaceRepository = repositoryFactory.createNamespaceRepository();
    }

    /**
     * Get account info with resolved mosaic
     * @param addresses Array of addresses
     */
    public accountInfoWithResolvedMosaic(addresses: Address[]): Observable<AccountInfoResolvedMosaic[]> {
        const accountInfoObservable = this.accountRepository.getAccountsInfo(addresses);
        const distinctNames = accountInfoObservable.pipe(
            mergeMap((info) => {
                const namespaceIds = this.getDistinctNamespaceIdFromAccountInfos(info);
                if (namespaceIds.length) {
                    return this.namespaceRepository.getNamespacesNames(namespaceIds);
                }
                return of([]);
            }),
        );

        return accountInfoObservable.pipe(
            withLatestFrom(distinctNames),
            map(([infos, names]) => {
                return infos.map((info) => {
                    const resolved = this.resolveMosaics(info.mosaics, names);
                    return DtoMapping.assign(info, { resolvedMosaics: resolved });
                });
            }),
        );
    }

    /**
     * Get namespace info for account with namespace name
     * @param addresses Namespace owner address
     * @returns {Observable<NamespaceInfoWithName[]>}
     */
    public accountNamespacesWithName(address: Address): Observable<NamespaceInfoWithName[]> {
        const steatmer = new NamespacePaginationStreamer(this.namespaceRepository).search({ ownerAddress: address }).pipe(toArray());
        return steatmer.pipe(
            mergeMap((infos) => {
                const namespaceIds = infos.map((i) => i.id);
                return this.namespaceRepository.getNamespacesNames(namespaceIds).pipe(
                    map((resolved) => {
                        return infos.map((info) => {
                            const name = resolved.find((r) => r.namespaceId.equals(info.id));
                            return DtoMapping.assign(info, { namespaceName: name?.name });
                        });
                    }),
                );
            }),
        );
    }

    /**
     * Resolve mosaics provided namespace names
     * @param mosaics unresolved mosaics
     * @return {ResolvedMosaic[]}
     */
    private resolveMosaics(mosaics: Mosaic[], names: NamespaceName[]): ResolvedMosaic[] {
        return mosaics.map((mosaic) => {
            if (mosaic.id instanceof MosaicId) {
                return mosaic as ResolvedMosaic;
            } else {
                const name = names.find((f) => f.namespaceId.equals(mosaic.id));
                if (name) {
                    return DtoMapping.assign(mosaic, { namespaceName: name });
                } else {
                    return mosaic as ResolvedMosaic;
                }
            }
        });
    }

    /**
     * Get distinct list of namespaces ids from list of account infos
     * @param accountInfos List of account infos
     * @returns {NamespaceId[]}
     */
    private getDistinctNamespaceIdFromAccountInfos(accountInfos: AccountInfo[]): NamespaceId[] {
        const namespaceIds: NamespaceId[] = [];
        accountInfos.forEach((info) => {
            info.mosaics.forEach((mosaic) => {
                if (mosaic.id instanceof NamespaceId) {
                    if (!namespaceIds.find((n) => n.equals(mosaic.id))) {
                        namespaceIds.push(mosaic.id);
                    }
                }
            });
        });
        return namespaceIds;
    }
}
