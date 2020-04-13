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
import { expect } from 'chai';
import * as http from 'http';
import {
    NetworkRoutesApi,
    NetworkTypeDTO,
    NodeInfoDTO,
    NodeRoutesApi,
    TransactionFeesDTO,
    RentalFeesDTO,
    NetworkConfigurationDTO,
    NetworkPropertiesDTO,
    NodeIdentityEqualityStrategy,
    ChainPropertiesDTO,
    PluginsPropertiesDTO,
    AccountLinkNetworkPropertiesDTO,
    AggregateNetworkPropertiesDTO,
    HashLockNetworkPropertiesDTO,
    SecretLockNetworkPropertiesDTO,
    MetadataNetworkPropertiesDTO,
    MosaicNetworkPropertiesDTO,
    MultisigNetworkPropertiesDTO,
    NamespaceNetworkPropertiesDTO,
    AccountRestrictionNetworkPropertiesDTO,
    MosaicRestrictionNetworkPropertiesDTO,
    TransferNetworkPropertiesDTO,
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { deepEqual } from 'assert';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { NetworkHttp } from '../../src/infrastructure/NetworkHttp';
import { NodeHttp } from '../../src/infrastructure/NodeHttp';
import { NetworkType } from '../../src/model/network/NetworkType';
import * as testResources from '../resource/TestResources';

describe('NetworkHttp', () => {
    const url = 'http://someHost';

    const response: http.IncomingMessage = mock();
    const nodeRoutesApi: NodeRoutesApi = mock();
    const networkRoutesApi: NetworkRoutesApi = mock();
    const nodeHttp = DtoMapping.assign(new NodeHttp(url), { nodeRoutesApi: instance(nodeRoutesApi) });
    const networkRepository = DtoMapping.assign(new NetworkHttp(url), {
        networkRoutesApi: instance(networkRoutesApi),
        nodeHttp,
    });

    before(() => {
        reset(response);
        reset(nodeRoutesApi);
        reset(networkRoutesApi);
    });

    it('getTransactionFees', async () => {
        const body = new TransactionFeesDTO();
        body.averageFeeMultiplier = 1;
        body.highestFeeMultiplier = 2;
        body.lowestFeeMultiplier = 3;
        body.medianFeeMultiplier = 4;

        when(networkRoutesApi.getTransactionFees()).thenReturn(Promise.resolve({ response, body }));

        const networkFees = await networkRepository.getTransactionFees().toPromise();
        expect(networkFees).to.be.not.null;
        expect(networkFees.averageFeeMultiplier).to.be.equals(1);
        expect(networkFees.highestFeeMultiplier).to.be.equals(2);
        expect(networkFees.lowestFeeMultiplier).to.be.equals(3);
        expect(networkFees.medianFeeMultiplier).to.be.equals(4);
    });

    it('getRentalFees', async () => {
        const body = new RentalFeesDTO();
        body.effectiveChildNamespaceRentalFee = '1';
        body.effectiveMosaicRentalFee = '2';
        body.effectiveRootNamespaceRentalFeePerBlock = '3';

        when(networkRoutesApi.getRentalFees()).thenReturn(Promise.resolve({ response, body }));

        const rentalFees = await networkRepository.getRentalFees().toPromise();
        expect(rentalFees).to.be.not.null;
        expect(rentalFees.effectiveChildNamespaceRentalFee.toString()).to.be.equals('1');
        expect(rentalFees.effectiveMosaicRentalFee.toString()).to.be.equals('2');
        expect(rentalFees.effectiveRootNamespaceRentalFeePerBlock.toString()).to.be.equals('3');
    });

    it('getNetworkType', async () => {
        const body = new NodeInfoDTO();
        body.networkIdentifier = NetworkType.MIJIN_TEST;

        when(nodeRoutesApi.getNodeInfo()).thenReturn(Promise.resolve({ response, body }));

        const networkType = await networkRepository.getNetworkType().toPromise();
        expect(networkType).to.be.equals(NetworkType.MIJIN_TEST);
    });

    it('getNetworkName', async () => {
        const body = new NetworkTypeDTO();
        body.name = 'Some Name';
        body.description = 'Some Description';

        when(networkRoutesApi.getNetworkType()).thenReturn(Promise.resolve({ response, body }));

        const networkName = await networkRepository.getNetworkName().toPromise();
        expect(networkName.description).to.be.equals(body.description);
        expect(networkName.name).to.be.equals(body.name);
    });

    it('getNetworkProperties', async () => {
        const body = new NetworkConfigurationDTO();

        const network = new NetworkPropertiesDTO();
        network.identifier = 'id';
        network.nodeEqualityStrategy = NodeIdentityEqualityStrategy.Host;
        network.publicKey = 'pubKey';
        network.generationHash = 'genHash';
        network.epochAdjustment = '123456';

        const chain = new ChainPropertiesDTO();
        chain.blockGenerationTargetTime = '1';
        chain.blockPruneInterval = '1';
        chain.blockTimeSmoothingFactor = '1';
        chain.currencyMosaicId = '1111111111111111';
        chain.defaultDynamicFeeMultiplier = '1';
        chain.enableVerifiableReceipts = true;
        chain.enableVerifiableState = true;
        chain.harvestBeneficiaryPercentage = '1';
        chain.harvestingMosaicId = '2222222222222222';
        chain.importanceActivityPercentage = '1';
        chain.importanceGrouping = '1';
        chain.initialCurrencyAtomicUnits = '1';
        chain.maxBlockFutureTime = '1';
        chain.maxDifficultyBlocks = '1';
        chain.maxHarvesterBalance = '1';
        chain.maxMosaicAtomicUnits = '1';
        chain.maxRollbackBlocks = '1';
        chain.maxTransactionLifetime = '1';
        chain.maxTransactionsPerBlock = '1';
        chain.minHarvesterBalance = '1';
        chain.totalChainImportance = '1';

        const plugin = new PluginsPropertiesDTO();
        plugin.accountlink = new AccountLinkNetworkPropertiesDTO();
        plugin.accountlink.dummy = 'dummy';

        plugin.aggregate = new AggregateNetworkPropertiesDTO();
        plugin.aggregate.enableBondedAggregateSupport = true;
        plugin.aggregate.enableStrictCosignatureCheck = true;
        plugin.aggregate.maxBondedTransactionLifetime = '1';
        plugin.aggregate.maxCosignaturesPerAggregate = '1';
        plugin.aggregate.maxTransactionsPerAggregate = '1';

        plugin.lockhash = new HashLockNetworkPropertiesDTO();
        plugin.lockhash.lockedFundsPerAggregate = '1';
        plugin.lockhash.maxHashLockDuration = '1';

        plugin.locksecret = new SecretLockNetworkPropertiesDTO();
        plugin.locksecret.maxProofSize = '1';
        plugin.locksecret.maxSecretLockDuration = '1';
        plugin.locksecret.minProofSize = '1';

        plugin.metadata = new MetadataNetworkPropertiesDTO();
        plugin.metadata.maxValueSize = '1';

        plugin.mosaic = new MosaicNetworkPropertiesDTO();
        plugin.mosaic.maxMosaicDivisibility = '1';
        plugin.mosaic.maxMosaicDuration = '1';
        plugin.mosaic.maxMosaicsPerAccount = '1';
        plugin.mosaic.mosaicRentalFee = '1';
        plugin.mosaic.mosaicRentalFeeSinkPublicKey = '1';

        plugin.multisig = new MultisigNetworkPropertiesDTO();
        plugin.multisig.maxCosignatoriesPerAccount = '1';
        plugin.multisig.maxCosignedAccountsPerAccount = '1';
        plugin.multisig.maxMultisigDepth = '1';

        plugin.namespace = new NamespaceNetworkPropertiesDTO();
        plugin.namespace.childNamespaceRentalFee = '1';
        plugin.namespace.maxChildNamespaces = '1';
        plugin.namespace.maxNameSize = '1';
        plugin.namespace.maxNamespaceDepth = '1';
        plugin.namespace.maxNamespaceDuration = '1';
        plugin.namespace.minNamespaceDuration = '1';
        plugin.namespace.namespaceGracePeriodDuration = '1';
        plugin.namespace.namespaceRentalFeeSinkPublicKey = '1';
        plugin.namespace.reservedRootNamespaceNames = '1';
        plugin.namespace.rootNamespaceRentalFeePerBlock = '1';

        plugin.restrictionaccount = new AccountRestrictionNetworkPropertiesDTO();
        plugin.restrictionaccount.maxAccountRestrictionValues = '1';

        plugin.restrictionmosaic = new MosaicRestrictionNetworkPropertiesDTO();
        plugin.restrictionmosaic.maxMosaicRestrictionValues = '1';

        plugin.transfer = new TransferNetworkPropertiesDTO();
        plugin.transfer.maxMessageSize = '1';

        body.chain = chain;
        body.network = network;
        body.plugins = plugin;

        when(networkRoutesApi.getNetworkProperties()).thenReturn(Promise.resolve({ response, body }));

        const networkProperties = await networkRepository.getNetworkProperties().toPromise();
        deepEqual(networkProperties.network, body.network);
        deepEqual(networkProperties.chain, body.chain);
        deepEqual(networkProperties.plugins, body.plugins);
    });

    it('getNetworkProperties - using rest json payload', async () => {
        const body = testResources.getDummyNetworkProperties();
        when(networkRoutesApi.getNetworkProperties()).thenReturn(Promise.resolve({ response, body }));
        const networkProperties = await networkRepository.getNetworkProperties().toPromise();
        deepEqual(networkProperties.network, body.network);
        deepEqual(networkProperties.chain, body.chain);
        deepEqual(networkProperties.plugins, body.plugins);
    });
});
