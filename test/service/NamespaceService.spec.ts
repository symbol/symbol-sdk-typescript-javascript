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
import {Observable, of as observableOf} from 'rxjs';
import {deepEqual, instance, mock, when} from 'ts-mockito';
import {NamespaceHttp} from '../../src/infrastructure/NamespaceHttp';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import {NamespaceInfo} from '../../src/model/namespace/NamespaceInfo';
import {NamespaceName} from '../../src/model/namespace/NamespaceName';
import {UInt64} from '../../src/model/UInt64';
import {NamespaceService} from '../../src/service/NamespaceService';

describe('NamespaceService', () => {
    let namespaceService: NamespaceService;
    let rootNamespace: NamespaceInfo;
    let subnamespace: NamespaceInfo;

    before(() => {
        const mockedNamespaceHttp = mock(NamespaceHttp);
        rootNamespace = givenRootNamespace();
        subnamespace = givenSubnamespace();
        // e43f43d2c5a8f299 rootNamespace.id.toHex()
        // f7ce33276a3288c1 subnamespace.id.toHex()
        when(mockedNamespaceHttp.getNamespace(rootNamespace.id))
            .thenReturn(observableOf(rootNamespace));
        when(mockedNamespaceHttp.getNamespace(subnamespace.id))
            .thenReturn(observableOf(subnamespace));

        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id])))
            .thenReturn(observableOf([new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests')]));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([subnamespace.id])))
            .thenReturn(observableOf([new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2')]));
        when(mockedNamespaceHttp.getNamespacesName(deepEqual([rootNamespace.id, subnamespace.id])))
            .thenReturn(observableOf([
                new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'nem2tests'),
                new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2'),
            ]));
        const namespaceHttp = instance(mockedNamespaceHttp);
        namespaceService = new NamespaceService(namespaceHttp);
    });

    it('should return the NamespaceInfo + name', () => {
        return namespaceService.namespace(rootNamespace.id).toPromise().then((namespace) => {
            expect(namespace.name).to.be.equal('nem2tests');
        });
    });

    it('should return the NamespaceInfo + name', () => {
        return namespaceService.namespace(subnamespace.id).toPromise().then((namespace) => {
            expect(namespace.name).to.be.equal('nem2tests.level2');
        });
    });

    function givenRootNamespace(): NamespaceInfo {
        return new NamespaceInfo(true,
            0,
            '59DFBA84B2E9E7000135E80C',
            0,
            1,
            [new NamespaceId([
                3316183705,
                3829351378,
            ])],
            new NamespaceId([0, 0]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([795, 0]),
            new UInt64([50795, 0]));
    }

    function givenSubnamespace(): NamespaceInfo {
        return new NamespaceInfo(true,
            0,
            '5A1D85A1D53061000117D1EE',
            1,
            2,
            [new NamespaceId([3316183705, 3829351378]), new NamespaceId([1781696705, 4157485863])],
            new NamespaceId([3316183705, 3829351378]),
            PublicAccount.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.MIJIN_TEST),
            new UInt64([795, 0]),
            new UInt64([50795, 0]));
    }
});
