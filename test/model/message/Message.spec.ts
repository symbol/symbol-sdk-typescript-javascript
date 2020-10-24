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
import { Convert } from '../../../src/core/format/Convert';
import { EncryptedMessage } from '../../../src/model/message/EncryptedMessage';
import { Message } from '../../../src/model/message/Message';
import { PersistentHarvestingDelegationMessage } from '../../../src/model/message/PersistentHarvestingDelegationMessage';
import { PlainMessage } from '../../../src/model/message/PlainMessage';

describe('Message', () => {
    it('should create an plain message dto object', () => {
        const message = new PlainMessage('test');
        expect(message.toDTO()).to.be.equal('00' + Convert.utf8ToHex('test'));
    });

    it('should create an encrypted message dto object', () => {
        const message = new EncryptedMessage('test');
        expect(message.toDTO()).to.be.equal('01' + Convert.utf8ToHex('test'));
    });

    it('should create an PersistentHarvestingDelegationMessage message dto object', () => {
        const message = new PersistentHarvestingDelegationMessage('746573742D6D657373616765');
        expect(message.toDTO()).to.be.equal('746573742D6D657373616765');
    });

    it('should throw exception on creating PersistentHarvestingDelegationMessage', () => {
        expect(() => {
            new PersistentHarvestingDelegationMessage('test');
        }).to.throw(Error, 'Payload format is not valid hexadecimal string');
    });

    it('should decode hex string', () => {
        const hex = '746573742D6D657373616765';
        expect(Message.decodeHex(hex)).to.be.equal('test-message');
    });

    it('should decode hex string (emoji)', () => {
        const hex = 'F09F9880E38193E38293E381ABE381A1E381AFF09F9880';
        expect(Message.decodeHex(hex)).to.be.equal('😀こんにちは😀');
    });
});
