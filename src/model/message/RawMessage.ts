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

import { Convert } from '../../core/format';
import { Message } from './Message';
import { MessageType } from './MessageType';

/**
 * The a raw message that doesn't assume any prefix.
 */
export class RawMessage extends Message {
    /**
     * Create plain message object.
     * @returns PlainMessage
     */
    public static create(payload: Uint8Array): RawMessage {
        return new RawMessage(Convert.uint8ToHex(payload));
    }
    /**
     * @internal
     * @param payload
     */
    constructor(payload: string) {
        super(MessageType.RawMessage, payload);
    }
}
