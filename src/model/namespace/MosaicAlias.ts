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
import { MosaicId } from '../mosaic/MosaicId';
import { Alias } from './Alias';
import { AliasType } from './AliasType';

/**
 * The MosaicAlias structure describe mosaic aliases
 *
 * @since 0.10.2
 */
export class MosaicAlias extends Alias {
    /**
     * Create AddressAlias object
     * @param mosaicId
     */
    constructor(
        /**
         * The alias address
         */
        public readonly mosaicId: MosaicId,
    ) {
        super(AliasType.Mosaic, undefined, mosaicId);
    }

    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    public equals(alias: any): boolean {
        if (alias instanceof MosaicAlias) {
            return this.mosaicId.equals(alias.mosaicId);
        }
        return false;
    }

    /**
     * Get string value of mosaicId
     * @returns {string}
     */
    public toHex(): string {
        return this.mosaicId.toHex();
    }
}
