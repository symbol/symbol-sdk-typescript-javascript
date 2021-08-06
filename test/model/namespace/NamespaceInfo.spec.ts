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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { Convert } from '../../../src/core/format/Convert';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NamespaceInfo } from '../../../src/model/namespace/NamespaceInfo';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { UInt64 } from '../../../src/model/UInt64';

describe('NamespaceInfo', () => {
    let rootNamespaceDTO;
    let subNamespaceDTO;
    function createRootFromDTO(dto): NamespaceInfo {
        return new NamespaceInfo(
            dto.namespace.version,
            dto.meta.active,
            dto.meta.index,
            dto.meta.id,
            dto.namespace.type,
            dto.namespace.depth,
            [dto.namespace.level0],
            dto.namespace.parentId,
            Address.createFromEncoded(dto.namespace.ownerAddress),
            dto.namespace.startHeight,
            dto.namespace.endHeight,
            dto.namespace.alias,
        );
    }

    function createSubnamespaceFromDTO(dto): NamespaceInfo {
        return new NamespaceInfo(
            dto.namespace.version,
            dto.meta.active,
            dto.meta.index,
            dto.meta.id,
            dto.namespace.type,
            dto.namespace.depth,
            [dto.namespace.level0, dto.namespace.level1],
            dto.namespace.parentId,
            Address.createFromEncoded(dto.namespace.ownerAddress),
            dto.namespace.startHeight,
            dto.namespace.endHeight,
            dto.namespace.alias,
        );
    }

    before(() => {
        rootNamespaceDTO = {
            meta: {
                active: true,
                id: '59FDFC333F17CF0001774EC0',
                index: 0,
            },
            namespace: {
                version: 1,
                depth: 1,
                endHeight: UInt64.fromNumberArray([4294967295, 4294967295]),
                level0: NamespaceId.createFromEncoded('BD4DD689FD08BCB2'),
                ownerAddress: Address.createFromPublicKey(
                    'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    NetworkType.PRIVATE_TEST,
                ).encoded(),
                parentId: new NamespaceId([0, 0]),
                startHeight: new UInt64(1),
                type: 0,
                alias: { type: 1, mosaicId: new MosaicId([481110499, 231112638]) },
            },
        };
        subNamespaceDTO = {
            meta: {
                active: true,
                index: 4,
                id: '59DFBA84B2E9E7000135E80E',
            },
            namespace: {
                version: 1,
                type: 1,
                depth: 2,
                level0: NamespaceId.createFromEncoded('BD4DD689FD08BCB2'),
                level1: NamespaceId.createFromEncoded('9DF9EADD9305A718'),
                parentId: NamespaceId.createFromEncoded('BD4DD689FD08BCB2'),
                ownerAddress: Address.createFromPublicKey(
                    '846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2',
                    NetworkType.PRIVATE_TEST,
                ).encoded(),
                startHeight: [795, 0],
                endHeight: UInt64.fromNumberArray([4294967295, 4294967295]),
                alias: { type: 0 },
            },
        };
    });

    it('should createComplete an NamespaceInfo object', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);

        expect(namespaceInfo.active).to.be.equal(rootNamespaceDTO.meta.active);
        expect(namespaceInfo.index).to.be.equal(rootNamespaceDTO.meta.index);
        expect(namespaceInfo.recordId).to.be.equal(rootNamespaceDTO.meta.id);
        expect(namespaceInfo.depth).to.be.equal(rootNamespaceDTO.namespace.depth);
        deepEqual(namespaceInfo.levels[0], rootNamespaceDTO.namespace.level0);
        expect(namespaceInfo.ownerAddress.encoded()).to.be.equal(rootNamespaceDTO.namespace.ownerAddress);
        deepEqual(namespaceInfo.startHeight, rootNamespaceDTO.namespace.startHeight);
        deepEqual(namespaceInfo.endHeight, rootNamespaceDTO.namespace.endHeight);
        expect(namespaceInfo.alias.type).to.be.equal(rootNamespaceDTO.namespace.alias.type);
        expect(namespaceInfo.alias.mosaicId).to.be.equal(rootNamespaceDTO.namespace.alias.mosaicId);
    });

    it('should return the NamespaceId in string format', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);

        expect(namespaceInfo.id.toHex()).to.be.equal('BD4DD689FD08BCB2');
    });

    it('should return the NamespaceId in string format for sub-namespace', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.id.toHex()).to.be.equal('9DF9EADD9305A718');
    });

    it('isRoot() should return true when the Namespace has type 0', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);
        expect(namespaceInfo.isRoot()).to.be.equal(true);
    });

    it('isRoot() should return false when the Namespace has type 1', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.isRoot()).to.be.equal(false);
    });

    it('isSubnamespace() should return true when the Namespace has type 0', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);
        expect(namespaceInfo.isSubnamespace()).to.be.equal(false);
    });

    it('isSubnamespace() should return false when the Namespace has type 1', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.isSubnamespace()).to.be.equal(true);
    });

    it('should return the parent namespace id for a subnamespace', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.parentNamespaceId()).to.be.equal(subNamespaceDTO.namespace.parentId);
    });

    it('should throw error when parentNamespaceId() is called to a root namespace', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);
        expect(() => {
            namespaceInfo.parentNamespaceId();
        }).to.throw(Error, 'Is a Root Namespace');
    });

    it('should return the id from root namespace', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);
        expect(namespaceInfo.id).to.be.equal(rootNamespaceDTO.namespace.level0);
    });

    it('should return the id from a subdomain namespace', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.id).to.be.equal(subNamespaceDTO.namespace.level1);
    });

    it('hasAlias() should return false when the Namespace alias has type 1', () => {
        const namespaceInfo = createRootFromDTO(rootNamespaceDTO);
        expect(namespaceInfo.hasAlias()).to.be.equal(true);
    });

    it('hasAlias() should return false when the Namespace alias has type 0', () => {
        const namespaceInfo = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(namespaceInfo.hasAlias()).to.be.equal(false);
    });

    it('serialize', () => {
        const root = createRootFromDTO(rootNamespaceDTO);
        const sub = createSubnamespaceFromDTO(subNamespaceDTO);
        expect(Convert.uint8ToHex(root.serialize([root, sub]))).to.be.equal(
            '0100B2BC08FD89D64DBDA822D04812D05000F96C283657B0C17990932BC8499C7D940100000000000000FFFFFFFFFFFFFFFF01E329AD1CBE7FC60D01000000000000000118A70593DDEAF99D00',
        );
    });
});
