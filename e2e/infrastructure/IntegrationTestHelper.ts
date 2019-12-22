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
import { filter } from 'rxjs/operators';
import { IListener } from '../../src/infrastructure/IListener';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { RepositoryFactoryHttp } from '../../src/infrastructure/RepositoryFactoryHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { Transaction } from '../../src/model/transaction/Transaction';
import { UInt64 } from '../../src/model/UInt64';

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
    public maxFee: UInt64;
    public harvestingAccount: Account;

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
                        this.maxFee = UInt64.fromUint(1000000);

                        require('fs').readFile(path.resolve(__dirname,
                                '../../../catapult-service-bootstrap/build/generated-addresses/addresses.yaml'),
                                    (error: any, yamlData: any) => {
                            if (error) {
                                console.log(`catapult-service-bootstrap generated address could not be loaded.
                                    Ignoring and using accounts from network.conf. Error: ${error}`);
                                return resolve(this);
                            } else {
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

    announce(signedTransaction: SignedTransaction): Promise<Transaction> {
        return new Promise<Transaction>(
            (resolve, reject) => {
                const address = signedTransaction.getSignerAddress();
                console.log(`Announcing transaction: ${signedTransaction.type}`);
                this.listener.confirmed(address, signedTransaction.hash).subscribe((transaction) => {
                    console.log(`Transaction ${signedTransaction.type} confirmed`);
                    resolve(transaction);
                });
                this.listener.status(address).pipe(filter((status) => status.hash === signedTransaction.hash)).subscribe((error) => {
                    console.log(`Error processing transaction ${signedTransaction.type}`, error);
                    reject(error);
                });
                this.repositoryFactory.createTransactionRepository().announce(signedTransaction);
            },
        );
    }
}
