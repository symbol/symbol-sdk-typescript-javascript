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
import { RawAddress } from '../../core/format/RawAddress';
import { Address } from '../account/Address';
import { Alias } from './Alias';
import { AliasType } from './AliasType';

/**
 * The AddressAlias structure describes address aliases
 *
 * @since 0.10.2
 */
export class AddressAlias extends Alias {
    /**
     * Create AddressAlias object
     * @param content
     */
    constructor(
        /**
         * The alias address
         */
        public readonly address: Address,
    ) {
        super(AliasType.Address, address, undefined);
    }

    /**
     * Compares AddressAlias for equality.
     *
     * @return boolean
     */
    public equals(alias: any): boolean {
        if (alias instanceof AddressAlias) {
            return this.address.equals(alias.address);
        }
        return false;
    }

    /**
     * Generate alias buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        return RawAddress.stringToAddress(this.address.plain());
    }
}
