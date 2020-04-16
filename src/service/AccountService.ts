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

import { Observable, of, from } from 'rxjs';
import { map, flatMap, toArray } from 'rxjs/operators';
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
     * @param address Address
     */
    public accountInfoWithResolvedMosaic(address: Address): Observable<AccountInfoResolvedMosaic> {
        return this.accountRepository.getAccountInfo(address).pipe(
            mergeMap((info) => {
                return this.resolveMosaics(info.mosaics).pipe(
                    map((resolved) => {
                        return DtoMapping.assign(info, { resolvedMosaics: resolved });
                    }),
                );
            }),
        );
    }

    /**
     * Get namespace info for account with namespace name
     * @param address Address
     * @returns {Observable<NamespaceInfoWithName[]>}
     */
    public accountNamespacesWithName(address: Address): Observable<NamespaceInfoWithName[]> {
        return this.namespaceRepository.getNamespacesFromAccount(address).pipe(
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
     */
    private resolveMosaics(mosaics: Mosaic[]): Observable<ResolvedMosaic[]> {
        return from(mosaics)
            .pipe(
                flatMap((mosaic) => {
                    if (mosaic.id instanceof MosaicId) {
                        return of(mosaic as ResolvedMosaic);
                    } else {
                        return this.namespaceRepository.getNamespacesName([mosaic.id as NamespaceId]).pipe(
                            flatMap((namespaceName) => {
                                if (!namespaceName.length) {
                                    return of(mosaic as ResolvedMosaic);
                                }
                                return of(DtoMapping.assign(mosaic, { namespaceName: namespaceName[0] }));
                            }),
                        );
                    }
                }),
            )
            .pipe(toArray());
    }
}
