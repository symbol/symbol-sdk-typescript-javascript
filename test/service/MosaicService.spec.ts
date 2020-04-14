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
import { MosaicFlags, AccountInfo, AccountType } from '../../src/model/model';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicInfo } from '../../src/model/mosaic/MosaicInfo';
import { MosaicAmountView } from '../../src/service/MosaicAmountView';
import { MosaicService } from '../../src/service/MosaicService';
import { MosaicView } from '../../src/service/MosaicView';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { mock, when, instance, deepEqual } from 'ts-mockito';
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { of as observableOf } from 'rxjs';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { TestingAccount } from '../conf/conf.spec';

describe('MosaicService', () => {
    const accountRepositoryMock = mock<AccountRepository>();
    const mosaicRepositoryMock = mock<MosaicRepository>();

    it('mosaicsView', () => {
        const mosaicId = new MosaicId('85BBEA6CC462B244');
        when(mosaicRepositoryMock.getMosaics(deepEqual([mosaicId]))).thenReturn(
            observableOf([buildMosaicInfo(mosaicId, TestingAccount.publicAccount)]),
        );
        const mosaicService = new MosaicService(instance(accountRepositoryMock), instance(mosaicRepositoryMock));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView: MosaicView[]) => {
            const mosaicView = mosaicsView[0];
            expect(mosaicView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
        });
    });

    it('mosaicsView of no existing mosaicId', () => {
        const mosaicId = new MosaicId('85BBEA6CC462B244');
        when(mosaicRepositoryMock.getMosaics(deepEqual([mosaicId]))).thenReturn(observableOf([]));
        const mosaicService = new MosaicService(instance(accountRepositoryMock), instance(mosaicRepositoryMock));
        return mosaicService.mosaicsView([mosaicId]).subscribe((mosaicsView: MosaicView[]) => {
            expect(mosaicsView.length).to.be.equal(0);
        });
    });

    it('mosaicsAmountView', () => {
        const mosaicId = new MosaicId('85BBEA6CC462B244');
        when(mosaicRepositoryMock.getMosaics(deepEqual([mosaicId]))).thenReturn(
            observableOf([buildMosaicInfo(mosaicId, TestingAccount.publicAccount)]),
        );
        when(accountRepositoryMock.getAccountInfo(deepEqual(TestingAccount.address))).thenReturn(observableOf(buildAccountInfo(mosaicId)));

        const mosaicService = new MosaicService(instance(accountRepositoryMock), instance(mosaicRepositoryMock));
        return mosaicService.mosaicsAmountViewFromAddress(TestingAccount.address).subscribe((mosaicsAmountView: MosaicAmountView[]) => {
            const mosaicAmountView = mosaicsAmountView[0];
            expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
        });
    });

    it('mosaicsAmountView of no existing account', () => {
        const mosaicId = new MosaicId('85BBEA6CC462B244');
        when(mosaicRepositoryMock.getMosaics(deepEqual([mosaicId]))).thenReturn(observableOf([]));
        when(accountRepositoryMock.getAccountInfo(deepEqual(TestingAccount.address))).thenReturn(observableOf(buildAccountInfo(mosaicId)));

        const mosaicService = new MosaicService(instance(accountRepositoryMock), instance(mosaicRepositoryMock));
        return mosaicService.mosaicsAmountViewFromAddress(TestingAccount.address).subscribe((mosaicsAmountView: MosaicAmountView[]) => {
            expect(mosaicsAmountView.length).to.be.equal(0);
        });
    });

    it('mosaicsAmountView', () => {
        const mosaicId = new MosaicId('85BBEA6CC462B244');
        when(mosaicRepositoryMock.getMosaics(deepEqual([mosaicId]))).thenReturn(
            observableOf([buildMosaicInfo(mosaicId, TestingAccount.publicAccount)]),
        );

        const mosaicService = new MosaicService(instance(accountRepositoryMock), instance(mosaicRepositoryMock));
        const mosaic = new Mosaic(mosaicId, BigInt(1000));
        return mosaicService.mosaicsAmountView([mosaic]).subscribe((mosaicsAmountView: MosaicAmountView[]) => {
            const mosaicAmountView = mosaicsAmountView[0];
            expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
            expect(mosaicAmountView.amount).to.be.equal(BigInt(1000));
        });
    });

    function buildMosaicInfo(mosaicId: MosaicId, publicAccount: PublicAccount): MosaicInfo {
        return new MosaicInfo(mosaicId, BigInt(10), BigInt(1), publicAccount, 0, new MosaicFlags(1), 6, BigInt(1));
    }

    function buildAccountInfo(mosaicId: MosaicId, isEmptyMosaic = false): AccountInfo {
        return new AccountInfo(
            TestingAccount.address,
            BigInt(1),
            TestingAccount.publicKey,
            BigInt(1),
            AccountType.Main,
            '',
            [],
            isEmptyMosaic ? [] : [new Mosaic(mosaicId, BigInt(100))],
            BigInt(1),
            BigInt(1),
        );
    }
});
