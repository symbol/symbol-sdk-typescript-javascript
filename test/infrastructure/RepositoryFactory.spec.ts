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
import { instance, mock, when } from 'ts-mockito';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { BlockHttp } from '../../src/infrastructure/BlockHttp';
import { ChainHttp } from '../../src/infrastructure/ChainHttp';
import { Listener } from '../../src/infrastructure/Listener';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { MultisigHttp } from '../../src/infrastructure/MultisigHttp';
import { NamespaceHttp } from '../../src/infrastructure/NamespaceHttp';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { NetworkHttp } from '../../src/infrastructure/NetworkHttp';
import { NetworkRepository } from '../../src/infrastructure/NetworkRepository';
import { NodeHttp } from '../../src/infrastructure/NodeHttp';
import { NodeRepository } from '../../src/infrastructure/NodeRepository';
import { ReceiptHttp } from '../../src/infrastructure/ReceiptHttp';
import { RepositoryFactoryHttp } from '../../src/infrastructure/RepositoryFactoryHttp';
import { RestrictionAccountHttp } from '../../src/infrastructure/RestrictionAccountHttp';
import { RestrictionMosaicHttp } from '../../src/infrastructure/RestrictionMosaicHttp';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { TransactionStatusHttp } from '../../src/infrastructure/TransactionStatusHttp';
import { NetworkType } from '../../src/model/network/NetworkType';
import { NodeInfo } from '../../src/model/node/NodeInfo';

describe('RepositoryFactory', () => {
    it('Should create repositories', () => {
        const repositoryFactory = new RepositoryFactoryHttp('http://localhost:3000', {
            networkType: NetworkType.MIJIN_TEST,
            generationHash: 'testHash',
        });

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
        const repositoryMock: NodeRepository = mock();
        const observableOfNodeInfo = observableOf({ networkGenerationHashSeed: 'aaaa' } as NodeInfo).pipe(
            map((v) => {
                counter++;
                return v;
            }),
        );
        when(repositoryMock.getNodeInfo()).thenReturn(observableOfNodeInfo);
        expect(observableOfNodeInfo).to.be.equals(observableOfNodeInfo);
        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNodeRepository(): NodeRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', {
            networkType: NetworkType.MIJIN_TEST,
        });

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
        const observableOfBlockInfo = observableOf(expectedNetworkType).pipe(
            map((v) => {
                counter++;
                return v;
            }),
        );
        when(repositoryMock.getNetworkType()).thenReturn(observableOfBlockInfo);

        expect(observableOfBlockInfo).to.be.equals(observableOfBlockInfo);

        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', {
            generationHash: 'testHash',
        });

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
        const observableOfBlockInfo = observableOf(expectedNetworkType).pipe(
            map((v) => {
                counter++;
                return v;
            }),
        );
        when(repositoryMock.getNetworkType()).thenReturn(observableOfBlockInfo);

        expect(observableOfBlockInfo).to.be.equals(observableOfBlockInfo);

        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', {
            networkType: expectedNetworkType,
            generationHash: 'testHash',
        });

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

    it('Should create listener object using injected ws', () => {
        class WebSocketMock {
            constructor(public readonly url: string) {}

            send(payload: string): void {
                throw new Error(payload);
            }
        }

        const namespaceRepository: NamespaceRepository = mock();
        let repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNamespaceRepository(): NamespaceRepository {
                return instance(namespaceRepository);
            }
        })('http://localhost:3000', {
            networkType: NetworkType.MIJIN_TEST,
            generationHash: 'testHash',
            websocketInjected: WebSocketMock,
        });

        let listener = repositoryFactory.createListener();
        expect(listener.url).to.be.equal('http://localhost:3000/ws');

        repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNamespaceRepository(): NamespaceRepository {
                return instance(namespaceRepository);
            }
        })('http://localhost:3000', {
            networkType: NetworkType.MIJIN_TEST,
            generationHash: 'testHash',
            websocketUrl: 'ws://localhost:3000/ws',
            websocketInjected: WebSocketMock,
        });

        listener = repositoryFactory.createListener();
        expect(listener.url).to.be.equal('ws://localhost:3000/ws');
    });

    it('Should create listener object using injected ws', () => {
        const factory = new RepositoryFactoryHttp('url', {
            networkType: NetworkType.MIJIN_TEST,
            generationHash: 'testHash',
        });

        expect(factory.createAccountRepository() instanceof AccountHttp).to.be.true;
        expect(factory.createBlockRepository() instanceof BlockHttp).to.be.true;
        expect(factory.createChainRepository() instanceof ChainHttp).to.be.true;
        expect(factory.createListener() instanceof Listener).to.be.true;
        expect(factory.createMetadataRepository() instanceof MetadataHttp).to.be.true;
        expect(factory.createMosaicRepository() instanceof MosaicHttp).to.be.true;
        expect(factory.createMultisigRepository() instanceof MultisigHttp).to.be.true;
        expect(factory.createNamespaceRepository() instanceof NamespaceHttp).to.be.true;
        expect(factory.createNetworkRepository() instanceof NetworkHttp).to.be.true;
        expect(factory.createNodeRepository() instanceof NodeHttp).to.be.true;
        expect(factory.createReceiptRepository() instanceof ReceiptHttp).to.be.true;
        expect(factory.createRestrictionAccountRepository() instanceof RestrictionAccountHttp).to.be.true;
        expect(factory.createRestrictionMosaicRepository() instanceof RestrictionMosaicHttp).to.be.true;
        expect(factory.createTransactionRepository() instanceof TransactionHttp).to.be.true;
        expect(factory.createTransactionStatusRepository() instanceof TransactionStatusHttp).to.be.true;
    });
});
