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
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';

describe('NamespaceId', () => {
    it('should be created from root namespace name', () => {
        const id = new NamespaceId('nem');
        deepEqual(id.id, BigIntUtilities.HexToBigInt('84B3552D375FFA4B'));
        expect(id.fullName).to.be.equal('nem');
    });

    it('should be created from subnamespace name ', () => {
        const id = new NamespaceId('nem.subnem');
        deepEqual(id.id, BigIntUtilities.HexToBigInt('E42900AF163F33B2'));
        expect(id.fullName).to.be.equal('nem.subnem');
    });

    it('should be created from id', () => {
        const id = new NamespaceId(BigIntUtilities.HexToBigInt('D525AD41D95FCF29'));
        deepEqual(id.id, BigIntUtilities.HexToBigInt('D525AD41D95FCF29'));
        expect(id.fullName).to.be.equal(undefined);
    });
});
