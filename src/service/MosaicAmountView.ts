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

import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { UInt64 } from '../model/UInt64';

/**
 * Class representing mosaic view information with amount
 */
export class MosaicAmountView {
    /**
     * @param mosaicInfo
     * @param namespaceName
     * @param mosaicName
     * @param amount
     */
    constructor(
        /**
         * The mosaic information
         */
        public readonly mosaicInfo: MosaicInfo,
        /**
         * The amount of absolute mosaics we have
         */
        public readonly amount: UInt64,
    ) {}

    /**
     * Relative amount dividing amount by the divisibility
     * @returns {string}
     */
    public relativeAmount(): number {
        if (this.mosaicInfo.divisibility === 0) {
            return this.amount.compact();
        }
        return this.amount.compact() / Math.pow(10, this.mosaicInfo.divisibility);
    }

    /**
     * Namespace and mosaic description
     * @returns {string}
     */
    public fullName(): string {
        return this.mosaicInfo.id.toHex();
    }
}
