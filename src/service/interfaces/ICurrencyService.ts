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
import { Observable } from 'rxjs';
import { Currency, MosaicId, NetworkCurrencies } from '../../model/mosaic';

/**
 * A service that allows you loading Network currencies for mosaic creation.
 */
export interface ICurrencyService {
    /**
     * This method loads the network currencies (main currency and harvest).
     */
    getNetworkCurrencies(): Observable<NetworkCurrencies>;

    /**
     * It creates the Currency objects from the mosaic ids by loading the mosaic infos and namespace aliases.
     *
     * @param mosaicIds the mosaic ids.
     */
    getCurrencies(mosaicIds: MosaicId[]): Observable<Currency[]>;
}
