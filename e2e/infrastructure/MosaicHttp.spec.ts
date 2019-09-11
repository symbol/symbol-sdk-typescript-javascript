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
import {assert, expect} from 'chai';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {MosaicHttp} from '../../src/infrastructure/MosaicHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../src/model/mosaic/MosaicProperties';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../src/model/UInt64';

describe('MosaicHttp', () => {
    let mosaicId: MosaicId;
    let mosaicHttp: MosaicHttp;
    let account: Account;
    let config;
    let namespaceId: NamespaceId;
    let transactionHttp: TransactionHttp;
    let generationHash: string;
    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            mosaicHttp = new MosaicHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            generationHash = json.generationHash;
            done();
        });
    });

    /**
     * =========================
     * Setup Test Data
     * =========================
     */
    describe('Setup test MosaicId', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce MosaicDefinitionTransaction', (done) => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: UInt64.fromUint(0),
                }),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Setup test NamespaceId', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce NamespaceRegistrationTransaction', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('Setup test MosaicAlias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', (done) => {
            mosaicHttp.getMosaic(mosaicId)
                .subscribe((mosaicInfo) => {
                    expect(mosaicInfo.height.lower).not.to.be.null;
                    expect(mosaicInfo.divisibility).to.be.equal(3);
                    expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfo.isTransferable()).to.be.equal(true);
                    done();
                });
        });
    });

    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                    expect(mosaicInfos[0].height.lower).not.to.be.null;
                    expect(mosaicInfos[0].divisibility).to.be.equal(3);
                    expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                    done();
                });
        });
    });

    describe('getMosaicsNames', () => {
        it('should call getMosaicsNames successfully', (done) => {
            mosaicHttp.getMosaicsNames([mosaicId]).subscribe((mosaicNames) => {
                expect(mosaicNames.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */
    describe('Remove test MosaicAlias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Unlink,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
});
