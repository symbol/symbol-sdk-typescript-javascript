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
import {
    AccountRestrictionAddressValueBuilder,
    AccountRestrictionFlagsDto,
    AccountRestrictionMosaicValueBuilder,
    AccountRestrictionsBuilder,
    AccountRestrictionsInfoBuilder,
    AccountRestrictionTransactionTypeValueBuilder,
    GeneratorUtils,
} from 'catbuffer-typescript';
import { isNumeric } from 'rxjs/internal-compatibility';
import { Address } from '../account';
import { MosaicId } from '../mosaic';
import { AccountRestriction } from './AccountRestriction';

/**
 * Account restrictions structure describes restriction information for an account.
 */
export class AccountRestrictions {
    /**
     * Constructor
     * @param version version
     * @param recordId the data base id.
     * @param address the target address
     * @param restrictions the restrictions
     */
    constructor(
        public readonly version: number,
        public readonly recordId: string,
        public readonly address: Address,
        public readonly restrictions: AccountRestriction[],
    ) {}

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const address = this.address.toBuilder();
        const restrictions: AccountRestrictionsInfoBuilder[] = this.restrictions.map((r) => {
            const addressRestrictions = new AccountRestrictionAddressValueBuilder(
                r.values.filter((v) => v instanceof Address).map((a) => (a as Address).toBuilder()),
            );
            const mosaicIdRestrictions = new AccountRestrictionMosaicValueBuilder(
                r.values.filter((v) => v instanceof MosaicId).map((a) => (a as MosaicId).toBuilder()),
            );
            const transactionTypeRestrictions = new AccountRestrictionTransactionTypeValueBuilder(
                r.values.filter((v) => isNumeric(v)).map((a) => a as number),
            );
            return new AccountRestrictionsInfoBuilder(
                GeneratorUtils.toFlags(AccountRestrictionFlagsDto, r.restrictionFlags),
                addressRestrictions,
                mosaicIdRestrictions,
                transactionTypeRestrictions,
            );
        });

        return new AccountRestrictionsBuilder(this.version, address, restrictions).serialize();
    }
}
