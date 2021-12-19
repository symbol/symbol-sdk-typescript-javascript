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
import { Convert } from '../../../src/core/format';
import { PersistentHarvestingDelegationMessage, PlainMessage } from '../../../src/model/message';

describe('Message', () => {
    it('should create an plain message dto object', () => {
        const message = PlainMessage.create('test');
        expect(message.toDTO()).to.be.equal('00' + Convert.utf8ToHex('test'));
    });

    it('should create an plain message dto from buffer', () => {
        const message = PlainMessage.createFromBuilder(PlainMessage.create('test').toBuffer());
        expect(message.toDTO()).to.be.equal('00' + Convert.utf8ToHex('test'));
    });

    it('should throw exception on creating PersistentHarvestingDelegationMessage with wrong size', () => {
        expect(() => {
            new PersistentHarvestingDelegationMessage('746573742D6D657373616765');
        }).to.throw(Error, 'Invalid persistent harvesting delegate payload size! Expected 264 but got 24');
    });

    it('should throw exception on creating PersistentHarvestingDelegationMessage', () => {
        expect(() => {
            new PersistentHarvestingDelegationMessage('test');
        }).to.throw(Error, 'Payload format is not valid hexadecimal string');
    });
});
