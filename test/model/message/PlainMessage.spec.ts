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
import { EmptyMessage, PlainMessage } from '../../../src/model/message';

describe('PlainMessage', () => {
    it('should createComplete an empty message', () => {
        expect(EmptyMessage.toDTO()).to.be.equal('');
        expect(EmptyMessage.toBuffer()).to.be.deep.equal(Uint8Array.of());
    });

    it('should createComplete message from payload with constructor', () => {
        const payload = 'test-message';
        const message = PlainMessage.create(payload);
        expect(message.payload).to.be.equal(payload);
        expect(message.toDTO()).to.be.equal('00746573742D6D657373616765');
    });

    it('should createComplete message from builder', () => {
        const payload = 'test-message';
        const message = PlainMessage.create(payload);
        expect(message).to.be.deep.equal(PlainMessage.create(message.payload));
        expect(message).to.be.deep.equal(PlainMessage.createFromBuilder(message.toBuffer()));
    });
});
