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

import { ResolutionStatement } from './ResolutionStatement';
import { TransactionStatement } from './TransactionStatement';

export class Statement {

    /**
     * Receipt - transaction statement object
     * @param transactionStatements - The transaction statements.
     * @param addressResolutionStatements - The address resolution statements.
     * @param mosaicResolutionStatements - The mosaic resolution statements.
     */
    constructor(
                /**
                 * The transaction statements.
                 */
                public readonly transactionStatements: TransactionStatement[],
                /**
                 * The address resolution statements.
                 */
                public readonly addressResolutionStatements: ResolutionStatement[],
                /**
                 * The mosaic resolution statements.
                 */
                public readonly mosaicResolutionStatements: ResolutionStatement[]) {
    }
}
