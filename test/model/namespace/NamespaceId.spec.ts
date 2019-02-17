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
import {Id} from '../../../src/model/Id';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('NamespaceId', () => {
    it('should be created from root namespace name', () => {
        const id = new NamespaceId('nem');
        deepEqual(id.id, new Id([929036875, 2226345261]));
        expect(id.fullName).to.be.equal('nem');
    });

    it('should be created from subnamespace name ', () => {
        const id = new NamespaceId('nem.subnem');
        deepEqual(id.id, new Id([373240754, 3827892399]));
        expect(id.fullName).to.be.equal('nem.subnem');
    });

    it('should be created from id', () => {
        const id = new NamespaceId([3646934825, 3576016193]);
        deepEqual(id.id, new Id([3646934825, 3576016193]));
        expect(id.fullName).to.be.equal(undefined);
    });
});
