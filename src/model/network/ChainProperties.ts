/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License: string, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing: string, software
 * distributed under the License is distributed on an "AS IS" BASIS: string,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND: string, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Chain related configuration properties.
 */
export class ChainProperties {
    /**
     * @param enableVerifiableState - Set to true if block chain should calculate state hashes so that state is fully verifiable at each block.
     * @param enableVerifiableReceipts - Set to true if block chain should calculate receipts so that state changes are fully verifiable at each block.
     * @param currencyMosaicId - Mosaic id used as primary chain currency.
     * @param harvestingMosaicId - Mosaic id used to provide harvesting ability.
     * @param blockGenerationTargetTime - Targeted time between blocks.
     * @param blockTimeSmoothingFactor - A higher value makes the network more biased.
     * @param blockFinalizationInterval - Number of blocks between successive finalization attempts.
     * @param importanceGrouping - Number of blocks that should be treated as a group for importance purposes.
     * @param importanceActivityPercentage - Percentage of importance resulting from fee generation and beneficiary usage.
     * @param maxRollbackBlocks - Maximum number of blocks that can be rolled back.
     * @param maxDifficultyBlocks - Maximum number of blocks to use in a difficulty calculation.
     * @param defaultDynamicFeeMultiplier - Default multiplier to use for dynamic fees.
     * @param maxTransactionLifetime - Maximum lifetime a transaction can have before it expires.
     * @param maxBlockFutureTime - Maximum future time of a block that can be accepted.
     * @param initialCurrencyAtomicUnits - Initial currency atomic units available in the network.
     * @param maxMosaicAtomicUnits - Maximum atomic units (total-supply * 10 ^ divisibility) of a mosaic allowed in the network.
     * @param totalChainImportance - Total whole importance units available in the network.
     * @param minHarvesterBalance - Minimum number of harvesting mosaic atomic units needed for an account to be eligible for harvesting.
     * @param maxHarvesterBalance - Maximum number of harvesting mosaic atomic units needed for an account to be eligible for harvesting.
     * @param minVoterBalance - Minimum number of harvesting mosaic atomic units needed for an account to be eligible for voting.
     * @param maxVotingKeysPerAccount - Maximum number of voting keys that can be registered at once per account.
     * @param minVotingKeyLifetime - Minimum number of finalization rounds for which voting key can be registered.
     * @param maxVotingKeyLifetime - Maximum number of finalization rounds for which voting key can be registered.
     * @param harvestBeneficiaryPercentage - Percentage of the harvested fee that is collected by the beneficiary account.
     * @param harvestNetworkPercentage - Percentage of the harvested fee that is collected by network.
     * @param harvestNetworkFeeSinkAddress - The harvest network fee sink address.
     * @param blockPruneInterval - Number of blocks between cache pruning.
     * @param maxTransactionsPerBlock - Maximum number of transactions per block.
     */
    constructor(
        public readonly enableVerifiableState?: boolean,
        public readonly enableVerifiableReceipts?: boolean,
        public readonly currencyMosaicId?: string,
        public readonly harvestingMosaicId?: string,
        public readonly blockGenerationTargetTime?: string,
        public readonly blockTimeSmoothingFactor?: string,
        public readonly blockFinalizationInterval?: string,
        public readonly importanceGrouping?: string,
        public readonly importanceActivityPercentage?: string,
        public readonly maxRollbackBlocks?: string,
        public readonly maxDifficultyBlocks?: string,
        public readonly defaultDynamicFeeMultiplier?: string,
        public readonly maxTransactionLifetime?: string,
        public readonly maxBlockFutureTime?: string,
        public readonly initialCurrencyAtomicUnits?: string,
        public readonly maxMosaicAtomicUnits?: string,
        public readonly totalChainImportance?: string,
        public readonly minHarvesterBalance?: string,
        public readonly maxHarvesterBalance?: string,
        public readonly minVoterBalance?: string,
        public readonly maxVotingKeysPerAccount?: string,
        public readonly minVotingKeyLifetime?: string,
        public readonly maxVotingKeyLifetime?: string,
        public readonly harvestBeneficiaryPercentage?: string,
        public readonly harvestNetworkPercentage?: string,
        public readonly harvestNetworkFeeSinkAddress?: string,
        public readonly blockPruneInterval?: string,
        public readonly maxTransactionsPerBlock?: string,
    ) {}
}
