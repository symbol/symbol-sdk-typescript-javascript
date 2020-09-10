/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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

import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { LockHashAlgorithm } from './LockHashAlgorithm';

/**
 * Secret lock information
 */
export class SecretLockInfo {
    constructor(
        /**
         * The stored database id.
         */
        public readonly recordId: string,
        /**
         * Owner's address.
         */
        public readonly ownerAddress: Address,
        /**
         * Locked moasic id.
         */
        public readonly mosaicId: MosaicId,
        /**
         * Locked fund amount.
         */
        public readonly amount: UInt64,
        /**
         * Block height of the lock expires.
         */
        public readonly endHeight: UInt64,
        /**
         * Current lock status.
         */
        public readonly status: number,
        /**
         * The lock hash algorithm.
         */
        public readonly hashAlgorithm: LockHashAlgorithm,
        /**
         * The lock secret.
         */
        public readonly secret: string,
        /**
         * The recipient's address.
         */
        public readonly recipientAddress: Address,
        /**
         * The composite hash.
         */
        public readonly compositeHash: string,
    ) {}
}
