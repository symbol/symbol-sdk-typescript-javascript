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

import { Observable, of as observableOf } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { NetworkType } from '../model/network/NetworkType';
import { UInt64 } from '../model/UInt64';
import { AccountHttp } from './AccountHttp';
import { AccountRepository } from './AccountRepository';
import { BlockHttp } from './BlockHttp';
import { BlockRepository } from './BlockRepository';
import { ChainHttp } from './ChainHttp';
import { ChainRepository } from './ChainRepository';
import { IListener } from './IListener';
import { Listener } from './Listener';
import { MetadataHttp } from './MetadataHttp';
import { MetadataRepository } from './MetadataRepository';
import { MosaicHttp } from './MosaicHttp';
import { MosaicRepository } from './MosaicRepository';
import { MultisigHttp } from './MultisigHttp';
import { MultisigRepository } from './MultisigRepository';
import { NamespaceHttp } from './NamespaceHttp';
import { NamespaceRepository } from './NamespaceRepository';
import { NetworkHttp } from './NetworkHttp';
import { NetworkRepository } from './NetworkRepository';
import { NodeHttp } from './NodeHttp';
import { NodeRepository } from './NodeRepository';
import { ReceiptHttp } from './ReceiptHttp';
import { ReceiptRepository } from './ReceiptRepository';
import { RepositoryFactory } from './RepositoryFactory';
import { RestrictionAccountHttp } from './RestrictionAccountHttp';
import { RestrictionAccountRepository } from './RestrictionAccountRepository';
import { RestrictionMosaicHttp } from './RestrictionMosaicHttp';
import { RestrictionMosaicRepository } from './RestrictionMosaicRepository';
import { TransactionHttp } from './TransactionHttp';
import { TransactionRepository } from './TransactionRepository';

/**
 * Receipt http repository.
 *
 */
export class RepositoryFactoryHttp implements RepositoryFactory {

    private readonly url: string;
    private readonly networkType: Observable<NetworkType>;
    private readonly generationHash: Observable<string>;

    /**
     * Constructor
     * @param url the server url.
     * @param networkType optional network type if you don't want to load it from the server.
     * @param generationHash optional node generation hash if you don't want to load it from the server.
     */
    constructor(url: string, networkType?: NetworkType, generationHash?: string) {
        this.url = url;
        this.networkType = networkType ? observableOf(networkType) : this.createNetworkRepository().getNetworkType().pipe(shareReplay(1));
        this.generationHash = generationHash ? observableOf(generationHash) :
            this.createBlockRepository().getBlockByHeight(UInt64.fromUint(1)).pipe(map((b) => b.generationHash)).pipe(shareReplay(1));
    }

    createAccountRepository(): AccountRepository {
        return new AccountHttp(this.url);
    }

    createBlockRepository(): BlockRepository {
        return new BlockHttp(this.url);
    }

    createChainRepository(): ChainRepository {
        return new ChainHttp(this.url);
    }

    createMetadataRepository(): MetadataRepository {
        return new MetadataHttp(this.url);
    }

    createMosaicRepository(): MosaicRepository {
        return new MosaicHttp(this.url, this.networkType);
    }

    createMultisigRepository(): MultisigRepository {
        return new MultisigHttp(this.url, this.networkType);
    }

    createNamespaceRepository(): NamespaceRepository {
        return new NamespaceHttp(this.url, this.networkType);
    }

    createNetworkRepository(): NetworkRepository {
        return new NetworkHttp(this.url);
    }

    createNodeRepository(): NodeRepository {
        return new NodeHttp(this.url);
    }

    createReceiptRepository(): ReceiptRepository {
        return new ReceiptHttp(this.url, this.networkType);
    }

    createRestrictionAccountRepository(): RestrictionAccountRepository {
        return new RestrictionAccountHttp(this.url);
    }

    createRestrictionMosaicRepository(): RestrictionMosaicRepository {
        return new RestrictionMosaicHttp(this.url);
    }

    createTransactionRepository(): TransactionRepository {
        return new TransactionHttp(this.url);
    }

    getGenerationHash(): Observable<string> {
        return this.generationHash;
    }

    getNetworkType(): Observable<NetworkType> {
        return this.networkType;
    }

    createListener(): IListener {
        return new Listener(this.url);
    }
}
