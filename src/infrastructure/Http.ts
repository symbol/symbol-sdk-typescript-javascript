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

import {Observable, of as observableOf} from 'rxjs';
import {map} from 'rxjs/operators';
import {NetworkType} from '../model/blockchain/NetworkType';
import {NetworkHttp} from './NetworkHttp';
const ApiClient = require('./ApiClient').default;

/**
 * Http extended by all http services
 */
export abstract class Http {
    /**
     * @internal
     */
    protected readonly apiClient;

    private networkHttp: NetworkHttp;
    private networkType: NetworkType;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        this.apiClient = new ApiClient();
        if (url) {
            this.apiClient.basePath = url;
        }
        if (networkHttp) {
            this.networkHttp = networkHttp;
        }
    }

    getNetworkTypeObservable(): Observable<NetworkType> {
        let networkTypeResolve;
        if (this.networkType == null) {
            networkTypeResolve = this.networkHttp.getNetworkType().pipe(map((networkType) => {
                this.networkType = networkType;
                return networkType;
            }));
        } else {
            networkTypeResolve = observableOf(this.networkType);
        }
        return networkTypeResolve;
    }
}
