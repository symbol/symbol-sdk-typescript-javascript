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
import { Convert } from '../../core/format/Convert';
import { Account } from '../account/Account';
import { NetworkType } from '../network/NetworkType';
import { Message } from './Message';
import { MessageMarker } from './MessageMarker';
import { MessageType } from './MessageType';

export class PersistentHarvestingDelegationMessage extends Message {
    constructor(payload: string) {
        super(MessageType.PersistentHarvestingDelegationMessage, payload);
        if (!Convert.isHexString(payload)) {
            throw Error('Payload format is not valid hexadecimal string');
        }
    }

    /**
     * @param signingPrivateKey - Remote harvester signing private key linked to the main account
     * @param vrfPrivateKey - VRF private key linked to the main account
     * @param nodePublicKey - Node certificate public key
     * @param {NetworkType} networkType - Catapult network type
     * @return {PersistentHarvestingDelegationMessage}
     */
    public static create(
        signingPrivateKey: string,
        vrfPrivateKey: string,
        nodePublicKey: string,
        networkType: NetworkType,
    ): PersistentHarvestingDelegationMessage {
        const ephemeralKeypair = Account.generateNewAccount(networkType);
        const encrypted =
            MessageMarker.PersistentDelegationUnlock +
            ephemeralKeypair.publicKey +
            Crypto.encode(ephemeralKeypair.privateKey, nodePublicKey, signingPrivateKey + vrfPrivateKey, true).toUpperCase();
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
     * @param privateKey - Node certificate private key
     * @return {string}
     */
    public static decrypt(encryptMessage: PersistentHarvestingDelegationMessage, privateKey: string): string {
        const markerLength = MessageMarker.PersistentDelegationUnlock.length;
        const ephemeralPublicKey = encryptMessage.payload.substring(markerLength, markerLength + 64);
        const payload = encryptMessage.payload.substring(markerLength + ephemeralPublicKey.length);
        const decrypted = Crypto.decode(privateKey, ephemeralPublicKey, payload);
        return decrypted.toUpperCase();
    }
}
