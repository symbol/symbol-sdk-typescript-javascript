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
import { NetworkConfiguration } from '../model/network/NetworkConfiguration';
import { NetworkName } from '../model/network/NetworkName';
import { NetworkType } from '../model/network/NetworkType';
import { RentalFees } from '../model/network/RentalFees';
import { TransactionFees } from '../model/network/TransactionFees';

/**
 * Network interface repository.
 *
 * @since 1.0
 */
export interface NetworkRepository {
    /**
     * Get current network type name and description
     *
     * @return current network type name and description
     */
    getNetworkName(): Observable<NetworkName>;

    /**
     * Returns the content from a catapult-server network configuration file (resources/config-network.properties).
     * To enable this feature, the REST setting \"network.propertiesFilePath\" must define where the file is located.
     * This is adjustable via the configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get the network properties
     */
    getNetworkProperties(): Observable<NetworkConfiguration>;

    /**
     * Get current network type.
     * @return network type enum.
     */
    getNetworkType(): Observable<NetworkType>;

    /**
     * Returns the estimated effective rental fees for namespaces and mosaics. This endpoint is only available
     * if the REST instance has access to catapult-server ``resources/config-network.properties`` file.
     * To activate this feature, add the setting \"network.propertiesFilePath\" in the configuration file (rest/resources/rest.json).
     * @summary Get rental fees information
     */
    getRentalFees(): Observable<RentalFees>;

    /**
     * Returns the average, median, highest and lower fee multiplier over the last \"numBlocksTransactionFeeStats\".
     * The setting \"numBlocksTransactionFeeStats\" is adjustable via the configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get transaction fees information
     */
    getTransactionFees(): Observable<TransactionFees>;
}
