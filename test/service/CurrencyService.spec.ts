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
import { of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { NetworkRepository } from '../../src/infrastructure/NetworkRepository';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { Account } from '../../src/model/account';
import { MosaicFlags, MosaicId, MosaicInfo, MosaicNames, Currency } from '../../src/model/mosaic';
import { NamespaceId, NamespaceName } from '../../src/model/namespace';
import { NetworkConfiguration } from '../../src/model/network/NetworkConfiguration';
import { NetworkType } from '../../src/model/network/NetworkType';
import { UInt64 } from '../../src/model/UInt64';
import { CurrencyService } from '../../src/service/CurrencyService';

describe('CurrencyService', () => {
    it('getNetworkProperties', async () => {
        const networkType = NetworkType.MIJIN_TEST;
        const currencyServerHex = "0x017D'1694'0477'B3F5";
        const currencyMosaicId = new MosaicId(DtoMapping.toSimpleHex(currencyServerHex));
        const harvestServerHex = "0x29C6'42F2'F432'8612";
        const harvestingMosaicId = new MosaicId(DtoMapping.toSimpleHex(harvestServerHex));

        const mockNetworkRepository = mock<NetworkRepository>();
        when(mockNetworkRepository.getNetworkProperties()).thenReturn(
            observableOf({
                chain: {
                    currencyMosaicId: currencyServerHex,
                    harvestingMosaicId: harvestServerHex,
                },
            } as NetworkConfiguration),
        );

        const networkRepository = instance(mockNetworkRepository);

        const mockMosaicRepository = mock<MosaicRepository>();
        const mosaicRepository = instance(mockMosaicRepository);

        const account = Account.generateNewAccount(networkType);
        const currencyMosaicInfo = new MosaicInfo(
            '111',
            currencyMosaicId,
            UInt64.fromUint(100),
            UInt64.fromUint(10),
            account.address,
            0,
            new MosaicFlags(1),
            6,
            UInt64.fromUint(1000),
        );

        const harvestMosaicInfo = new MosaicInfo(
            '222',
            harvestingMosaicId,
            UInt64.fromUint(200),
            UInt64.fromUint(20),
            account.address,
            0,
            new MosaicFlags(2),
            3,
            UInt64.fromUint(2000),
        );

        when(mockMosaicRepository.getMosaics(deepEqual([currencyMosaicId, harvestingMosaicId]))).thenReturn(
            observableOf([currencyMosaicInfo, harvestMosaicInfo]),
        );

        const mockNamespaceRepository = mock<NamespaceRepository>();

        const currencyMosaicNames = new MosaicNames(currencyMosaicId, [new NamespaceName(new NamespaceId('my.xym'), 'my.xym')]);

        const harvestMosaicNames = new MosaicNames(harvestingMosaicId, []);

        when(mockNamespaceRepository.getMosaicsNames(deepEqual([currencyMosaicId, harvestingMosaicId]))).thenReturn(
            observableOf([currencyMosaicNames, harvestMosaicNames]),
        );

        const namespaceRepository = instance(mockNamespaceRepository);

        const mockRepoFactory = mock<RepositoryFactory>();
        when(mockRepoFactory.createNetworkRepository()).thenReturn(networkRepository);
        when(mockRepoFactory.createMosaicRepository()).thenReturn(mosaicRepository);
        when(mockRepoFactory.createNamespaceRepository()).thenReturn(namespaceRepository);
        const repositoryFactory = instance(mockRepoFactory);

        const service = new CurrencyService(repositoryFactory);
        const currencies = await service.getNetworkCurrencies().toPromise();

        const currencyNamespaceId = currencyMosaicNames.names[0].namespaceId;
        expect(currencies.currency).to.be.deep.equal(
            new Currency({
                unresolvedMosaicId: currencyNamespaceId,
                namespaceId: currencyNamespaceId,
                mosaicId: currencyMosaicInfo.id,
                divisibility: currencyMosaicInfo.divisibility,
                supplyMutable: currencyMosaicInfo.isSupplyMutable(),
                transferable: currencyMosaicInfo.isTransferable(),
                restrictable: currencyMosaicInfo.isRestrictable(),
            }),
        );
        expect(currencies.harvest).to.be.deep.equal(
            new Currency({
                unresolvedMosaicId: harvestMosaicInfo.id,
                mosaicId: harvestMosaicInfo.id,
                divisibility: harvestMosaicInfo.divisibility,
                supplyMutable: harvestMosaicInfo.isSupplyMutable(),
                transferable: harvestMosaicInfo.isTransferable(),
                restrictable: harvestMosaicInfo.isRestrictable(),
            }),
        );
    });

    it('loadCurrencies', async () => {
        const networkType = NetworkType.MIJIN_TEST;
        const currencyServerHex = "0x017D'1694'0477'B3F5";
        const currencyMosaicId = new MosaicId(DtoMapping.toSimpleHex(currencyServerHex));
        const harvestServerHex = "0x29C6'42F2'F432'8612";
        const harvestingMosaicId = new MosaicId(DtoMapping.toSimpleHex(harvestServerHex));

        const mockMosaicRepository = mock<MosaicRepository>();
        const mosaicRepository = instance(mockMosaicRepository);

        const account = Account.generateNewAccount(networkType);
        const currencyMosaicInfo = new MosaicInfo(
            '111',
            currencyMosaicId,
            UInt64.fromUint(100),
            UInt64.fromUint(10),
            account.address,
            0,
            new MosaicFlags(1),
            6,
            UInt64.fromUint(1000),
        );

        const harvestMosaicInfo = new MosaicInfo(
            '222',
            harvestingMosaicId,
            UInt64.fromUint(200),
            UInt64.fromUint(20),
            account.address,
            0,
            new MosaicFlags(2),
            3,
            UInt64.fromUint(2000),
        );

        when(mockMosaicRepository.getMosaics(deepEqual([currencyMosaicId, harvestingMosaicId]))).thenReturn(
            observableOf([currencyMosaicInfo, harvestMosaicInfo]),
        );

        const mockNamespaceRepository = mock<NamespaceRepository>();

        const currencyMosaicNames = new MosaicNames(currencyMosaicId, []);

        const harvestMosaicNames = new MosaicNames(harvestingMosaicId, [new NamespaceName(new NamespaceId('my.harveset'), 'my.harveset')]);

        when(mockNamespaceRepository.getMosaicsNames(deepEqual([currencyMosaicId, harvestingMosaicId]))).thenReturn(
            observableOf([currencyMosaicNames, harvestMosaicNames]),
        );

        const namespaceRepository = instance(mockNamespaceRepository);

        const mockRepoFactory = mock<RepositoryFactory>();
        when(mockRepoFactory.createMosaicRepository()).thenReturn(mosaicRepository);
        when(mockRepoFactory.createNamespaceRepository()).thenReturn(namespaceRepository);
        const repositoryFactory = instance(mockRepoFactory);

        const service = new CurrencyService(repositoryFactory);
        const [currency, harvest] = await service.getCurrencies([currencyMosaicId, harvestingMosaicId]).toPromise();

        expect(currency).to.be.deep.equal(
            new Currency({
                unresolvedMosaicId: currencyMosaicInfo.id,
                mosaicId: currencyMosaicInfo.id,
                divisibility: currencyMosaicInfo.divisibility,
                supplyMutable: currencyMosaicInfo.isSupplyMutable(),
                transferable: currencyMosaicInfo.isTransferable(),
                restrictable: currencyMosaicInfo.isRestrictable(),
            }),
        );
        const harvestNamespaceI = harvestMosaicNames.names[0].namespaceId;
        expect(harvest).to.be.deep.equal(
            new Currency({
                namespaceId: harvestNamespaceI,
                unresolvedMosaicId: harvestNamespaceI,
                mosaicId: harvestMosaicInfo.id,
                divisibility: harvestMosaicInfo.divisibility,
                supplyMutable: harvestMosaicInfo.isSupplyMutable(),
                transferable: harvestMosaicInfo.isTransferable(),
                restrictable: harvestMosaicInfo.isRestrictable(),
            }),
        );
    });
});
