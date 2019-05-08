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
import {deepEqual} from 'assert';
import {expect} from 'chai';
import {NamespaceHttp} from '../../src/infrastructure/NamespaceHttp';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';

describe('NamespaceHttp', () => {
    const defaultNamespaceId = NetworkCurrencyMosaic.NAMESPACE_ID;
    let namespaceId: NamespaceId;
    let namespaceHttp: NamespaceHttp;
    let publicAccount: PublicAccount;
    let namespaceLinkedAddress: string;
    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            publicAccount = PublicAccount.createFromPublicKey(json.testAccount.publicKey, NetworkType.MIJIN_TEST);
            namespaceId = new NamespaceId(json.namespace.id);
            namespaceLinkedAddress = json.namespace.linkedAddress;
            namespaceHttp = new NamespaceHttp(json.apiUrl);
            done();
        });
    });

    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            namespaceHttp.getNamespace(defaultNamespaceId)
                .subscribe((namespace) => {
                    expect(namespace.startHeight.lower).to.be.equal(1);
                    expect(namespace.startHeight.higher).to.be.equal(0);
                    done();
                });
        });
    });

    describe('getNamespacesFromAccount', () => {
        it('should return namespace data given publicKeyNemesis', (done) => {
            namespaceHttp.getNamespacesFromAccount(publicAccount.address)
                .subscribe((namespaces) => {
                    deepEqual(namespaces[0].owner, publicAccount);
                    done();
                });
        });
    });

    describe('getNamespacesFromAccounts', () => {
        it('should return namespaces data given publicKeyNemesis', (done) => {
            namespaceHttp.getNamespacesFromAccounts([publicAccount.address])
                .subscribe((namespaces) => {
                    deepEqual(namespaces[0].owner, publicAccount);
                    done();
                });
        });

    });

    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            namespaceHttp.getNamespacesName([defaultNamespaceId])
                .subscribe((namespaceNames) => {
                    expect(namespaceNames[0].name).to.be.equal('currency');
                    done();
                });
        });
    });

    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            namespaceHttp.getLinkedMosaicId(defaultNamespaceId)
                .subscribe((mosaicId) => {
                    expect(mosaicId).to.not.be.null;
                    done();
                });
        });
    });

    describe('getLinkedAddress', () => {
        it('should return address given namespaceId', (done) => {
            namespaceHttp.getLinkedAddress(namespaceId)
                .subscribe((address) => {
                    expect(address.plain()).to.be.equal(namespaceLinkedAddress);
                    done();
                });
        });
    });
});
