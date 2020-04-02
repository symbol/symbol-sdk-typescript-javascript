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
import { Convert as convert } from '../../core/format';
import { NamespaceMosaicIdGenerator } from '../../infrastructure/transaction/NamespaceMosaicIdGenerator';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicNonce } from '../mosaic/MosaicNonce';
import { BigIntUtilities } from '../../core/format/BigIntUtilities';

/**
 * The mosaic id structure describes mosaic id
 *
 * @since 1.0
 */
export class MosaicId {

    /**
     * Mosaic id
     */
    public readonly id: bigint;

    /**
     * Create a MosaicId for given `nonce` MosaicNonce and `owner` PublicAccount.
     *
     * @param   nonce   {MosaicNonce}
     * @param   owner   {Account}
     * @return  {MosaicId}
     */
    public static createFromNonce(nonce: MosaicNonce, owner: PublicAccount): MosaicId {
        const mosaicId = NamespaceMosaicIdGenerator.mosaicId(nonce.toUint8Array(), convert.hexToUint8(owner.publicKey));
        return new MosaicId(BigIntUtilities.UInt64ToBigInt(mosaicId));
    }

    /**
     * Create MosaicId from mosaic id in form of array of number (ex: [3646934825, 3576016193])
     * or the hexadecimal notation thereof in form of a string.
     *
     * @param id
     */
    constructor(id: string | bigint) {
        if (id === undefined) {
            throw new Error('MosaicId undefined');
        }
        // tslint:disable-next-line: typeof-compare
        if (typeof id === 'bigint') {
            this.id = id;
        } else if (typeof id === 'string') {
            if (! /^[0-9A-Fa-f]{16}$/i.test(id)) {
                throw new Error('Invalid size for MosaicId hexadecimal notation');
            }
            // hexadecimal formatted MosaicId
            this.id = BigIntUtilities.HexToBigInt(id);
        }
    }

    /**
     * Get string value of id
     * @returns {string}
     */
    public toHex(): string {
        return BigIntUtilities.BigIntToHex(this.id);
    }

    /**
     * Compares mosaicIds for equality.
     *
     * @return boolean
     */
    public equals(other: any): boolean {
        if (other instanceof MosaicId) {
            return this.id === other.id;
        }
        return false;
    }

    /**
     * Create DTO object.
     */
    toDTO() {
        return this.toHex();
    }
}
