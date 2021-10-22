/*
 * Copyright 2019 NEM
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

import { GeneratorUtils } from 'catbuffer-typescript';
import { Convert } from '../../core';
import { Crypto } from '../../core/crypto';
import { PublicAccount } from '../account';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { PlainMessage } from './PlainMessage';

/**
 * Encrypted Message model
 */
export class EncryptedMessage implements Message {
    public readonly type = MessageType.EncryptedMessage;
    public readonly payload: string;

    /**
     * @internal
     * @param buffer the buffer.
     */
    constructor(private readonly buffer: Uint8Array) {
        this.payload = EncryptedMessage.getPayload(buffer);
    }

    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     * @param iv - iv for encoding, for unit tests.
     * @return The encrypted message.
     */
    public static create(message: string, recipientPublicAccount: PublicAccount, privateKey: string, iv?: Buffer): EncryptedMessage {
        const encryptedHex = Crypto.encode(privateKey, recipientPublicAccount.publicKey, message, false, iv).toUpperCase();
        return new EncryptedMessage(EncryptedMessage.createBuffer(encryptedHex));
    }

    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param recipientPublicAccount - Sender public account
     * @return {PlainMessage}
     */
    public static decrypt(encryptMessage: EncryptedMessage, privateKey: string, recipientPublicAccount: PublicAccount): PlainMessage {
        return PlainMessage.create(Convert.hexToUtf8(Crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload)));
    }

    /**
     * It creates a encrypted message from the payload hex wihtout the 01 prefix.
     *
     * The 01 prefix will be attached to the final payload.
     *
     * @internal
     * @param payload
     */
    public static createFromPayload(payload: string): EncryptedMessage {
        return new EncryptedMessage(EncryptedMessage.createBuffer(payload));
    }

    /**
     *
     * It creates the Plain message from a payload hex with the 00 prefix.
     *
     * @internal
     */
    public static createFromBuilder(builder: Uint8Array): EncryptedMessage {
        return new EncryptedMessage(builder);
    }

    /**
     * Create DTO object
     */
    toDTO(): string {
        return Convert.uint8ToHex(this.toBuffer());
    }

    toBuffer(): Uint8Array {
        return this.buffer;
    }

    public static createBuffer(payload: string): Uint8Array {
        if (!payload) {
            return Uint8Array.of();
        }
        const message = Convert.utf8ToHex(payload);
        const payloadBuffer = Convert.hexToUint8(message);
        const typeBuffer = GeneratorUtils.uintToBuffer(MessageType.EncryptedMessage, 1);
        return GeneratorUtils.concatTypedArrays(typeBuffer, payloadBuffer);
    }

    public static getPayload(buffer: Uint8Array): string {
        if (!buffer.length) {
            return '';
        }
        return Convert.uint8ToUtf8(buffer.slice(1));
    }
}
