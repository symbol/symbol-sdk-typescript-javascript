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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IListener } from '../../src/infrastructure/IListener';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { RepositoryFactoryHttp } from '../../src/infrastructure/RepositoryFactoryHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransactionService } from '../../src/service/TransactionService';
import { NetworkHarvestLocal } from '../../src/model/mosaic/NetworkHarvestLocal';
import { NetworkCurrencyPublic } from '../../src/model/mosaic/NetworkCurrencyPublic';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';

export class IntegrationTestHelper {
    public readonly yaml = require('js-yaml');
    public apiUrl: string;
    public repositoryFactory: RepositoryFactory;
    public account: Account;
    public account2: Account;
    public account3: Account;
    public multisigAccount: Account;
    public cosignAccount1: Account;
    public cosignAccount2: Account;
    public cosignAccount3: Account;
    public cosignAccount4: Account;
    public networkType: NetworkType;
    public generationHash: string;
    public listener: IListener;
    public maxFee: bigint;
    public harvestingAccount: Account;
    public transactionService: TransactionService;
    public networkCurrencyNamespaceId: NamespaceId;
    public networkCurrencyDivisibility: number;

    start(): Promise<IntegrationTestHelper> {
        return new Promise<IntegrationTestHelper>(
            (resolve, reject) => {

                const path = require('path');
                require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, jsonData) => {
                    if (err) {
                        return reject(err);
                    }
                    const json = JSON.parse(jsonData);
                    console.log(`Running tests against: ${json.apiUrl}`);
                    this.apiUrl = json.apiUrl;
                    this.repositoryFactory = new RepositoryFactoryHttp(json.apiUrl);
                    this.transactionService = new TransactionService(
                        this.repositoryFactory.createTransactionRepository(), this.repositoryFactory.createReceiptRepository());
                    combineLatest(this.repositoryFactory.getGenerationHash(),
                        this.repositoryFactory.getNetworkType()).subscribe(([generationHash, networkType]) => {
                        this.networkType = networkType;
                        this.generationHash = generationHash;
                        this.account = this.createAccount(json.testAccount);
                        this.account2 = this.createAccount(json.testAccount2);
                        this.account3 = this.createAccount(json.testAccount3);
                        this.multisigAccount = this.createAccount(json.multisigAccount);
                        this.cosignAccount1 = this.createAccount(json.cosignatoryAccount);
                        this.cosignAccount2 = this.createAccount(json.cosignatory2Account);
                        this.cosignAccount3 = this.createAccount(json.cosignatory3Account);
                        this.cosignAccount4 = this.createAccount(json.cosignatory4Account);
                        this.harvestingAccount = this.createAccount(json.harvestingAccount);
                        this.listener = this.repositoryFactory.createListener();

                        // What would be the best maxFee? In the future we will load the fee multiplier from rest.
                        this.maxFee = BigInt(1000000);

                        // network Currency
                        this.networkCurrencyNamespaceId = this.apiUrl.toLowerCase().includes('localhost') ?
                            NetworkCurrencyLocal.NAMESPACE_ID : NetworkCurrencyPublic.NAMESPACE_ID;
                        this.networkCurrencyDivisibility = this.apiUrl.toLowerCase().includes('localhost') ?
                            NetworkCurrencyLocal.DIVISIBILITY : NetworkCurrencyPublic.DIVISIBILITY;

                        const bootstrapRoot = process.env.CATAPULT_SERVICE_BOOTSTRAP || path.resolve(__dirname, '../../../../catapult-service-bootstrap');
                        const bootstrapPath = `${bootstrapRoot}/build/generated-addresses/addresses.yaml`;
                        require('fs').readFile(bootstrapPath, (error: any, yamlData: any) => {
                            if (error) {
                                console.log(`catapult-service-bootstrap generated address could not be loaded from path ${bootstrapPath}. Ignoring and using accounts from network.conf.`);
                                return resolve(this);
                            } else {
                                console.log(`catapult-service-bootstrap generated address loaded from path ${bootstrapPath}.`);
                                const parsedYaml = this.yaml.safeLoad(yamlData);
                                this.account = this.createAccount(parsedYaml.nemesis_addresses[0]);
                                this.account2 = this.createAccount(parsedYaml.nemesis_addresses[1]);
                                this.account3 = this.createAccount(parsedYaml.nemesis_addresses[2]);
                                this.multisigAccount = this.createAccount(parsedYaml.nemesis_addresses[3]);
                                this.cosignAccount1 = this.createAccount(parsedYaml.nemesis_addresses[4]);
                                this.cosignAccount4 = this.createAccount(parsedYaml.nemesis_addresses[5]);
                                this.harvestingAccount = this.createAccount(parsedYaml.nemesis_addresses_harvesting[0]);
                                return resolve(this);
                            }
                        });
                    }, (error) => {
                        console.log('There has been an error loading the configuration. ', error);
                        return reject(error);
                    });
                });

            },
        );
    }

    createAccount(data): Account {
        return Account.createFromPrivateKey(data.privateKey ? data.privateKey : data.private, this.networkType);
    }

    createNetworkCurrency(amount: number, isRelative: boolean = true): NetworkCurrencyPublic | NetworkCurrencyLocal {
        if (this.apiUrl.toLowerCase().includes('localhost')) {
            return isRelative ? NetworkCurrencyLocal.createRelative(amount) : NetworkCurrencyLocal.createAbsolute(amount);
        }
        return isRelative ? NetworkCurrencyPublic.createRelative(amount) : NetworkCurrencyPublic.createAbsolute(amount);
    }

    announce(signedTransaction: SignedTransaction): Promise<Transaction> {
        console.log(`Announcing transaction: ${signedTransaction.type}`);
        return this.transactionService.announce(signedTransaction, this.listener).pipe(map((t) => {
            console.log(`Transaction ${signedTransaction.type} confirmed`);
            return t;
        })).toPromise();
    }
}
