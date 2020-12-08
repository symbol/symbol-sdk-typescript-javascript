/*
 * Copyright 2019 NEM
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
import { MultisigAccountInfoDTO, MultisigRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils';
import { Address } from '../model/account/Address';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../model/account/MultisigAccountInfo';
import { MerkleStateInfo } from '../model/blockchain';
import { Http } from './Http';
import { MultisigRepository } from './MultisigRepository';

/**
 * Multisig http repository.
 *
 * @since 1.0
 */
export class MultisigHttp extends Http implements MultisigRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private readonly multisigRoutesApi: MultisigRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.multisigRoutesApi = new MultisigRoutesApi(this.config());
    }

    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountInfo>
     */
    public getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
        return this.call(this.multisigRoutesApi.getAccountMultisig(address.plain()), (body) => this.toMultisigAccountInfo(body));
    }

    /**
     * Gets a MultisigAccountInfo merkle for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MerkleStateInfo>
     */
    public getMultisigAccountInfoMerkle(address: Address): Observable<MerkleStateInfo> {
        return this.call(this.multisigRoutesApi.getAccountMultisigMerkle(address.plain()), DtoMapping.toMerkleStateInfo);
    }

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountGraphInfo>
     */
    public getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo> {
        return this.call(this.multisigRoutesApi.getAccountMultisigGraph(address.plain()), (body) => {
            const multisigAccountGraphInfosDTO = body;
            const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
            multisigAccountGraphInfosDTO.map((multisigAccountGraphInfoDTO) => {
                multisigAccounts.set(
                    multisigAccountGraphInfoDTO.level,
                    multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                        return this.toMultisigAccountInfo(multisigAccountInfoDTO);
                    }),
                );
            });
            return new MultisigAccountGraphInfo(multisigAccounts);
        });
    }

    /**
     * It maps from MultisigAccountInfoDTO to MultisigAccountInfo
     * @param dto the DTO
     */
    private toMultisigAccountInfo(dto: MultisigAccountInfoDTO): MultisigAccountInfo {
        return new MultisigAccountInfo(
            dto.multisig.version || 1,
            Address.createFromEncoded(dto.multisig.accountAddress),
            dto.multisig.minApproval,
            dto.multisig.minRemoval,
            dto.multisig.cosignatoryAddresses.map((cosigner) => Address.createFromEncoded(cosigner)),
            dto.multisig.multisigAddresses.map((multisig) => Address.createFromEncoded(multisig)),
        );
    }
}
