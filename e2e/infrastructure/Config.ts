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
import { Account } from "../../src/model/account/Account";
import { RepositoryFactoryHttp } from "../../src/infrastructure/RepositoryFactoryHttp";
import { RepositoryFactory } from "../../src/infrastructure/RepositoryFactory";
import { NetworkType } from "../../src/model/blockchain/NetworkType";
import { combineLatest } from "rxjs";
import { Listener } from "../../src/infrastructure/Listener";
import { SignedTransaction } from "../../src/model/transaction/SignedTransaction";
import { assert } from "chai";
import { filter } from "rxjs/operators";

const yaml = require('js-yaml');

export class Config {

    public apiUrl: string;
    public repositoryFactory: RepositoryFactory;
    public account: Account;
    public account2: Account;
    public account3: Account;
    public multisigAccount: Account;
    public cosignAccount1: Account;
    public cosignAccount2: Account;
    public cosignAccount3: Account;
    public networkType: NetworkType;
    public generationHash: string;
    public listener: Listener;


    constructor(done) {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, jsonData) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(jsonData);
            console.log(`Running tests against: ${json.apiUrl}`);
            this.apiUrl = json.apiUrl;
            this.listener = new Listener(this.apiUrl);
            this.repositoryFactory = new RepositoryFactoryHttp(json.apiUrl);
            combineLatest(this.repositoryFactory.getGenerationHash(), this.repositoryFactory.getNetworkType()).subscribe(([generationHash, networkType]) => {
                this.networkType = networkType;
                this.generationHash = generationHash;
                this.account = this.createAccount(json.testAccount);
                this.account2 = this.createAccount(json.testAccount2);
                this.account3 = this.createAccount(json.testAccount3);
                this.multisigAccount = this.createAccount(json.multisigAccount);
                this.cosignAccount1 = this.createAccount(json.cosignatoryAccount);
                this.cosignAccount2 = this.createAccount(json.cosignatory2Account);
                this.cosignAccount3 = this.createAccount(json.cosignatory3Account);

                require('fs').readFile(path.resolve(__dirname, '../../../catapult-service-bootstrap/build/generated-addresses/addresses.yaml'), (err, yamlData) => {
                    if (err) {
                        console.log(`catapult-service-bootstrap generated address could not be loaded. Ignoring and using accounts from network.conf. Error: ${err}`);
                        done()
                    } else {
                        const parsedYaml = yaml.safeLoad(yamlData);
                        this.account = this.createAccount(parsedYaml.nemesis_addresses[0]);
                        this.account2 = this.createAccount(parsedYaml.nemesis_addresses[1]);
                        this.account3 = this.createAccount(parsedYaml.nemesis_addresses[2]);
                        this.multisigAccount = this.createAccount(parsedYaml.nemesis_addresses[3]);
                        this.cosignAccount1 = this.createAccount(parsedYaml.nemesis_addresses[4]);
                        done();
                    }
                });
            });
        });
    }

    createAccount(data): Account {
        return Account.createFromPrivateKey(data.privateKey ? data.privateKey : data.private, this.networkType);
    }

    announceTransaction(signedTransaction: SignedTransaction, done) {
        const address = signedTransaction.getSignerAddress();
        console.log(`Announcing transaction: ${signedTransaction.type}`);
        this.listener.confirmed(address, signedTransaction.hash).subscribe(() => {
            console.log(`Transaction ${signedTransaction.type} confirmed`);
            done();
        });
        this.listener.status(address).pipe(filter(status => status.hash === signedTransaction.hash)).subscribe((error) => {
            console.log(`Error processing transaction ${signedTransaction.type}`, error);
            assert(false);
            done();
        });
        this.repositoryFactory.createTransactionRepository().announce(signedTransaction);
    };
}
