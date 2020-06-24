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
import { deepEqual } from 'assert';
import { expect } from 'chai';
import * as http from 'http';
import {
    NetworkConfigurationDTO,
    NetworkRoutesApi,
    NetworkTypeDTO,
    NodeIdentityEqualityStrategy,
    NodeInfoDTO,
    NodeRoutesApi,
    RolesTypeEnum,
    TransactionFeesDTO,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
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
        const body: TransactionFeesDTO = {
            averageFeeMultiplier: 1,
            highestFeeMultiplier: 2,
            lowestFeeMultiplier: 3,
            medianFeeMultiplier: 4,
        };

        when(networkRoutesApi.getTransactionFees()).thenReturn(Promise.resolve(body));

        const networkFees = await networkRepository.getTransactionFees().toPromise();
        expect(networkFees).to.be.not.null;
        expect(networkFees.averageFeeMultiplier).to.be.equals(1);
        expect(networkFees.highestFeeMultiplier).to.be.equals(2);
        expect(networkFees.lowestFeeMultiplier).to.be.equals(3);
        expect(networkFees.medianFeeMultiplier).to.be.equals(4);
    });

    it('getRentalFees', async () => {
        const body = {
            effectiveChildNamespaceRentalFee: '1',
            effectiveMosaicRentalFee: '2',
            effectiveRootNamespaceRentalFeePerBlock: '3',
        };

        when(networkRoutesApi.getRentalFees()).thenReturn(Promise.resolve(body));

        const rentalFees = await networkRepository.getRentalFees().toPromise();
        expect(rentalFees).to.be.not.null;
        expect(rentalFees.effectiveChildNamespaceRentalFee.toString()).to.be.equals('1');
        expect(rentalFees.effectiveMosaicRentalFee.toString()).to.be.equals('2');
        expect(rentalFees.effectiveRootNamespaceRentalFeePerBlock.toString()).to.be.equals('3');
    });

    it('getNetworkType', async () => {
        const body: NodeInfoDTO = {
            networkIdentifier: NetworkType.MIJIN_TEST,
            friendlyName: '',
            host: '',
            networkGenerationHashSeed: '',
            port: 123,
            publicKey: '',
            version: 456,
            roles: RolesTypeEnum.NUMBER_1,
        };

        when(nodeRoutesApi.getNodeInfo()).thenReturn(Promise.resolve(body));

        const networkType = await networkRepository.getNetworkType().toPromise();
        expect(networkType).to.be.equals(NetworkType.MIJIN_TEST);
    });

    it('getNetworkName', async () => {
        const body: NetworkTypeDTO = {
            name: 'Some Name',
            description: 'Some Description',
        };

        when(networkRoutesApi.getNetworkType()).thenReturn(Promise.resolve(body));

        const networkName = await networkRepository.getNetworkName().toPromise();
        expect(networkName.description).to.be.equals(body.description);
        expect(networkName.name).to.be.equals(body.name);
    });

    it('getNetworkProperties', async () => {
        const body: NetworkConfigurationDTO = {
            network: {
                identifier: 'public-test',
                nodeEqualityStrategy: NodeIdentityEqualityStrategy.PublicKey,
                nemesisSignerPublicKey: 'E3F04CA92250B49679EBEF98FAC87C1CECAC7E7491ECBB2307DF1AD65BED57FD',
                generationHashSeed: 'AE6488282F9C09457F017BE5EE26387B21EB15CF32D6DA1E9846C25E00828329',
                epochAdjustment: '1573430400s',
            },
            chain: {
                enableVerifiableState: true,
                enableVerifiableReceipts: true,
                currencyMosaicId: "0x62EF'46FD'6555'A1B9",
                harvestingMosaicId: "0x567D'9154'316B'C2AF",
                blockFinalizationInterval: 'abc',
                blockGenerationTargetTime: '15s',
                blockTimeSmoothingFactor: '3000',
                importanceGrouping: '1433',
                importanceActivityPercentage: '5',
                maxRollbackBlocks: '1433',
                maxDifficultyBlocks: '60',
                defaultDynamicFeeMultiplier: "1'000",
                maxTransactionLifetime: '24h',
                maxBlockFutureTime: '500ms',
                initialCurrencyAtomicUnits: "8'998'999'998'000'000",
                maxMosaicAtomicUnits: "9'000'000'000'000'000",
                totalChainImportance: "15'000'000",
                minHarvesterBalance: '500',
                minVoterBalance: '500',
                maxHarvesterBalance: "50'000'000'000'000",
                harvestBeneficiaryPercentage: '10',
                harvestNetworkPercentage: '5',
                harvestNetworkFeeSinkAddress: 'FF5563F1C5824EE0CD868799FBE8744B46D5549973FDA499939C952D951494E4',
                blockPruneInterval: '360',
                maxTransactionsPerBlock: "6'000",
            },
            plugins: {
                accountlink: {
                    dummy: 'to trigger plugin load',
                },
                aggregate: {
                    maxTransactionsPerAggregate: "1'000",
                    maxCosignaturesPerAggregate: '25',
                    enableStrictCosignatureCheck: false,
                    enableBondedAggregateSupport: true,
                    maxBondedTransactionLifetime: '48h',
                },
                lockhash: {
                    lockedFundsPerAggregate: "10'000'000",
                    maxHashLockDuration: '2d',
                },
                locksecret: {
                    maxSecretLockDuration: '30d',
                    minProofSize: '1',
                    maxProofSize: '1000',
                },
                metadata: {
                    maxValueSize: '1024',
                },
                mosaic: {
                    maxMosaicsPerAccount: "1'000",
                    maxMosaicDuration: '3650d',
                    maxMosaicDivisibility: '6',
                    mosaicRentalFeeSinkAddress: '53E140B5947F104CABC2D6FE8BAEDBC30EF9A0609C717D9613DE593EC2A266D3',
                    mosaicRentalFee: '500',
                },
                multisig: {
                    maxMultisigDepth: '3',
                    maxCosignatoriesPerAccount: '25',
                    maxCosignedAccountsPerAccount: '25',
                },
                namespace: {
                    maxNameSize: '64',
                    maxChildNamespaces: '256',
                    maxNamespaceDepth: '3',
                    minNamespaceDuration: '1m',
                    maxNamespaceDuration: '365d',
                    namespaceGracePeriodDuration: '30d',
                    reservedRootNamespaceNames: 'xem, nem, user, account, org, com, biz, net, edu, mil, gov, info',
                    namespaceRentalFeeSinkAddress: '3E82E1C1E4A75ADAA3CBA8C101C3CD31D9817A2EB966EB3B511FB2ED45B8E262',
                    rootNamespaceRentalFeePerBlock: '1',
                    childNamespaceRentalFee: '100',
                },
                restrictionaccount: {
                    maxAccountRestrictionValues: '512',
                },
                restrictionmosaic: {
                    maxMosaicRestrictionValues: '20',
                },
                transfer: {
                    maxMessageSize: '1024',
                },
            },
        };

        when(networkRoutesApi.getNetworkProperties()).thenReturn(Promise.resolve(body));

        const networkProperties = await networkRepository.getNetworkProperties().toPromise();
        deepEqual(networkProperties.network, body.network);
        deepEqual(networkProperties.chain, body.chain);
        deepEqual(networkProperties.plugins, body.plugins);
    });

    it('getNetworkProperties - using rest json payload', async () => {
        const body = testResources.getDummyNetworkProperties();
        when(networkRoutesApi.getNetworkProperties()).thenReturn(Promise.resolve(body));
        const networkProperties = await networkRepository.getNetworkProperties().toPromise();
        deepEqual(networkProperties.network, body.network);
        deepEqual(networkProperties.chain, body.chain);
        deepEqual(networkProperties.plugins, body.plugins);
    });
});
