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

import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

/**
 * An abstract transaction class that serves as the base class of all receipts.
 */
export abstract class Receipt {
    /**
     * @constructor
     * @param size
     * @param version
     * @param type
     */
    constructor(
        /**
         * The receipt version.
         */
        public readonly version: ReceiptVersion,
        /**
         * The receipt type.
         */
        public readonly type: ReceiptType,
        /**
         * The receipt size.
         */
        public readonly size?: number,
    ) {}

    /**
     * @internal
     * Generate buffer
     * @return {Uint8Array}
     */
    abstract serialize(): Uint8Array;
}
