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

import { Convert } from '../../core/format';
import { EncryptedMessage } from './EncryptedMessage';
import { Message } from './Message';
import { MessageMarker } from './MessageMarker';
import { MessageType } from './MessageType';
import { PersistentHarvestingDelegationMessage } from './PersistentHarvestingDelegationMessage';
import { PlainMessage } from './PlainMessage';
import { RawMessage } from './RawMessage';

/**
 * Objects that knows how to create messages from serialized payloads.
 *
 * Note: this could be in the Message class but the circular dependency breaks Typescript.
 */
export class MessageFactory {
    /**
     * It creates a message from the byte array payload
     * @param payload the payload as byte array
     */
    public static createMessageFromBuffer(payload?: Uint8Array): Message {
        return this.createMessageFromHex(payload ? Convert.uint8ToHex(payload) : undefined);
    }
    /**
     * It creates a message from the hex payload
     * @param payload the payload as hex
     */
    public static createMessageFromHex(payload?: string): Message {
        if (!payload || !payload.length) {
            return new RawMessage('');
        }
        const upperCasePayload = payload.toUpperCase();
        if (
            upperCasePayload.length == PersistentHarvestingDelegationMessage.HEX_PAYLOAD_SIZE &&
            upperCasePayload.startsWith(MessageMarker.PersistentDelegationUnlock)
        ) {
            return PersistentHarvestingDelegationMessage.createFromPayload(upperCasePayload);
        }
        const messageType = Convert.hexToUint8(upperCasePayload)[0];
        switch (messageType) {
            case MessageType.PlainMessage:
                return PlainMessage.createFromPayload(upperCasePayload.substring(2));
            case MessageType.EncryptedMessage:
                return EncryptedMessage.createFromPayload(upperCasePayload.substring(2));
        }
        return new RawMessage(upperCasePayload);
    }
}

/**
 * Raw message containing an empty string without any type or prefix.
 * @type {PlainMessage}
 */
export const EmptyMessage: Message = MessageFactory.createMessageFromBuffer();
