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

import {ApiClient} from "../ApiClient";

export declare class AccountRoutesApi {
    constructor(apiClient?: ApiClient);

    getAccountInfo(accountId: string): Promise<any>;

    getAccountsInfo(accountIds: any): Promise<any>;

    getAccountMultisig(accountId: string): Promise<any>;

    getAccountMultisigGraph(accountId: string): Promise<any>;
    
    getAccountPropertiesFromAccounts(addresses: string[]): Promise<any[]>;

    getAccountProperties(accountId: string): Promise<any>; 

    incomingTransactions(accountPublicKey: string, queryParams: any): Promise<any[]>;

    outgoingTransactions(accountPublicKey: string, queryParams: any): Promise<any[]>;

    partialTransactions(accountPublicKey: string, queryParams: any): Promise<any[]>;

    transactions(accountPublicKey: string, queryParams: any): Promise<any[]>;

    unconfirmedTransactions(accountPublicKey: string, queryParams: any): Promise<any[]>;
}