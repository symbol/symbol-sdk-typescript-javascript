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

import { TransactionType } from '../model/transaction/TransactionType';

/**
 * The Transaction filter class
 */
export class TransactionFilter {
    /**
     * Transaction type list
     */
    readonly types?: TransactionType[];

    /**
     * Constructor
     * @param {{
     *         type: TransactionType[],
     *     }} [args]
     */
    constructor(args?: {
        types?: TransactionType[],
    }) {
        if (args && args.types) { this.types = args.types; }
    }

    /**
     * Return comma separated list
     * @param types Transaction type list
     */
    public convertCSV(types?: TransactionType[]): string | undefined {
        if (!types || types.length === 0) {
            return undefined;
        } else {
            return types.map((t) => t.valueOf().toString()).join(',');
        }
    }
}
