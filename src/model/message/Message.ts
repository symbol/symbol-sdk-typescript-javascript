/*
import { Convert } from '../../core/format/Convert';
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
import { MessageType } from './MessageType';

/**
 * An abstract message class that serves as the base class of all message types.
 */
export abstract class Message {
    /**
     * @internal
     * @param hex
     * @returns {string}
     */
    public static decodeHex(hex: string): string {
        return Buffer.from(hex, 'hex').toString();
    }

    /**
     * @internal
     * @param type
     * @param payload
     */
    constructor(
        /**
         * Message type
         */
        public readonly type: MessageType,
        /**
         * Message payload, it could be the message hex, encryped text or plain text depending on the message type.
         */
        public readonly payload: string,
    ) {}

    /**
     * Create DTO object
     */
    toDTO(): string {
        if (!this.payload) {
            return '';
        }
        if (this.type === MessageType.PersistentHarvestingDelegationMessage) {
            return this.payload;
        }
        if (this.type === MessageType.RawMessage) {
            return this.payload;
        }
        return this.type.toString(16).padStart(2, '0').toUpperCase() + Convert.utf8ToHex(this.payload);
    }
}
