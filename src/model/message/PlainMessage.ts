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

import {Message} from './Message';
import {MessageType} from './MessageType';

/**
 * The plain message model defines a plain string. When sending it to the network we transform the payload to hex-string.
 */
export class PlainMessage extends Message {
    /**
     * Create plain message object.
     * @returns PlainMessage
     */
    public static create(message: string): PlainMessage {
        return new PlainMessage(message);
    }

    /**
     * @internal
     */
    public static createFromPayload(payload: string): PlainMessage {
        return new PlainMessage(this.decodeHex(payload));
    }

    /**
     * @internal
     * @param payload
     */
    constructor(payload: string) {
        super(MessageType.PlainMessage, payload);
    }

}

/**
 * Plain message containing an empty string
 * @type {PlainMessage}
 */
export const EmptyMessage: PlainMessage = PlainMessage.create('');
