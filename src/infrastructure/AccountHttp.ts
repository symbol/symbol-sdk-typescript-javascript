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
import { AccountInfoDTO, AccountRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { AccountInfo } from '../model/account/AccountInfo';
import { AccountKey } from '../model/account/AccountKey';
import { ActivityBucket } from '../model/account/ActivityBucket';
import { Address } from '../model/account/Address';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { UInt64 } from '../model/UInt64';
import { AccountRepository } from './AccountRepository';
import { Http } from './Http';

/**
 * Account http repository.
 *
 * @since 1.0
 */
export class AccountHttp extends Http implements AccountRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private accountRoutesApi: AccountRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.accountRoutesApi = new AccountRoutesApi(this.config());
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address): Observable<AccountInfo> {
        return this.call(this.accountRoutesApi.getAccountInfo(address.plain()), (body) => this.toAccountInfo(body));
    }

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    public getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        return this.call(this.accountRoutesApi.getAccountsInfo(accountIds), (body) => body.map(this.toAccountInfo));
    }

    /**
     * This method maps a AccountInfoDTO from rest to the SDK's AccountInfo model object.
     *
     * @internal
     * @param {AccountInfoDTO} dto AccountInfoDTO the dto object from rest.
     * @returns AccountInfo model
     */
    private toAccountInfo(dto: AccountInfoDTO): AccountInfo {
        return new AccountInfo(
            Address.createFromEncoded(dto.account.address),
            UInt64.fromNumericString(dto.account.addressHeight),
            dto.account.publicKey,
            UInt64.fromNumericString(dto.account.publicKeyHeight),
            dto.account.accountType.valueOf(),
            dto.account.supplementalPublicKeys.map((key) => new AccountKey(key.keyType.valueOf(), key.key)),
            dto.account.activityBuckets.map((bucket) => {
                return new ActivityBucket(
                    UInt64.fromNumericString(bucket.startHeight),
                    UInt64.fromNumericString(bucket.totalFeesPaid),
                    bucket.beneficiaryCount,
                    UInt64.fromNumericString(bucket.rawScore),
                );
            }),
            dto.account.mosaics.map((mosaicDTO) => new Mosaic(new MosaicId(mosaicDTO.id), UInt64.fromNumericString(mosaicDTO.amount))),
            UInt64.fromNumericString(dto.account.importance),
            UInt64.fromNumericString(dto.account.importanceHeight),
        );
    }
}
