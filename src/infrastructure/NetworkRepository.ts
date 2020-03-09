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

import {Observable} from 'rxjs';
import { NetworkFees } from '../model/network/NetworkFees';
import { NetworkName } from '../model/network/NetworkName';
import {NetworkType} from '../model/network/NetworkType';

/**
 * Network interface repository.
 *
 * @since 1.0
 */
export interface NetworkRepository {

    /**
     * Get current network type.
     * @return network type enum.
     */
    getNetworkType(): Observable<NetworkType>;

    /**
     * Get current network type name and description
     *
     * @return current network type name and description
     */
    getNetworkName(): Observable<NetworkName>;

    /**
     * Returns information about the average, median, highest and lower fee multiplier over the last "numBlocksTransactionFeeStats".
     * @return the NetworkFees
     */
    getNetworkFees(): Observable<NetworkFees> ;

}
