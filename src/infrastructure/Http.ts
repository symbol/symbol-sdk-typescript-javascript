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

import { NodeRoutesApi } from 'nem2-sdk-openapi-typescript-node-client';
// tslint:disable-next-line: ordered-imports
import { from as observableFrom, Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { NetworkType } from '../model/blockchain/NetworkType';
import { QueryParams } from './QueryParams';
import { TransactionFilter } from './TransactionFilter';

/**
 * Http extended by all http services
 */
export abstract class Http {
    protected readonly url: string;

    /**
     * Constructor
     * @param url Base catapult-rest url
     */
    constructor(url: string) {
        this.url = url;
    }

    createNetworkTypeObservable(networkType?: NetworkType | Observable<NetworkType>): Observable<NetworkType> {
        if (networkType && networkType instanceof Observable) {
            return networkType as Observable<NetworkType>;
        } else if (networkType) {
            return observableOf(networkType as NetworkType);
        } else {
            return observableFrom(new NodeRoutesApi(this.url).getNodeInfo()).pipe(
                map(({body}) => body.networkIdentifier),
                catchError((error) => throwError(this.errorHandling(error))),
            ).pipe(shareReplay(1));
        }
    }

    queryParams(queryParams?: QueryParams): any {
        return {
            pageSize: queryParams ? queryParams.pageSize : undefined,
            id: queryParams ? queryParams.id : undefined,
            ordering: queryParams ? queryParams.order : undefined,
        };
    }

    transactionFilter(filter?: TransactionFilter): any {
        return {
            type: filter ? filter.convertCSV(filter.types) : undefined,
        };
    }

    errorHandling(error: any): Error {
        if (error.response && error.response.statusCode && error.body) {
            const formattedError = {
                statusCode: error.response.statusCode,
                errorDetails: {
                    statusCode: error.response.statusCode,
                    statusMessage: error.response.statusMessage,
                },
                body: error.body,
            };
            return new Error(JSON.stringify(formattedError));
        }
        if (error.code && error.address && error.code === 'ECONNREFUSED') {
            return new Error(`Cannot reach node: ${error.address}:${error.port}`);
        }
        return new Error(error);
    }
}
