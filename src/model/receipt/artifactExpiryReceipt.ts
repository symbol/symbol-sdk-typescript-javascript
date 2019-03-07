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
import { Receipt } from './receipt';
import { ReceiptType } from './receiptType';

/**
 * Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export class ArtifactExpiryReceipt extends Receipt {

    /**
     * Artifact expiry receipt
     * @param size
     * @param version
     * @param type
     * @param artifactId
     */
    constructor(size: number,
                version: number,
                type: ReceiptType,
                /**
                 * The id of the artifact (eg. namespace, mosaic).
                 */
                public readonly  artifactId: UInt64) {
        super(size, version, type);
    }
}
