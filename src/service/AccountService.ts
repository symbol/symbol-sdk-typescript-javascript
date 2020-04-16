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
import { map, withLatestFrom } from 'rxjs/operators';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { AccountRepository } from '../infrastructure/AccountRepository';
import { NamespaceRepository } from '../infrastructure/NamespaceRepository';
import { Address } from '../model/account/Address';
import { mergeMap } from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { IAccountService } from './interfaces/IAccountService';
import { NamespaceInfoWithName } from '../model/namespace/NamespaceInfoWithName';
import { ResolvedMosaic } from '../model/mosaic/ResolvedMosaic';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { AccountInfoResolvedMosaic } from '../model/account/AccountInfoResolvedMosaic';
import { AccountInfo } from '../model/account/AccountInfo';
import { NamespaceName } from '../model/namespace/NamespaceName';
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
                const namespaceIds = this.getDistinctNamespaceIdFromAccountInfors(info);
                if (namespaceIds.length) {
                    return this.namespaceRepository.getNamespacesName(namespaceIds);
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
     * @param addresses Array of addresses
     * @returns {Observable<NamespaceInfoWithName[]>}
     */
    public accountNamespacesWithName(addresses: Address[]): Observable<NamespaceInfoWithName[]> {
        return this.namespaceRepository.getNamespacesFromAccounts(addresses).pipe(
            mergeMap((infos) => {
                const namespaceIds = infos.map((i) => i.id);
                return this.namespaceRepository.getNamespacesName(namespaceIds).pipe(
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
     * Resolve mosaics provides namespace names
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
     * Get distince list of namespacesIds from list of accountInfos
     * @param accountInfo List of account info
     * @returns {NamespaceId[]}
     */
    private getDistinctNamespaceIdFromAccountInfors(accountInfo: AccountInfo[]): NamespaceId[] {
        const namespaceIds: NamespaceId[] = [];
        accountInfo.forEach((info) => {
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
