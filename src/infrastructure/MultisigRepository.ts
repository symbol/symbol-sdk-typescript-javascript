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
import { Address } from '../model/account/Address';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../model/account/MultisigAccountInfo';
import { MerkleStateInfo } from '../model/blockchain';

/**
 * Multisig interface repository.
 *
 * @since 1.0
 */
export interface MultisigRepository {
    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountInfo>
     */
    getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo>;

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountGraphInfo>
     */
    getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo>;

    /**
     * Gets a MultisigAccountInfo merkle for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MerkleStateInfo>
     */
    getMultisigAccountInfoMerkle(address: Address): Observable<MerkleStateInfo>;
}
