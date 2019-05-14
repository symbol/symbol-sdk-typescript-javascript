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

import {PublicAccount} from '../account/PublicAccount';
import {Message} from './Message';
import {MessageType} from './MessageType';
import {PlainMessage} from './PlainMessage';
import { crypto } from '../../core/crypto/crypto';

/**
 * Encrypted Message model
 */
export class EncryptedMessage extends Message {

    public readonly recipientPublicAccount?: PublicAccount;

    constructor(payload: string,
                recipientPublicAccount?: PublicAccount) {
        super(MessageType.EncryptedMessage, payload);
        this.recipientPublicAccount = recipientPublicAccount;
    }

    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     */
    public static create(message: string, recipientPublicAccount: PublicAccount, privateKey) {
        return new EncryptedMessage(
            crypto.encode(privateKey, recipientPublicAccount.publicKey, message).toUpperCase(),
            recipientPublicAccount);
    }

    /**
     *
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
     */
    public static decrypt(encryptMessage: EncryptedMessage, privateKey, recipientPublicAccount: PublicAccount): PlainMessage {
        return new PlainMessage(this.decodeHex(crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload)));
    }
}
