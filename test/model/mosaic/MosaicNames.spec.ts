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
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import { MosaicNames } from '../../../src/model/mosaic/MosaicNames';
import { NamespaceName } from '../../../src/model/namespace/NamespaceName';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';

describe('MosaicNames', () => {

    let namespaceName: NamespaceName[];
    let mosaicId: MosaicId;

    before(() => {
        namespaceName = [new NamespaceName(new NamespaceId('test'), 'test')];
        mosaicId = new MosaicId('85BBEA6CC462B244');
    });

    it('should createComplete a Mosaic name', () => {
        const mosaicNames = new MosaicNames(mosaicId, namespaceName);
        expect(mosaicNames.mosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicNames.names[0].name).to.be.equal('test');
        expect(mosaicNames.names[0].parentId).to.be.undefined;
        expect(mosaicNames.names[0].namespaceId.fullName).to.be.equal('test');
    });
});
