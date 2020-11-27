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
import { Observable } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { Order, RepositoryFactoryHttp, SearchCriteria, SearcherRepository } from '../../src/infrastructure';
import { StateMerkleProof } from '../../src/model/state';
import { StateProofService } from '../../src/service';

const repositoryFactory = new RepositoryFactoryHttp('http://api-01.us-west-2.0.10.0.x.symboldev.network:3000');
const service = new StateProofService(repositoryFactory);
const stateCounts = 50;
//Process the latest data first.
const order = Order.Desc;

// TODO, create dynamic it tests

async function test<E, C extends SearchCriteria>(
    repository: SearcherRepository<E, C>,
    merkleMethod: (state: E) => Observable<StateMerkleProof>,
    getId: (state: E) => string,
): Promise<void> {
    const streamer = repository.streamer();
    const infos = await streamer
        .search({ order, pageSize: stateCounts } as C)
        .pipe(take(stateCounts), toArray())
        .toPromise();
    const promises = infos.map(async (info) => {
        const idText = getId(info);
        try {
            const merkle = await merkleMethod(info).toPromise();
            expect(merkle).to.not.undefined;
            if (merkle.valid) console.log(idText + ' ' + merkle.valid);
            else {
                console.error(idText + ' ' + merkle.valid);
            }
        } catch (e) {
            console.error(idText + ' ' + e);
            console.error(e);
        }
    });
    await Promise.all(promises);
}

describe('StateProofService', () => {
    it('Mosaics', async () => {
        await test(
            repositoryFactory.createMosaicRepository(),
            (info) => service.mosaic(info),
            (info) => info.id.toHex(),
        );
    });

    it('Namespaces', async () => {
        await test(
            repositoryFactory.createNamespaceRepository(),
            (info) => service.namespaces(info),
            (info) => info.id.toHex(),
        );
    });

    it('Accounts', async () => {
        await test(
            repositoryFactory.createAccountRepository(),
            (info) => service.account(info),
            (info) => info.address.plain(),
        );
    });

    it('Hash Lock', async () => {
        await test(
            repositoryFactory.createHashLockRepository(),
            (info) => service.hashLock(info),
            (info) => info.hash,
        );
    });

    it('Secret Lock', async () => {
        await test(
            repositoryFactory.createSecretLockRepository(),
            (info) => service.secretLock(info),
            (info) => info.compositeHash,
        );
    });

    it('Account restrictions', async () => {
        await test(
            repositoryFactory.createRestrictionAccountRepository(),
            (info) => service.accountRestriction(info),
            (info) => info.address.plain(),
        );
    });

    it('Mosaic restrictions', async () => {
        await test(
            repositoryFactory.createRestrictionMosaicRepository(),
            (info) => service.mosaicRestriction(info),
            (info) => info.compositeHash,
        );
    });

    it('Metadata', async () => {
        await test(
            repositoryFactory.createMetadataRepository(),
            (info) => service.metadata(info),
            (info) => info.metadataEntry.compositeHash,
        );
    });
});
