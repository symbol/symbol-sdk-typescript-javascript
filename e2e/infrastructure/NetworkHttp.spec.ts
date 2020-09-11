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
import { expect } from 'chai';
import { NetworkRepository } from '../../src/infrastructure/NetworkRepository';
import { NetworkType } from '../../src/model/network/NetworkType';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('NetworkHttp', () => {
    let networkRepository: NetworkRepository;
    const helper = new IntegrationTestHelper();
    let networkType: NetworkType;

    before(() => {
        return helper.start({ openListener: false }).then(() => {
            networkRepository = helper.repositoryFactory.createNetworkRepository();
            networkType = helper.networkType;
        });
    });

    after(() => {
        return helper.close();
    });

    describe('getNetworkType', () => {
        it('should return network type', async () => {
            const sentNetworkType = await networkRepository.getNetworkType().toPromise();
            expect(sentNetworkType).to.be.equal(networkType);
        });
    });

    describe('getNetworkName', () => {
        it('should return network name and description', async () => {
            const networkName = await networkRepository.getNetworkName().toPromise();
            expect(networkName.name.toLowerCase()).to.be.not.null;
            expect(networkName.description.toLowerCase()).to.be.not.null;
        });
    });

    describe('getTransactionFees', () => {
        it('should return transaction fees', async () => {
            const fees = await networkRepository.getTransactionFees().toPromise();
            expect(fees.averageFeeMultiplier).to.be.not.null;
            expect(fees.highestFeeMultiplier).to.be.not.null;
            expect(fees.lowestFeeMultiplier).to.be.not.null;
            expect(fees.medianFeeMultiplier).to.be.not.null;
        });
    });
    describe('getRentalFees', () => {
        it('should return rental fees', async () => {
            const fees = await networkRepository.getRentalFees().toPromise();
            expect(fees.effectiveChildNamespaceRentalFee).to.be.not.null;
            expect(fees.effectiveMosaicRentalFee).to.be.not.null;
            expect(fees.effectiveRootNamespaceRentalFeePerBlock).to.be.not.null;
        });
    });

    describe('getNetworkProperties', () => {
        it('should return network configuration', async () => {
            const config = await networkRepository.getNetworkProperties().toPromise();
            expect(config.network).to.be.not.null;
            expect(config.chain).to.be.not.null;
            expect(config.plugins).to.be.not.null;
        });
    });
});
