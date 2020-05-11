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
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { Account } from '../../src/model/account/Account';
import { UInt64 } from '../../src/model/UInt64';
import { TestingAccount, MultisigAccount } from '../conf/conf.spec';
import { AccountService } from '../../src/service/AccountService';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { AccountInfo } from '../../src/model/account/AccountInfo';
import { AccountType } from '../../src/model/account/AccountType';
import { ActivityBucket } from '../../src/model/account/ActivityBucket';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { NetworkCurrencyPublic } from '../../src/model/mosaic/NetworkCurrencyPublic';
import { NetworkHarvestLocal } from '../../src/model/mosaic/NetworkHarvestLocal';
import { NamespaceInfo } from '../../src/model/namespace/NamespaceInfo';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { MosaicAlias } from '../../src/model/namespace/MosaicAlias';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NamespaceName } from '../../src/model/namespace/NamespaceName';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { AccountKey } from '../../src/model/account/AccountKey';
import { AccountKeyType } from '../../src/model/account/AccountKeyType';

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
                account.address,
                UInt64.fromUint(100),
                account.publicKey,
                UInt64.fromUint(100),
                AccountType.Main,
                [new AccountKey(AccountKeyType.Linked, '0')],
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
                true,
                0,
                'id',
                1,
                1,
                [NetworkCurrencyLocal.NAMESPACE_ID],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.publicAccount,
                UInt64.fromUint(10),
                UInt64.fromUint(20),
                new MosaicAlias(new MosaicId('30BBEA6CC462B244')),
            ),
            new NamespaceInfo(
                true,
                0,
                'id',
                1,
                1,
                [NetworkCurrencyPublic.NAMESPACE_ID],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.publicAccount,
                UInt64.fromUint(10),
                UInt64.fromUint(20),
                new MosaicAlias(new MosaicId('31BBEA6CC462B244')),
            ),
            new NamespaceInfo(
                true,
                0,
                'id',
                1,
                1,
                [NetworkHarvestLocal.NAMESPACE_ID],
                NamespaceId.createFromEncoded('0000000000000000'),
                account.publicAccount,
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

        when(mockNamespaceRepository.getNamespacesFromAccounts(deepEqual([account.address]))).thenReturn(observableOf(mockNamespaceInfo()));
        when(mockNamespaceRepository.getNamespacesFromAccounts(deepEqual([account2.address]))).thenReturn(
            observableOf(mockNamespaceInfo()),
        );

        when(mockNamespaceRepository.getNamespacesName(deepEqual([NetworkCurrencyLocal.NAMESPACE_ID]))).thenReturn(
            observableOf([mockNamespaceName(NetworkCurrencyLocal.NAMESPACE_ID, 'catapult.currency')]),
        );
        when(mockNamespaceRepository.getNamespacesName(deepEqual([NetworkCurrencyPublic.NAMESPACE_ID]))).thenReturn(
            observableOf([mockNamespaceName(NetworkCurrencyPublic.NAMESPACE_ID, 'symbol.xym')]),
        );
        when(mockNamespaceRepository.getNamespacesName(deepEqual([NetworkHarvestLocal.NAMESPACE_ID]))).thenReturn(
            observableOf([mockNamespaceName(NetworkHarvestLocal.NAMESPACE_ID, 'catapult.harvest')]),
        );

        when(
            mockNamespaceRepository.getNamespacesName(
                deepEqual([NetworkCurrencyLocal.NAMESPACE_ID, NetworkCurrencyPublic.NAMESPACE_ID, NetworkHarvestLocal.NAMESPACE_ID]),
            ),
        ).thenReturn(
            observableOf([
                mockNamespaceName(NetworkCurrencyLocal.NAMESPACE_ID, 'catapult.currency'),
                mockNamespaceName(NetworkCurrencyPublic.NAMESPACE_ID, 'symbol.xym'),
                mockNamespaceName(NetworkHarvestLocal.NAMESPACE_ID, 'catapult.harvest'),
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
        const result = await accountService.accountInfoWithResolvedMosaic([account.address]).toPromise();
        expect(result[0].resolvedMosaics).to.not.be.undefined;
        expect(result[0].resolvedMosaics![0].namespaceName?.name).to.be.equal('catapult.currency');
        expect(result[0].resolvedMosaics![1].namespaceName?.name).to.be.equal('symbol.xym');
        expect(result[0].resolvedMosaics![2].namespaceName?.name).to.be.equal('catapult.harvest');
    });

    it('should return accountInfo with mosaicId', async () => {
        when(mockAccountRepository.getAccountsInfo(deepEqual([account2.address]))).thenReturn(observableOf(mockAccountInfo(true)));
        const result = await accountService.accountInfoWithResolvedMosaic([account2.address]).toPromise();
        expect(result[0].resolvedMosaics).to.not.be.undefined;
        expect(result[0].resolvedMosaics![0].namespaceName?.name).to.be.equal('catapult.currency');
        expect(result[0].resolvedMosaics![1].namespaceName?.name).to.be.equal('symbol.xym');
        expect(result[0].resolvedMosaics![2].namespaceName?.name).to.be.equal('catapult.harvest');
        expect(result[0].resolvedMosaics![3]).to.not.be.undefined;
        expect(result[0].resolvedMosaics![3].namespaceName).to.be.undefined;
    });

    it('should return namespaceInfo with resolved name', async () => {
        const result = await accountService.accountNamespacesWithName([account.address]).toPromise();
        expect(result).to.not.be.undefined;
        expect(result.length).to.be.greaterThan(0);
        expect(result![0].namespaceName).to.be.equal('catapult.currency');
        expect(result![1].namespaceName).to.be.equal('symbol.xym');
        expect(result![2].namespaceName).to.be.equal('catapult.harvest');
    });

    it('should return empty resolved namespaceInfo', async () => {
        when(mockAccountRepository.getAccountsInfo(deepEqual([account2.address]))).thenReturn(observableOf(mockAccountInfo(true, true)));
        const result = await accountService.accountInfoWithResolvedMosaic([account2.address]).toPromise();
        expect(result).to.not.be.undefined;
        expect(result.length).to.be.greaterThan(0);
        expect(result![0].resolvedMosaics?.length).to.be.equal(1);
    });
});
