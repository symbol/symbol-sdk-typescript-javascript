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
import { of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { Page } from '../../src/infrastructure/Page';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { toPromise } from '../../src/infrastructure/rxUtils';
import { Account, AccountInfo, AccountType, ActivityBucket, SupplementalPublicKeys } from '../../src/model/account';
import { Mosaic, MosaicId } from '../../src/model/mosaic';
import { MosaicAlias } from '../../src/model/namespace/MosaicAlias';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NamespaceInfo } from '../../src/model/namespace/NamespaceInfo';
import { NamespaceName } from '../../src/model/namespace/NamespaceName';
import { UInt64 } from '../../src/model/UInt64';
import { AccountService } from '../../src/service/AccountService';
import { MultisigAccount, TestingAccount } from '../conf/conf.spec';
import { NetworkCurrencyLocal, NetworkCurrencyPublic, NetworkHarvestLocal } from '../model/mosaic/Currency.spec';

describe('AccountService', () => {
    let accountService: AccountService;
    let account: Account;
    let account2: Account;

    function mockAccountInfo(withMosaic = false, noNamespace = false): AccountInfo[] {
        const mosaic = new Mosaic(new MosaicId('941299B2B7E1291C'), UInt64.fromUint(1));
        const mosaics = noNamespace
            ? []
            : [NetworkCurrencyLocal.createAbsolute(1), NetworkCurrencyPublic.createAbsolute(1), NetworkHarvestLocal.createAbsolute(1)];
        if (withMosaic) {
            mosaics.push(mosaic);
        }
        return [
            new AccountInfo(
                1,
                'someId',
                account.address,
                UInt64.fromUint(100),
                account.publicKey,
                UInt64.fromUint(100),
                AccountType.Main,
                new SupplementalPublicKeys(),
                [new ActivityBucket(UInt64.fromUint(0), UInt64.fromUint(1), 1, UInt64.fromUint(1))],
                mosaics,
                UInt64.fromUint(100),
                UInt64.fromUint(100),
            ),
        ];
    }

    function mockNamespaceInfo(): NamespaceInfo[] {
        return [
            new NamespaceInfo(
                1,
                true,
                0,
                'id',
                1,
                1,
                [NetworkCurrencyLocal.namespaceId!],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.address,
                UInt64.fromUint(10),
                UInt64.fromUint(20),
                new MosaicAlias(new MosaicId('30BBEA6CC462B244')),
            ),
            new NamespaceInfo(
                1,
                true,
                0,
                'id',
                1,
                1,
                [NetworkCurrencyPublic.namespaceId!],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.address,
                UInt64.fromUint(10),
                UInt64.fromUint(20),
                new MosaicAlias(new MosaicId('31BBEA6CC462B244')),
            ),
            new NamespaceInfo(
                1,
                true,
                0,
                'id',
                1,
                1,
                [NetworkHarvestLocal.namespaceId!],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.address,
                UInt64.fromUint(10),
                UInt64.fromUint(20),
                new MosaicAlias(new MosaicId('32BBEA6CC462B244')),
            ),
        ];
    }

    function mockNamespaceName(id: NamespaceId, name: string): NamespaceName {
        return new NamespaceName(id, name);
    }

    let mockAccountRepository: AccountRepository;
    before(() => {
        account = TestingAccount;
        account2 = MultisigAccount;
        mockAccountRepository = mock<AccountRepository>();
        const mockNamespaceRepository = mock<NamespaceRepository>();
        const mockRepoFactory = mock<RepositoryFactory>();

        when(mockAccountRepository.getAccountsInfo(deepEqual([account.address]))).thenReturn(observableOf(mockAccountInfo()));

        when(
            mockNamespaceRepository.search(
                deepEqual({
                    ownerAddress: account.address,
                    pageNumber: 1,
                }),
            ),
        ).thenReturn(observableOf(new Page<NamespaceInfo>(mockNamespaceInfo(), 1, 20)));

        when(mockNamespaceRepository.search(deepEqual({ ownerAddress: account.address, pageNumber: 1 }))).thenReturn(
            observableOf(new Page<NamespaceInfo>(mockNamespaceInfo(), 1, 20)),
        );

        when(mockNamespaceRepository.getNamespacesNames(deepEqual([NetworkCurrencyLocal.namespaceId!]))).thenReturn(
            observableOf([mockNamespaceName(NetworkCurrencyLocal.namespaceId!, 'catapult.currency')]),
        );
        when(mockNamespaceRepository.getNamespacesNames(deepEqual([NetworkCurrencyPublic.namespaceId!]))).thenReturn(
            observableOf([mockNamespaceName(NetworkCurrencyPublic.namespaceId!, 'symbol.xym')]),
        );
        when(mockNamespaceRepository.getNamespacesNames(deepEqual([NetworkHarvestLocal.namespaceId!]))).thenReturn(
            observableOf([mockNamespaceName(NetworkHarvestLocal.namespaceId!, 'catapult.harvest')]),
        );

        when(
            mockNamespaceRepository.getNamespacesNames(
                deepEqual([NetworkCurrencyLocal.namespaceId!, NetworkCurrencyPublic.namespaceId!, NetworkHarvestLocal.namespaceId!]),
            ),
        ).thenReturn(
            observableOf([
                mockNamespaceName(NetworkCurrencyLocal.namespaceId!, 'catapult.currency'),
                mockNamespaceName(NetworkCurrencyPublic.namespaceId!, 'symbol.xym'),
                mockNamespaceName(NetworkHarvestLocal.namespaceId!, 'catapult.harvest'),
            ]),
        );

        const accountRepository = instance(mockAccountRepository);
        const namespaceRepository = instance(mockNamespaceRepository);

        when(mockRepoFactory.createAccountRepository()).thenReturn(accountRepository);
        when(mockRepoFactory.createNamespaceRepository()).thenReturn(namespaceRepository);
        const repoFactory = instance(mockRepoFactory);
        accountService = new AccountService(repoFactory);
    });

    it('should return accountInfo with resolved mosaic name', async () => {
        const result = await toPromise(accountService.accountInfoWithResolvedMosaic([account.address]));
        expect(result[0].resolvedMosaics).to.not.be.undefined;
        expect(result[0].resolvedMosaics![0].namespaceName?.name).to.be.equal('catapult.currency');
        expect(result[0].resolvedMosaics![1].namespaceName?.name).to.be.equal('symbol.xym');
        expect(result[0].resolvedMosaics![2].namespaceName?.name).to.be.equal('catapult.harvest');
    });

    it('should return accountInfo with mosaicId', async () => {
        when(mockAccountRepository.getAccountsInfo(deepEqual([account2.address]))).thenReturn(observableOf(mockAccountInfo(true)));
        const result = await toPromise(accountService.accountInfoWithResolvedMosaic([account2.address]));
        expect(result[0].resolvedMosaics).to.not.be.undefined;
        expect(result[0].resolvedMosaics![0].namespaceName?.name).to.be.equal('catapult.currency');
        expect(result[0].resolvedMosaics![1].namespaceName?.name).to.be.equal('symbol.xym');
        expect(result[0].resolvedMosaics![2].namespaceName?.name).to.be.equal('catapult.harvest');
        expect(result[0].resolvedMosaics![3]).to.not.be.undefined;
        expect(result[0].resolvedMosaics![3].namespaceName).to.be.undefined;
    });

    it('should return namespaceInfo with resolved name', async () => {
        const result = await toPromise(accountService.accountNamespacesWithName(account.address));
        expect(result).to.not.be.undefined;
        expect(result.length).to.be.greaterThan(0);
        expect(result![0].namespaceName).to.be.equal('catapult.currency');
        expect(result![1].namespaceName).to.be.equal('symbol.xym');
        expect(result![2].namespaceName).to.be.equal('catapult.harvest');
    });

    it('should return empty resolved namespaceInfo', async () => {
        when(mockAccountRepository.getAccountsInfo(deepEqual([account2.address]))).thenReturn(observableOf(mockAccountInfo(true, true)));
        const result = await toPromise(accountService.accountInfoWithResolvedMosaic([account2.address]));
        expect(result).to.not.be.undefined;
        expect(result.length).to.be.greaterThan(0);
        expect(result![0].resolvedMosaics?.length).to.be.equal(1);
    });
});
