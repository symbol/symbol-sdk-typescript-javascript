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

import { Observable, of as observableOf } from "rxjs";
import { NetworkType } from "../model/blockchain/NetworkType";
import { AccountRepository } from "./AccountRepository";
import { MultisigRepository } from "./MultisigRepository";
import { ReceiptRepository } from "./ReceiptRepository";
import { BlockRepository } from "./BlockRepository";
import { ChainRepository } from "./ChainRepository";
import { DiagnosticRepository } from "./DiagnosticRepository";
import { MosaicRepository } from "./MosaicRepository";
import { NamespaceRepository } from "./NamespaceRepository";
import { NetworkRepository } from "./NetworkRepository";
import { NodeRepository } from "./NodeRepository";
import { TransactionRepository } from "./TransactionRepository";
import { MetadataRepository } from "./MetadataRepository";
import { RestrictionAccountRepository } from "./RestrictionAccountRespository";
import { RestrictionMosaicRepository } from "./RestrictionMosaicRespository";
import { RepositoryFactory } from "./RepositoryFactory";
import { AccountHttp } from "./AccountHttp";
import { BlockHttp } from "./BlockHttp";
import { ChainHttp } from "./ChainHttp";
import { DiagnosticHttp } from "./DiagnosticHttp";
import { MetadataHttp } from "./MetadataHttp";
import { MosaicHttp } from "./MosaicHttp";
import { MultisigHttp } from "./MultisigHttp";
import { NamespaceHttp } from "./NamespaceHttp";
import { NetworkHttp } from "./NetworkHttp";
import { NodeHttp } from "./NodeHttp";
import { ReceiptHttp } from "./ReceiptHttp";
import { RestrictionAccountHttp } from "./RestrictionAccountHttp";
import { RestrictionMosaicHttp } from "./RestrictionMosaicHttp";
import { TransactionHttp } from "./TransactionHttp";
import { share, map, shareReplay } from "rxjs/operators";

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
     */
    constructor(url: string, networkType?: NetworkType) {
        this.url = url;
        this.networkType = networkType ? observableOf(networkType) : this.createNetworkRepository().getNetworkType().pipe(shareReplay(1));
        this.generationHash = this.createBlockRepository().getBlockByHeight('1').pipe(map(b => b.generationHash)).pipe(shareReplay(1));
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

    createDiagnosticRepository(): DiagnosticRepository {
        return new DiagnosticHttp(this.url);
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
        return new ReceiptHttp(this.url);
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

    getGenerationHash(): Observable<String> {
        return this.generationHash;
    }

    getNetworkType(): Observable<NetworkType> {
        return this.networkType;
    }

}