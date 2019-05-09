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
import {expect} from 'chai';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {MosaicHttp} from '../../src/infrastructure/MosaicHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../src/model/mosaic/MosaicProperties';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';

describe('MosaicHttp', () => {
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let mosaicHttp: MosaicHttp;
    let account: Account;
    let config;
    let transactionHttp: TransactionHttp;
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
            done();
        });
    });
    describe('MosaicDefinitionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    levyMutable: true,
                    divisibility: 3,
                }),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account);
            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', (done) => {
            mosaicHttp.getMosaic(mosaicId)
                .subscribe((mosaicInfo) => {
                    expect(mosaicInfo.height.lower).not.to.be.null;
                    expect(mosaicInfo.divisibility).to.be.equal(3);
                    expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
                    expect(mosaicInfo.isTransferable()).to.be.equal(true);
                    expect(mosaicInfo.isLevyMutable()).to.be.equal(true);
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
                    expect(mosaicInfos[0].isLevyMutable()).to.be.equal(true);
                    done();
                });
        });
    });
});
