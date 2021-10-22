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

import { Convert } from '../../core';
import { Message } from './Message';
import { MessageType } from './MessageType';

/**
 * The a raw message that doesn't assume any prefix.
 */
export class RawMessage implements Message {
    public readonly type = MessageType.RawMessage;
    public readonly payload: string;
    /**
     * @internal
     * @param buffer
     */
    private constructor(private readonly buffer: Uint8Array) {
        this.payload = Convert.uint8ToHex(buffer);
    }
    /**
     * Create plain message object.
     * @returns PlainMessage
     */
    public static create(buffer: Uint8Array): RawMessage {
        return new RawMessage(buffer);
    }
    toBuffer(): Uint8Array {
        return this.buffer;
    }

    toDTO(): string {
        return this.payload;
    }
}
