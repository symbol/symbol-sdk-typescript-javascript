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
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import {APIUrl} from '../conf/conf.spec';

describe('NamespaceHttp', () => {
    const namespaceId = NetworkCurrencyMosaic.NAMESPACE_ID;
    const publicAccount = PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
        NetworkType.MIJIN_TEST);
    const namespaceHttp = new NamespaceHttp(APIUrl);

    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', (done) => {
            namespaceHttp.getNamespace(namespaceId)
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
                    expect(namespaces[0].startHeight.lower).to.be.equal(1);
                    expect(namespaces[0].startHeight.higher).to.be.equal(0);
                    done();
                });
        });
    });

    describe('getNamespacesFromAccounts', () => {
        it('should return namespaces data given publicKeyNemesis', (done) => {
            namespaceHttp.getNamespacesFromAccounts([publicAccount.address])
                .subscribe((namespaces) => {
                    expect(namespaces[0].startHeight.lower).to.be.equal(1);
                    expect(namespaces[0].startHeight.higher).to.be.equal(0);
                    done();
                });
        });

    });

    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', (done) => {
            namespaceHttp.getNamespacesName([namespaceId])
                .subscribe((namespaceNames) => {
                    expect(namespaceNames[0].name).to.be.equal('nem');
                    done();
                });
        });
    });

    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', (done) => {
            namespaceHttp.getLinkedMosaicId(namespaceId)
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
                    expect(address).to.be.null;
                    done();
                });
        });
    });
});
