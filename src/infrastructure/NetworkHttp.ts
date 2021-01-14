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

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NetworkConfigurationDTO, NetworkRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { AccountLinkNetworkProperties } from '../model/network/AccountLinkNetworkProperties';
import { AccountRestrictionNetworkProperties } from '../model/network/AccountRestrictionNetworkProperties';
import { AggregateNetworkProperties } from '../model/network/AggregateNetworkProperties';
import { ChainProperties } from '../model/network/ChainProperties';
import { HashLockNetworkProperties } from '../model/network/HashLockNetworkProperties';
import { MetadataNetworkProperties } from '../model/network/MetadataNetworkProperties';
import { MosaicNetworkProperties } from '../model/network/MosaicNetworkProperties';
import { MosaicRestrictionNetworkProperties } from '../model/network/MosaicRestrictionNetworkProperties';
import { MultisigNetworkProperties } from '../model/network/MultisigNetworkProperties';
import { NamespaceNetworkProperties } from '../model/network/NamespaceNetworkProperties';
import { NetworkConfiguration } from '../model/network/NetworkConfiguration';
import { NetworkName } from '../model/network/NetworkName';
import { NetworkProperties } from '../model/network/NetworkProperties';
import { NetworkType } from '../model/network/NetworkType';
import { PluginProperties } from '../model/network/PluginProperties';
import { RentalFees } from '../model/network/RentalFees';
import { SecretLockNetworkProperties } from '../model/network/SecretLockNetworkProperties';
import { TransactionFees } from '../model/network/TransactionFees';
import { TransferNetworkProperties } from '../model/network/TransferNetworkProperties';
import { NodeInfo } from '../model/node/NodeInfo';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { NetworkRepository } from './NetworkRepository';
import { NodeHttp } from './NodeHttp';

/**
 * Network http repository.
 *
 * @since 1.0
 */
export class NetworkHttp extends Http implements NetworkRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private readonly nodeHttp: NodeHttp;
    private readonly networkRoutesApi: NetworkRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.nodeHttp = new NodeHttp(url, fetchApi);
        this.networkRoutesApi = new NetworkRoutesApi(this.config());
    }

    /**
     * Get current network identifier.
     *
     * @return network identifier.
     */
    public getNetworkType(): Observable<NetworkType> {
        return this.nodeHttp.getNodeInfo().pipe(map((nodeInfo: NodeInfo) => nodeInfo.networkIdentifier));
    }

    /**
     * Get current network type name and description
     *
     * @return current network type name and description
     */
    public getNetworkName(): Observable<NetworkName> {
        return this.call(this.networkRoutesApi.getNetworkType(), (body) => new NetworkName(body.name, body.description));
    }

    /**
     * Returns the content from a catapult-server network configuration file (resources/config-network.properties).
     * To enable this feature, the REST setting \"network.propertiesFilePath\" must define where the file is located.
     * This is adjustable via the configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get the network properties
     */
    public getNetworkProperties(): Observable<NetworkConfiguration> {
        return this.call(this.networkRoutesApi.getNetworkProperties(), (body) => this.mapNetworkConfigurationDto(body));
    }

    /**
     * Returns the estimated effective rental fees for namespaces and mosaics. This endpoint is only available
     * if the REST instance has access to catapult-server ``resources/config-network.properties`` file.
     * To activate this feature, add the setting \"network.propertiesFilePath\" in the configuration file (rest/resources/rest.json).
     * @summary Get rental fees information
     */
    public getRentalFees(): Observable<RentalFees> {
        return this.call(
            this.networkRoutesApi.getRentalFees(),
            (body) =>
                new RentalFees(
                    UInt64.fromNumericString(body.effectiveRootNamespaceRentalFeePerBlock),
                    UInt64.fromNumericString(body.effectiveChildNamespaceRentalFee),
                    UInt64.fromNumericString(body.effectiveMosaicRentalFee),
                ),
        );
    }

    /**
     * Returns information about the average, median, highest and lower fee multiplier over the last
     * \"numBlocksTransactionFeeStats\". The setting \"numBlocksTransactionFeeStats\" is adjustable
     * via a configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get transaction fees information
     */
    public getTransactionFees(): Observable<TransactionFees> {
        return this.call(
            this.networkRoutesApi.getTransactionFees(),
            (body) =>
                new TransactionFees(
                    body.averageFeeMultiplier,
                    body.medianFeeMultiplier,
                    body.highestFeeMultiplier,
                    body.lowestFeeMultiplier,
                    body.minFeeMultiplier,
                ),
        );
    }

    /**
     * Map dto to sdk models
     * @param dto dto object returned from rest
     */
    private mapNetworkConfigurationDto(dto: NetworkConfigurationDTO): NetworkConfiguration {
        return new NetworkConfiguration(
            new NetworkProperties(
                dto.network.identifier,
                dto.network.nodeEqualityStrategy,
                dto.network.nemesisSignerPublicKey,
                dto.network.generationHashSeed,
                dto.network.epochAdjustment,
            ),
            new ChainProperties(
                dto.chain.enableVerifiableState,
                dto.chain.enableVerifiableReceipts,
                dto.chain.currencyMosaicId,
                dto.chain.harvestingMosaicId,
                dto.chain.blockGenerationTargetTime,
                dto.chain.blockTimeSmoothingFactor,
                dto.chain.blockFinalizationInterval,
                dto.chain.importanceGrouping,
                dto.chain.importanceActivityPercentage,
                dto.chain.maxRollbackBlocks,
                dto.chain.maxDifficultyBlocks,
                dto.chain.defaultDynamicFeeMultiplier,
                dto.chain.maxTransactionLifetime,
                dto.chain.maxBlockFutureTime,
                dto.chain.initialCurrencyAtomicUnits,
                dto.chain.maxMosaicAtomicUnits,
                dto.chain.totalChainImportance,
                dto.chain.minHarvesterBalance,
                dto.chain.maxHarvesterBalance,
                dto.chain.minVoterBalance,
                dto.chain.maxVotingKeysPerAccount,
                dto.chain.minVotingKeyLifetime,
                dto.chain.maxVotingKeyLifetime,
                dto.chain.harvestBeneficiaryPercentage,
                dto.chain.harvestNetworkPercentage,
                dto.chain.harvestNetworkFeeSinkAddress,
                dto.chain.blockPruneInterval,
                dto.chain.maxTransactionsPerBlock,
            ),
            new PluginProperties(
                new AccountLinkNetworkProperties(dto.plugins.accountlink?.dummy),
                new AggregateNetworkProperties(
                    dto.plugins.aggregate?.maxTransactionsPerAggregate,
                    dto.plugins.aggregate?.maxCosignaturesPerAggregate,
                    dto.plugins.aggregate?.enableStrictCosignatureCheck,
                    dto.plugins.aggregate?.enableBondedAggregateSupport,
                    dto.plugins.aggregate?.maxBondedTransactionLifetime,
                ),
                new HashLockNetworkProperties(dto.plugins.lockhash?.lockedFundsPerAggregate, dto.plugins.lockhash?.maxHashLockDuration),
                new SecretLockNetworkProperties(
                    dto.plugins.locksecret?.maxSecretLockDuration,
                    dto.plugins.locksecret?.minProofSize,
                    dto.plugins.locksecret?.maxProofSize,
                ),
                new MetadataNetworkProperties(dto.plugins.metadata?.maxValueSize),
                new MosaicNetworkProperties(
                    dto.plugins.mosaic?.maxMosaicsPerAccount,
                    dto.plugins.mosaic?.maxMosaicDuration,
                    dto.plugins.mosaic?.maxMosaicDivisibility,
                    dto.plugins.mosaic?.mosaicRentalFeeSinkAddress,
                    dto.plugins.mosaic?.mosaicRentalFee,
                ),
                new MultisigNetworkProperties(
                    dto.plugins.multisig?.maxMultisigDepth,
                    dto.plugins.multisig?.maxCosignatoriesPerAccount,
                    dto.plugins.multisig?.maxCosignedAccountsPerAccount,
                ),
                new NamespaceNetworkProperties(
                    dto.plugins.namespace?.maxNameSize,
                    dto.plugins.namespace?.maxChildNamespaces,
                    dto.plugins.namespace?.maxNamespaceDepth,
                    dto.plugins.namespace?.minNamespaceDuration,
                    dto.plugins.namespace?.maxNamespaceDuration,
                    dto.plugins.namespace?.namespaceGracePeriodDuration,
                    dto.plugins.namespace?.reservedRootNamespaceNames,
                    dto.plugins.namespace?.namespaceRentalFeeSinkAddress,
                    dto.plugins.namespace?.rootNamespaceRentalFeePerBlock,
                    dto.plugins.namespace?.childNamespaceRentalFee,
                ),
                new AccountRestrictionNetworkProperties(dto.plugins.restrictionaccount?.maxAccountRestrictionValues),
                new MosaicRestrictionNetworkProperties(dto.plugins.restrictionmosaic?.maxMosaicRestrictionValues),
                new TransferNetworkProperties(dto.plugins.transfer?.maxMessageSize),
            ),
        );
    }
}
