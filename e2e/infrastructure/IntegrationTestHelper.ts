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
import { map } from 'rxjs/operators';
import { Addresses, BootstrapService, BootstrapUtils, Preset, StartParams } from 'symbol-bootstrap';
import { IListener } from '../../src/infrastructure/IListener';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { RepositoryFactoryHttp } from '../../src/infrastructure/RepositoryFactoryHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { NetworkCurrencyPublic } from '../../src/model/mosaic/NetworkCurrencyPublic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { Transaction } from '../../src/model/transaction/Transaction';
import { UInt64 } from '../../src/model/UInt64';
import { TransactionService } from '../../src/service/TransactionService';

export class IntegrationTestHelper {
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
    public transactionService: TransactionService;
    public networkCurrencyNamespaceId: NamespaceId;
    public networkCurrencyDivisibility: number;
    public service = new BootstrapService();
    public config: StartParams;
    public startEachTime = true;
    public epochAdjustment: number;

    private async startBootstrapServer(): Promise<{ accounts: string[]; apiUrl: string }> {
        this.config = {
            report: false,
            preset: Preset.bootstrap,
            reset: this.startEachTime,
            customPreset: './e2e/e2e-preset.yml',
            timeout: 60000 * 3,
            target: 'target/bootstrap-test',
            detached: false,
            user: 'current',
        };

        console.log('Starting bootstrap server');
        const configResult = await this.service.start({ ...this.config, detached: true });
        return this.toAccounts(configResult.addresses);
    }
    private async loadBootstrap(): Promise<{ accounts: string[]; apiUrl: string }> {
        const target = 'target/bootstrap-test';
        console.log('Loading bootstrap server');
        const addresses = BootstrapUtils.loadExistingAddresses(target);
        return this.toAccounts(addresses);
    }

    private toAccounts(addresses: Addresses): { accounts: string[]; apiUrl: string } {
        const accounts = addresses?.mosaics?.[0].accounts.map((n) => n.privateKey);
        if (!accounts) {
            throw new Error('Nemesis accounts could not be loaded!');
        }
        return { accounts, apiUrl: 'http://localhost:3000' };
    }

    async close(): Promise<void> {
        if (this.listener && this.listener.isOpen()) await this.listener.close();
        if (this.config && this.startEachTime) {
            console.log('Stopping bootstrap server....');
            await this.service.stop(this.config);
            await BootstrapUtils.sleep(2000);
        }
    }

    async start({ openListener }: { openListener: boolean }): Promise<IntegrationTestHelper> {
        // await this.service.stop(this.config);
        const config = await this.loadBootstrap();
        const accounts = config.accounts;
        this.apiUrl = config.apiUrl;
        this.repositoryFactory = new RepositoryFactoryHttp(this.apiUrl);
        this.transactionService = new TransactionService(
            this.repositoryFactory.createTransactionRepository(),
            this.repositoryFactory.createReceiptRepository(),
        );

        this.networkType = await this.repositoryFactory.getNetworkType().toPromise();
        this.generationHash = await this.repositoryFactory.getGenerationHash().toPromise();
        this.epochAdjustment = await this.repositoryFactory.getEpochAdjustment().toPromise();

        let index = 0;
        this.account = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.account2 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.account3 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.multisigAccount = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.cosignAccount1 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.cosignAccount2 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.cosignAccount3 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.cosignAccount4 = Account.createFromPrivateKey(accounts[index++], this.networkType);
        this.harvestingAccount = Account.createFromPrivateKey(accounts[index++], this.networkType);

        this.listener = this.repositoryFactory.createListener();

        // What would be the best maxFee? In the future we will load the fee multiplier from rest.
        this.maxFee = UInt64.fromUint(1000000);
        this.networkCurrencyNamespaceId = this.apiUrl.toLowerCase().includes('localhost')
            ? NetworkCurrencyLocal.NAMESPACE_ID
            : NetworkCurrencyPublic.NAMESPACE_ID;
        this.networkCurrencyDivisibility = this.apiUrl.toLowerCase().includes('localhost')
            ? NetworkCurrencyLocal.DIVISIBILITY
            : NetworkCurrencyPublic.DIVISIBILITY;

        if (openListener) {
            await this.listener.open();
        }
        return this;
    }

    createNetworkCurrency(amount: number, isRelative = true): NetworkCurrencyPublic | NetworkCurrencyLocal {
        if (this.apiUrl.toLowerCase().includes('localhost')) {
            return isRelative ? NetworkCurrencyLocal.createRelative(amount) : NetworkCurrencyLocal.createAbsolute(amount);
        }
        return isRelative ? NetworkCurrencyPublic.createRelative(amount) : NetworkCurrencyPublic.createAbsolute(amount);
    }

    announce(signedTransaction: SignedTransaction): Promise<Transaction> {
        console.log(`Announcing transaction: ${signedTransaction.type}`);
        return this.transactionService
            .announce(signedTransaction, this.listener)
            .pipe(
                map((t) => {
                    console.log(`Transaction ${signedTransaction.type} confirmed`);
                    return t;
                }),
            )
            .toPromise();
    }

    public static sleep(ms: number): Promise<any> {
        // Create a promise that rejects in <ms> milliseconds
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
}
