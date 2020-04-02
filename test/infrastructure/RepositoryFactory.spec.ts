/*
 * Copyright 2019 NEM
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
import { map } from 'rxjs/operators';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { BlockRepository } from '../../src/infrastructure/BlockRepository';
import { NetworkRepository } from '../../src/infrastructure/NetworkRepository';
import { RepositoryFactoryHttp } from '../../src/infrastructure/RepositoryFactoryHttp';
import { BlockInfo } from '../../src/model/blockchain/BlockInfo';
import { NetworkType } from '../../src/model/network/NetworkType';

describe('RepositoryFactory', () => {
    it('Should create repositories', () => {
        const repositoryFactory = new RepositoryFactoryHttp('http://localhost:3000', NetworkType.MIJIN_TEST, 'testHash');

        expect(repositoryFactory.createBlockRepository()).to.be.not.null;
        expect(repositoryFactory.createNetworkRepository()).to.be.not.null;
        expect(repositoryFactory.createNamespaceRepository()).to.be.not.null;
        expect(repositoryFactory.createAccountRepository()).to.be.not.null;
        expect(repositoryFactory.createChainRepository()).to.be.not.null;
        expect(repositoryFactory.createMetadataRepository()).to.be.not.null;
        expect(repositoryFactory.createMosaicRepository()).to.be.not.null;
        expect(repositoryFactory.createMultisigRepository()).to.be.not.null;
        expect(repositoryFactory.createNodeRepository()).to.be.not.null;
        expect(repositoryFactory.createReceiptRepository()).to.be.not.null;
        expect(repositoryFactory.createRestrictionAccountRepository()).to.be.not.null;
        expect(repositoryFactory.createRestrictionMosaicRepository()).to.be.not.null;
        expect(repositoryFactory.createTransactionRepository()).to.be.not.null;

    });

    it('Should get GenerationHash from cache', (done) => {

        let counter = 0;
        const repositoryMock: BlockRepository = mock();
        const observableOfBlockInfo = observableOf({generationHash: 'aaaa'} as BlockInfo).pipe(map((v) => {
            counter++;
            return v;
        }));
        when(repositoryMock.getBlockByHeight(deepEqual(BigInt(1)))).thenReturn(observableOfBlockInfo);
        expect(observableOfBlockInfo).to.be.equals(observableOfBlockInfo);
        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {

            createBlockRepository(): BlockRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', NetworkType.MIJIN_TEST);

        expect(counter).to.be.equals(0);
        repositoryFactory.getGenerationHash().subscribe((gh) => {
            expect(counter).to.be.equals(1);
            expect(gh).to.be.equals('aaaa');
            repositoryFactory.getGenerationHash().subscribe((g) => {
                expect(counter).to.be.equals(1);
                expect(g).to.be.equals('aaaa');
                repositoryFactory.getGenerationHash().subscribe((h) => {
                    expect(counter).to.be.equals(1);
                    expect(h).to.be.equals('aaaa');
                    done();
                });
            });
        });
    });

    it('Should get NetworkType from cache', (done) => {

        let counter = 0;
        const repositoryMock: NetworkRepository = mock();
        const expectedNetworkType = NetworkType.MIJIN_TEST;
        const observableOfBlockInfo = observableOf(expectedNetworkType).pipe(map((v) => {
            counter++;
            return v;
        }));
        when(repositoryMock.getNetworkType()).thenReturn(observableOfBlockInfo);

        expect(observableOfBlockInfo).to.be.equals(observableOfBlockInfo);

        // tslint:disable-next-line: max-classes-per-file
        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', undefined, 'testHash');

        expect(counter).to.be.equals(0);
        repositoryFactory.getNetworkType().subscribe((networkType) => {
            expect(counter).to.be.equals(1);
            expect(networkType).to.be.equals(expectedNetworkType);
            repositoryFactory.getNetworkType().subscribe((network) => {
                expect(counter).to.be.equals(1);
                expect(network).to.be.equals(expectedNetworkType);
                done();
            });
        });

    });

    it('Should get NetworkType from memory', (done) => {

        let counter = 0;

        const repositoryMock: NetworkRepository = mock();

        const expectedNetworkType = NetworkType.MIJIN_TEST;
        const observableOfBlockInfo = observableOf(expectedNetworkType).pipe(map((v) => {
            counter++;
            return v;
        }));
        when(repositoryMock.getNetworkType()).thenReturn(observableOfBlockInfo);

        expect(observableOfBlockInfo).to.be.equals(observableOfBlockInfo);

        // tslint:disable-next-line: max-classes-per-file
        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', expectedNetworkType, 'testHash');

        expect(counter).to.be.equals(0);
        repositoryFactory.getNetworkType().subscribe((networkType) => {
            expect(counter).to.be.equals(0);
            expect(networkType).to.be.equals(expectedNetworkType);
            repositoryFactory.getNetworkType().subscribe((network) => {
                expect(counter).to.be.equals(0);
                expect(network).to.be.equals(expectedNetworkType);
                done();
            });
        });

    });

});
