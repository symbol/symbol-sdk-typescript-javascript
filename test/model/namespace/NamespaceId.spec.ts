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

    const vectors = [
        {encoded: '4bfa5f372d55b384', uint: [929036875, 2226345261]},  // new NamespaceId('nem')
        {encoded: '08a12f89ee5a49f8', uint: [2301600008, 4165556974]}, // new NamespaceId('nem.owner.test1')
        {encoded: '1f810565e8f4aeab', uint: [1694859551, 2880369896]}, // new NamespaceId('nem.owner.test2')
        {encoded: '552d1c0a2bc9b8ae', uint: [169618773, 2931345707]},  // new NamespaceId('nem.owner.test3')
        {encoded: 'bfca1440d49ae090', uint: [1075104447, 2430638804]}, // new NamespaceId('nem.owner.test4')
        {encoded: 'ccf10b96814211ab', uint: [2517365196, 2870035073]}, // new NamespaceId('nem.owner.test5')
    ];

    it('should be created from encoded vectors', () => {
        vectors.map(({encoded, uint}) => {
            const fromHex = NamespaceId.createFromEncoded(encoded.toUpperCase());
            const fromId = new NamespaceId(uint);
            deepEqual(fromId.id, fromHex.id);
        });
    });
});
