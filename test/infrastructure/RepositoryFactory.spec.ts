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
import { firstValueFrom, of as observableOf, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NetworkConfigurationDTO, NodeRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, when } from 'ts-mockito';
import {
    AccountHttp,
    BlockHttp,
    ChainHttp,
    FinalizationHttp,
    HashLockHttp,
    Listener,
    MetadataHttp,
    MosaicHttp,
    MultisigHttp,
    NamespaceHttp,
    NamespaceRepository,
    NetworkHttp,
    NetworkRepository,
    NodeHttp,
    NodeRepository,
    ReceiptHttp,
    RepositoryFactoryHttp,
    RestrictionAccountHttp,
    RestrictionMosaicHttp,
    SecretLockHttp,
    TransactionGroup,
    TransactionHttp,
    TransactionStatusHttp,
} from '../../src/infrastructure';
import { NetworkCurrencies } from '../../src/model/mosaic';
import { NodeInfo } from '../../src/model/node';
import { TestNetworkType } from '../conf/conf.spec';

describe('RepositoryFactory', () => {
    it('Should create repositories', () => {
        const repositoryFactory = new RepositoryFactoryHttp('http://localhost:3000', {
            networkType: TestNetworkType,
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
        expect(repositoryFactory.createHashLockRepository()).to.be.not.null;
        expect(repositoryFactory.createSecretLockRepository()).to.be.not.null;
        expect(repositoryFactory.createFinalizationRepository()).to.be.not.null;
    });

    it('Raise error without unhandled-rejections', async () => {
        const nodeRoutesApi: NodeRoutesApi = mock();

        const fetchResponseMock: Partial<Response> = {
            status: 666,
            statusText: 'Some status text error',
            text: () => Promise.resolve('This is the body'),
        };
        when(nodeRoutesApi.getNodeHealth()).thenReturn(Promise.reject(fetchResponseMock));
        const url = 'https://invalid';
        const repositoryFactory = new RepositoryFactoryHttp(url);
        try {
            const nodeRepository = repositoryFactory.createNodeRepository();
            (nodeRepository as any).nodeRoutesApi = instance(nodeRoutesApi);
            await firstValueFrom(nodeRepository.getNodeHealth());
            expect(true).to.be.false;
        } catch (e) {
            expect(e.message).eq('{"statusCode":666,"statusMessage":"Some status text error","body":"This is the body"}');
        }
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
            networkType: TestNetworkType,
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

    it('Should get nodePubicKey from cache', (done) => {
        let counter = 0;
        const repositoryMock: NodeRepository = mock();
        const observableOfNodeInfo = observableOf({ nodePublicKey: 'aaaa' } as NodeInfo).pipe(
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
            networkType: TestNetworkType,
        });

        expect(counter).to.be.equals(0);
        repositoryFactory.getNodePublicKey().subscribe((gh) => {
            expect(counter).to.be.equals(1);
            expect(gh).to.be.equals('aaaa');
            repositoryFactory.getNodePublicKey().subscribe((g) => {
                expect(counter).to.be.equals(1);
                expect(g).to.be.equals('aaaa');
                repositoryFactory.getNodePublicKey().subscribe((h) => {
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
        const expectedNetworkType = TestNetworkType;
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
            epochAdjustment: 1573430400,
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

    it('Should get epochAdjustment from cache', (done) => {
        let counter = 0;
        const repositoryMock: NetworkRepository = mock();
        const expectedepochAdjustment = 1573430400;
        const body: NetworkConfigurationDTO = {
            network: {
                identifier: 'public-test',
                nemesisSignerPublicKey: 'E3F04CA92250B49679EBEF98FAC87C1CECAC7E7491ECBB2307DF1AD65BED57FD',
                generationHashSeed: 'AE6488282F9C09457F017BE5EE26387B21EB15CF32D6DA1E9846C25E00828329',
                epochAdjustment: '1573430400s',
            },
            chain: {},
            plugins: {},
        };
        const observableOfNetworkProperties = observableOf(body).pipe(
            map((v) => {
                counter++;
                return v;
            }),
        );
        when(repositoryMock.getNetworkProperties()).thenReturn(observableOfNetworkProperties);

        expect(observableOfNetworkProperties).to.be.equals(observableOfNetworkProperties);

        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', {
            generationHash: 'testHash',
            networkType: 152,
        });

        expect(counter).to.be.equals(0);
        repositoryFactory.getEpochAdjustment().subscribe((epoch) => {
            expect(counter).to.be.equals(1);
            expect(epoch).to.be.equals(expectedepochAdjustment);
            repositoryFactory.getEpochAdjustment().subscribe((network) => {
                expect(counter).to.be.equals(1);
                expect(network).to.be.equals(expectedepochAdjustment);
                done();
            });
        });
    });

    it('Should get NetworkType from memory', (done) => {
        let counter = 0;

        const repositoryMock: NetworkRepository = mock();

        const expectedNetworkType = TestNetworkType;
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
            epochAdjustment: 1573430400,
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

    it('Should get epochAdjustment from memory', (done) => {
        let counter = 0;

        const repositoryMock: NetworkRepository = mock();
        const expectedepochAdjustment = 1573430400;
        const body: NetworkConfigurationDTO = {
            network: {
                identifier: 'public-test',
                nemesisSignerPublicKey: 'E3F04CA92250B49679EBEF98FAC87C1CECAC7E7491ECBB2307DF1AD65BED57FD',
                generationHashSeed: 'AE6488282F9C09457F017BE5EE26387B21EB15CF32D6DA1E9846C25E00828329',
                epochAdjustment: '1573430400s',
            },
            chain: {},
            plugins: {},
        };
        const observableOfNetworkProperties = observableOf(body).pipe(
            map((v) => {
                counter++;
                return v;
            }),
        );
        when(repositoryMock.getNetworkProperties()).thenReturn(observableOfNetworkProperties);

        expect(observableOfNetworkProperties).to.be.equals(observableOfNetworkProperties);

        const repositoryFactory = new (class RepositoryFactoryHttpForTest extends RepositoryFactoryHttp {
            createNetworkRepository(): NetworkRepository {
                return instance(repositoryMock);
            }
        })('http://localhost:3000', {
            networkType: 152,
            generationHash: 'testHash',
            epochAdjustment: 1573430400,
        });

        expect(counter).to.be.equals(0);
        repositoryFactory.getEpochAdjustment().subscribe((networkType) => {
            expect(counter).to.be.equals(0);
            expect(networkType).to.be.equals(expectedepochAdjustment);
            repositoryFactory.getEpochAdjustment().subscribe((network) => {
                expect(counter).to.be.equals(0);
                expect(network).to.be.equals(expectedepochAdjustment);
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
            networkType: TestNetworkType,
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
            networkType: TestNetworkType,
            generationHash: 'testHash',
            websocketUrl: 'ws://localhost:3000/ws',
            websocketInjected: WebSocketMock,
        });

        listener = repositoryFactory.createListener();
        expect(listener.url).to.be.equal('ws://localhost:3000/ws');
    });

    it('Should create listener object using injected ws', () => {
        const factory = new RepositoryFactoryHttp('url', {
            networkType: TestNetworkType,
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
        expect(factory.createHashLockRepository() instanceof HashLockHttp).to.be.true;
        expect(factory.createSecretLockRepository() instanceof SecretLockHttp).to.be.true;
        expect(factory.createFinalizationRepository() instanceof FinalizationHttp).to.be.true;
    });

    it('Fail remote call ', async () => {
        const factory = new RepositoryFactoryHttp('http://localhost:2000');
        try {
            await firstValueFrom(factory.getGenerationHash());
            expect(true).eq(false);
        } catch (e) {
            expect(e.message).contains('request to http://localhost:2000');
        }
    });

    it('Fail remote call invalid transaction', async () => {
        const factory = new RepositoryFactoryHttp('http://localhost:3000');
        try {
            await firstValueFrom(factory.createTransactionRepository().getTransaction('abc', TransactionGroup.Confirmed));
            expect(true).eq(false);
        } catch (e) {
            if (await firstValueFrom(factory.getGenerationHash().pipe(catchError(() => of(false))))) {
                expect(e.message).contains('"statusCode":500,"statusMessage":"Internal Server Error"');
            } else {
                expect(e.message).contains('request to http://localhost:3000');
            }
        }
    });

    it('Fail remote getCurrencies ', async () => {
        const factory = new RepositoryFactoryHttp('http://localhost:2000');
        try {
            await firstValueFrom(factory.getCurrencies());
            expect(true).eq(false);
        } catch (e) {
            expect(e.message).contains('request to http://localhost:2000');
        }
    });

    it('getCurrencies', async () => {
        const factory = new RepositoryFactoryHttp('http://localhost:2000', { networkCurrencies: NetworkCurrencies.PUBLIC });
        const networkCurrencies = await firstValueFrom(factory.getCurrencies());
        expect(networkCurrencies).eq(NetworkCurrencies.PUBLIC);
    });
});
