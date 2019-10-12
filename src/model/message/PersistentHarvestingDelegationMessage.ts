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

import {Crypto, SHA3Hasher} from '../../core/crypto';
import { Convert } from '../../core/format/Convert';
import { NetworkType } from '../blockchain/NetworkType';
import { Message } from './Message';
import { MessageMarker } from './MessageMarker';
import { MessageType } from './MessageType';
import { PlainMessage } from './PlainMessage';

export class PersistentHarvestingDelegationMessage extends Message {
    constructor(payload: string) {
        super(MessageType.PersistentHarvestingDelegationMessage, payload);
        if (!Convert.isHexString(payload)) {
            throw Error('Payload format is not valid hexadecimal string');
        }
    }

    /**
     *
     * @param delegatedPrivateKey - Private key of delegated account
     * @param senderPrivateKey - Sender private key
     * @param recipientPrivateKey - Recipient public key
     * @param {NetworkType} networkType - Catapult network type
     * @return {PersistentHarvestingDelegationMessage}
     */
    public static create(delegatedPrivateKey: string,
                         senderPrivateKey: string,
                         recipientPublicKey: string,
                         networkType: NetworkType): PersistentHarvestingDelegationMessage {
        const signSchema = SHA3Hasher.resolveSignSchema(networkType);
        const encrypted = MessageMarker.PersistentDelegationUnlock +
            Crypto.encode(senderPrivateKey, recipientPublicKey, delegatedPrivateKey, signSchema, true).toUpperCase();
        return new PersistentHarvestingDelegationMessage(encrypted);
    }

    /**
     * Create PersistentHarvestingDelegationMessage from DTO payload
     * @param payload
     */
    public static createFromPayload(payload: string): PersistentHarvestingDelegationMessage {
        const msgTypeHex = MessageType.PersistentHarvestingDelegationMessage.toString(16).toUpperCase();
        return new PersistentHarvestingDelegationMessage(msgTypeHex + payload.toUpperCase());
    }

    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param senderPublicKey - Sender public key
     * @param {NetworkType} networkType - Catapult network type
     * @return {string}
     */
    public static decrypt(encryptMessage: PersistentHarvestingDelegationMessage,
                          privateKey: string,
                          senderPublicKey: string,
                          networkType: NetworkType): string {
        const signSchema = SHA3Hasher.resolveSignSchema(networkType);
        const payload = encryptMessage.payload.substring(MessageMarker.PersistentDelegationUnlock.length);
        const decrypted = Crypto.decode(privateKey, senderPublicKey, payload, signSchema);
        return decrypted.toUpperCase();
    }
}
