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

import { MessageType } from './MessageType';

/**
 * An abstract message class that serves as the base class of all message types.
 */
export interface Message {
    /**
     * The buffer to be used when serializing a transaction
     */
    toBuffer(): Uint8Array;

    /**
     * Create DTO object
     */
    toDTO(): string;

    /**
     * validate if the content is correct
     */
    readonly type: MessageType;

    /**
     * Payload without type prefix.
     */
    readonly payload: string;
}
