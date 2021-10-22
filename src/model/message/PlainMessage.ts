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
 * The plain message model defines a plain string. When sending it to the network we transform the payload to hex-string.
 */
export class PlainMessage implements Message {
    public static readonly TYPE = MessageType.PlainMessage;
    public readonly type = PlainMessage.TYPE;
    public readonly payload: string;

    /**
     * @internal
     * @param builder
     */
    constructor(private readonly builder: Uint8Array) {
        this.payload = Convert.uint8ToUtf8(builder.slice(1));
    }
    /**
     * Create plain message object.
     * @returns PlainMessage
     */
    public static create(message: string): PlainMessage {
        return new PlainMessage(Convert.concat(Uint8Array.of(this.TYPE), Convert.utf8ToBuffer(message)));
    }

    /**
     *
     * It creates the Plain message from a payload hex with the 00 prefix.
     *
     * @internal
     */
    public static createFromBuilder(builder: Uint8Array): PlainMessage {
        return new PlainMessage(builder);
    }

    toBuffer(): Uint8Array {
        return this.builder;
    }
    toDTO(): string {
        return Convert.uint8ToHex(this.builder);
    }
}
