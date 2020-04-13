/*
 * Copyright 2020 NEM
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

export class AggregateNetworkProperties {
    /**
     * @param maxTransactionsPerAggregate - Maximum number of transactions per aggregate.
     * @param maxCosignaturesPerAggregate - Maximum number of cosignatures per aggregate.
     * @param enableStrictCosignatureCheck - Set to true if cosignatures must exactly match component signers. Set to false if cosignatures should be validated externally.
     * @param enableBondedAggregateSupport - Set to true if bonded aggregates should be allowed. Set to false if bonded aggregates should be rejected.
     * @param maxBondedTransactionLifetime - Maximum lifetime a bonded transaction can have before it expires.
     */
    constructor(
        public readonly maxTransactionsPerAggregate?: string,
        public readonly maxCosignaturesPerAggregate?: string,
        public readonly enableStrictCosignatureCheck?: boolean,
        public readonly enableBondedAggregateSupport?: boolean,
        public readonly maxBondedTransactionLifetime?: string,
    ) {}
}
