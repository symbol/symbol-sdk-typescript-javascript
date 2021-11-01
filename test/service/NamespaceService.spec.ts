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

import { expect } from 'chai';
import { of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { Address } from '../../src/model/account/Address';
import { EmptyAlias } from '../../src/model/namespace/EmptyAlias';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NamespaceInfo } from '../../src/model/namespace/NamespaceInfo';
import { NamespaceName } from '../../src/model/namespace/NamespaceName';
import { NetworkType } from '../../src/model/network/NetworkType';
import { UInt64 } from '../../src/model/UInt64';
import { NamespaceService } from '../../src/service/NamespaceService';

describe('NamespaceService', () => {
    function givenRootNamespace(): NamespaceInfo {
        return new NamespaceInfo(
            1,
            true,
            0,
            '59DFBA84B2E9E7000135E80C',
            0,
            1,
            [new NamespaceId([3316183705, 3829351378])],
            new NamespaceId([0, 0]),
            Address.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.TEST_NET),
            new UInt64([795, 0]),
            new UInt64([50795, 0]),
            new EmptyAlias(),
        );
    }

    function givenSubnamespace(): NamespaceInfo {
        return new NamespaceInfo(
            1,
            true,
            0,
            '5A1D85A1D53061000117D1EE',
            1,
            2,
            [new NamespaceId([3316183705, 3829351378]), new NamespaceId([1781696705, 4157485863])],
            new NamespaceId([3316183705, 3829351378]),
            Address.createFromPublicKey('1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755', NetworkType.TEST_NET),
            new UInt64([795, 0]),
            new UInt64([50795, 0]),
            new EmptyAlias(),
        );
    }

    it('should return the NamespaceInfo + name for a root namespace', () => {
        const mockedNamespaceRepository: NamespaceRepository = mock();
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        when(mockedNamespaceRepository.getNamespace(rootNamespace.id)).thenReturn(observableOf(rootNamespace));
        when(mockedNamespaceRepository.getNamespace(subnamespace.id)).thenReturn(observableOf(subnamespace));
        when(mockedNamespaceRepository.getNamespacesNames(deepEqual([rootNamespace.id]))).thenReturn(
            observableOf([new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'symboltests')]),
        );
        when(mockedNamespaceRepository.getNamespacesNames(deepEqual([rootNamespace.id, subnamespace.id]))).thenReturn(
            observableOf([
                new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'symboltests'),
                new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2'),
            ]),
        );
        const namespaceRepository = instance(mockedNamespaceRepository);
        const namespaceService = new NamespaceService(namespaceRepository);
        namespaceService.namespace(rootNamespace.id).subscribe((namespace) => {
            expect(namespace.name).to.be.equal('symboltests');
        });
    });

    it('should return the NamespaceInfo + name for a subnamespace', () => {
        const mockedNamespaceRepository: NamespaceRepository = mock();
        const rootNamespace = givenRootNamespace();
        const subnamespace = givenSubnamespace();
        when(mockedNamespaceRepository.getNamespace(rootNamespace.id)).thenReturn(observableOf(rootNamespace));
        when(mockedNamespaceRepository.getNamespace(subnamespace.id)).thenReturn(observableOf(subnamespace));
        when(mockedNamespaceRepository.getNamespacesNames(deepEqual([rootNamespace.id]))).thenReturn(
            observableOf([new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'symboltests')]),
        );
        when(mockedNamespaceRepository.getNamespacesNames(deepEqual([subnamespace.id]))).thenReturn(
            observableOf([new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2')]),
        );
        when(mockedNamespaceRepository.getNamespacesNames(deepEqual([rootNamespace.id, subnamespace.id]))).thenReturn(
            observableOf([
                new NamespaceName(new NamespaceId([3316183705, 3829351378]), 'symboltests'),
                new NamespaceName(new NamespaceId([1781696705, 4157485863]), 'level2'),
            ]),
        );
        const namespaceRepository = instance(mockedNamespaceRepository);
        const namespaceService = new NamespaceService(namespaceRepository);

        namespaceService.namespace(subnamespace.id).subscribe((namespace) => {
            expect(namespace.name).to.be.equal('symboltests.level2');
        });
    });
});
