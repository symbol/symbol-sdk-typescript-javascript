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

import { Crypto } from '../../core/crypto';
import { PublicAccount } from '../account';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { PlainMessage } from './PlainMessage';

/**
 * Encrypted Message model
 */
export class EncryptedMessage extends Message {
    public readonly recipientPublicAccount?: PublicAccount;

    constructor(payload: string, recipientPublicAccount?: PublicAccount) {
        super(MessageType.EncryptedMessage, payload);
        this.recipientPublicAccount = recipientPublicAccount;
    }

    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     * @return {EncryptedMessage}
     */
    public static create(message: string, recipientPublicAccount: PublicAccount, privateKey: string): EncryptedMessage {
        return new EncryptedMessage(
            Crypto.encode(privateKey, recipientPublicAccount.publicKey, message).toUpperCase(),
            recipientPublicAccount,
        );
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
        return new EncryptedMessage(this.decodeHex(payload));
    }

    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param recipientPublicAccount - Sender public account
     * @return {PlainMessage}
     */
    public static decrypt(encryptMessage: EncryptedMessage, privateKey, recipientPublicAccount: PublicAccount): PlainMessage {
        return new PlainMessage(this.decodeHex(Crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload)));
    }
}
