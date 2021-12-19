/*
 * (C) Symbol Contributors 2021
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
import { MessageFactory } from '../../../src';
import { RawMessage } from '../../../src/model/message/RawMessage';

describe('RawMessage', () => {
    it('should create from raw payload', () => {
        const buffer = Uint8Array.of(3, 1, 2, 3, 4);
        const payload = '0301020304';
        const message = RawMessage.create(buffer);
        expect(message.payload).to.be.equal(payload);
        expect(message.toDTO()).to.be.equal(payload);
        expect(message.toBuffer()).to.be.deep.equal(buffer);
    });

    it('should create from same raw message using factory', () => {
        const buffer = Uint8Array.of(3, 1, 2, 3, 4);
        const payload = '0301020304';
        const message = RawMessage.create(buffer);
        expect(message).to.be.deep.equal(MessageFactory.createMessageFromHex(payload));
        expect(message).to.be.deep.equal(MessageFactory.createMessageFromBuffer(buffer));
    });
});
