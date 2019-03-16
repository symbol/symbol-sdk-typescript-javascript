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

import {NamespaceId} from '../namespace/NamespaceId';
import {Address} from './Address';

/**
 * The Recipient structure describes a recipient with either `namespaceId` or `address` filled.
 */
export class Recipient {

    /**
     * @param value
     */
    constructor(/**
                 * The encoded (hexadecimal) recipient notation
                 */
                public readonly value: Address | NamespaceId) {
    }

    /**
     * Create a Recipient object from its encoded hexadecimal notation
     * @param encoded
     */
    public static createFromEncoded(encoded: string): Recipient {

        // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
        // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
        const fstByteBit0 = encoded.substr(1, 1);

        if (parseInt(fstByteBit0, 2) === 1) {
            // namespaceId encoded hexadecimal notation provided
            // only 8 bytes are relevant to resolve the NamespaceId
            const relevantPart = encoded.substr(2, 16);
            const namespaceId = NamespaceId.createFromEncoded(relevantPart);
            return new Recipient(namespaceId);
        }

        // read address from encoded hexadecimal notation
        const address = Address.createFromEncoded(encoded);
        return new Recipient(address);
    }

    /**
     * Compares recipients for equality
     * @param recipient - Recipient
     * @returns {boolean}
     */
    public equals(recipient: Recipient): boolean {

        if (this.value instanceof NamespaceId && recipient.value instanceof NamespaceId) {
            return (this.value as NamespaceId).equals(recipient.value as NamespaceId);
        } else if (this.value instanceof Address && recipient.value instanceof Address) {
            return (this.value as Address).equals(recipient.value as Address);
        }

        return false;
    }
}
