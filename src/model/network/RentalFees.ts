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

import { UInt64 } from '../UInt64';

/**
 * Rental Fees
 */
export class RentalFees {
    /**
     * @param effectiveRootNamespaceRentalFeePerBlock - Absolute amount. An amount of 123456789 (absolute) for a mosaic with divisibility 6 means 123.456789 (relative).
     * @param effectiveChildNamespaceRentalFee - Absolute amount. An amount of 123456789 (absolute) for a mosaic with divisibility 6 means 123.456789 (relative).
     * @param effectiveMosaicRentalFee - bsolute amount. An amount of 123456789 (absolute) for a mosaic with divisibility 6 means 123.456789 (relative).
     */
    constructor(
        public readonly effectiveRootNamespaceRentalFeePerBlock: UInt64,
        public readonly effectiveChildNamespaceRentalFee: UInt64,
        public readonly effectiveMosaicRentalFee: UInt64,
    ) {}
}
