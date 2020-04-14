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
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';

/**
 * Abtract class for Aliases
 *
 * @since 0.10.2
 */
export abstract class Alias {
    /**
     * @internal
     * @param type - Alias type
     * @param address - Address for AddressAlias
     * @param mosaicId - MosaicId for MosaicAlias
     */
    constructor(
        /**
         * The alias type
         *
         * - 0 : No alias
         * - 1 : Mosaic id alias
         * - 2 : Address alias
         */
        public readonly type: number,

        /**
         * The alias address
         */
        public readonly address?: Address,

        /**
         * The alias mosaicId
         */
        public readonly mosaicId?: MosaicId,
    ) {}

    /**
     * @internal
     * Compares alias for equality.
     * @param alias - MosaicAlias
     * @return {boolean}
     */
    protected abstract equals(alias: any): boolean;
}
