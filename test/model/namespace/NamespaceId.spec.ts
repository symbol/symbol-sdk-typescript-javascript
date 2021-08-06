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
import { UInt64 } from '../../../src/model';
import { NamespaceId } from '../../../src/model/namespace';

describe('NamespaceId', () => {
    it('should be created from root namespace name', () => {
        const id = new NamespaceId('nem');
        deepEqual(id.id, new UInt64([929036875, 2226345261]));
        expect(id.fullName).to.be.equal('nem');
    });

    it('should be created from subnamespace name ', () => {
        const id = new NamespaceId('nem.subnem');
        deepEqual(id.id, new UInt64([373240754, 3827892399]));
        expect(id.fullName).to.be.equal('nem.subnem');
    });

    it('should be created from id', () => {
        const id = new NamespaceId([3646934825, 3576016193]);
        deepEqual(id.id, new UInt64([3646934825, 3576016193]));
        expect(id.fullName).to.be.equal(undefined);
    });

    const vectors = [
        { encoded: '84B3552D375FFA4B', uint: [929036875, 2226345261], stringInt: '9562080086528621131', fullName: 'nem' },
        { encoded: 'F8495AEE892FA108', uint: [2301600008, 4165556974], stringInt: '17890930975256322312', fullName: 'nem.owner.test1' },
        { encoded: 'ABAEF4E86505811F', uint: [1694859551, 2880369896], stringInt: '12371094505397780767', fullName: 'nem.owner.test2' },
        { encoded: 'AEB8C92B0A1C2D55', uint: [169618773, 2931345707], stringInt: '12590033945004617045', fullName: 'nem.owner.test3' },
        { encoded: '90E09AD44014CABF', uint: [1075104447, 2430638804], stringInt: '10439514172643658431', fullName: 'nem.owner.test4' },
        { encoded: 'AB114281960BF1CC', uint: [2517365196, 2870035073], stringInt: '12326706779425337804', fullName: 'nem.owner.test5' },
    ];

    it('should be created from encoded vectors', () => {
        vectors.map(({ encoded, uint, stringInt, fullName }) => {
            const fromHex = NamespaceId.createFromEncoded(encoded.toUpperCase());
            const fromId = new NamespaceId(uint);
            expect(stringInt).eq(fromHex.id.toString());
            expect(encoded).eq(fromHex.toHex());
            expect(fromId.toHex()).eq(fromHex.toHex());
            expect(fromId.id).deep.eq(fromHex.id);

            const fromId2 = new NamespaceId(fullName);
            expect(fromId2.toHex()).eq(fromHex.toHex());
            expect(fromId2.id).deep.eq(fromHex.id);
        });
    });
});
