/*
 * Copyright 2020 NEM
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
import { NamespaceMosaicIdGenerator } from '../../../src/infrastructure/transaction/NamespaceMosaicIdGenerator';
import { expect } from 'chai';

describe('NamespaceMosaicIdGenerator', () => {
    it('namespaceId of xym', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.namespaceId('xym');
        expect(namespaceId).to.be.deep.equal([2235463876, 2227923525]);
    });

    it('namespaceId of my.custom.currency', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.namespaceId('my.custom.currency');
        const subnamespaceNamespaceId = NamespaceMosaicIdGenerator.subnamespaceNamespaceId('my.custom', 'currency');

        expect(namespaceId).to.be.deep.equal([4191522918, 3224088180]);
        expect(namespaceId).to.be.deep.equal(subnamespaceNamespaceId);
    });

    it('namespaceId of my.custom', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.namespaceId('my.custom');
        const namespaceParentId = NamespaceMosaicIdGenerator.subnamespaceParentId('my.custom', 'currency');

        expect(namespaceId).to.be.deep.equal([3250622501, 2426098581]);
        expect(namespaceId).to.be.deep.equal(namespaceParentId);
    });

    it('subnamespaceNamespaceId of my.custom.currency', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.subnamespaceNamespaceId('my.custom', 'currency');
        expect(namespaceId).to.be.deep.equal([4191522918, 3224088180]);
    });

    it('subnamespaceParentId of my.custom.currency', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.subnamespaceParentId('my.custom', 'currency');
        expect(namespaceId).to.be.deep.equal([3250622501, 2426098581]);
    });

    it('subnamespaceParentId of my.custom', async () => {
        const namespaceId = NamespaceMosaicIdGenerator.subnamespaceParentId('my', 'custom');
        expect(namespaceId).to.be.deep.equal([3002038941, 3509212518]);
    });
});
