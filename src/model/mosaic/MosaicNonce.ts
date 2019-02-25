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

/**
 * The mosaic nonce structure
 *
 * @since 1.0
 */
export class MosaicNonce {

    /**
     * Mosaic id
     */
    public readonly nonce: Uint8Array;

    /**
     * Create MosaicId from mosaic and namespace string id (ex: nem:xem or domain.subdom.subdome:token)
     * or id in form of array number (ex: [3646934825, 3576016193])
     *
     * @param id
     */
    constructor(nonce: Uint8Array) {
        if (nonce.length !== 4) {
            throw Error('Invalid byte size for nonce, should be 4 bytes but received ' + nonce.length);
        }

        this.nonce = nonce;
    }

    /**
     * @internal
     * @returns {[number,number]}
     */
    public toDTO(): Uint8Array {
        return this.nonce;
    }
}
