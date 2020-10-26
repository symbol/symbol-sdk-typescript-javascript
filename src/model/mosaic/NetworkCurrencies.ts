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

import { Currency } from './Currency';

/**
 * Object holding the symbol network currencies, main and harvest.
 */
export class NetworkCurrencies {
    /**
     * The pre-configured public currencies for easier offline access.
     */
    public static readonly PUBLIC = new NetworkCurrencies(Currency.PUBLIC, Currency.PUBLIC);

    /**
     * Constructor
     *
     * @param currency the network main currency.
     * @param harvest the network harvest currency.
     */
    constructor(public readonly currency: Currency, public readonly harvest: Currency) {}
}
