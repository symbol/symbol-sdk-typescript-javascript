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

import { DiagnosticRoutesApi } from 'nem2-sdk-openapi-typescript-node-client';
import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BlockchainStorageInfo } from '../model/blockchain/BlockchainStorageInfo';
import { ServerInfo } from '../model/diagnostic/ServerInfo';
import { DiagnosticRepository } from './DiagnosticRepository';
import { Http } from './Http';

/**
 * Diagnostic http repository.
 *
 * @since 1.0
 */
export class DiagnosticHttp extends Http implements DiagnosticRepository {
    /**
     * @internal
     * Nem2 Library diagnostic routes api
     */
    private diagnosticRoutesApi: DiagnosticRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.diagnosticRoutesApi = new DiagnosticRoutesApi(url);
    }

    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    public getDiagnosticStorage(): Observable<BlockchainStorageInfo> {
        return observableFrom(
            this.diagnosticRoutesApi.getDiagnosticStorage()).pipe(
                map(({body}) => new BlockchainStorageInfo(
                        body.numBlocks,
                        body.numTransactions,
                        body.numAccounts,
                    )),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    public getServerInfo(): Observable<ServerInfo> {
        return observableFrom(
            this.diagnosticRoutesApi.getServerInfo()).pipe(
                map(({body}) => new ServerInfo(body.serverInfo.restVersion, body.serverInfo.sdkVersion)),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
