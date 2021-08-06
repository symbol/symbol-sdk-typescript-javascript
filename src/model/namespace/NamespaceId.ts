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
import { NamespaceIdDto } from 'catbuffer-typescript';
import { Convert, RawAddress } from '../../core/format';
import { NamespaceMosaicIdGenerator } from '../../infrastructure/transaction';
import { NetworkType } from '../network';
import { UInt64 } from '../UInt64';

/**
 * The namespace id structure describes namespace id
 *
 * @since 1.0
 */
export class NamespaceId {
    /**
     * Namespace id
     */
    public readonly id: UInt64;

    /**
     * Namespace full name
     */
    public readonly fullName?: string;

    /**
     * Create NamespaceId from namespace string name (ex: nem or domain.subdom.subdome)
     * or id in form of array number (ex: [929036875, 2226345261])
     *
     * @param id
     */
    constructor(id: string | bigint | number | number[]) {
        if (typeof id === 'bigint' || typeof id === 'number' || id instanceof Array) {
            this.id = new UInt64(id);
        } else if (typeof id === 'string') {
            this.fullName = id;
            this.id = new UInt64(NamespaceMosaicIdGenerator.namespaceId(id));
        }
    }

    /**
     * Create a NamespaceId object from its encoded hexadecimal notation.
     * @param encoded
     * @returns {NamespaceId}
     */
    public static createFromEncoded(hex: string): NamespaceId {
        const higher = parseInt(hex.substr(0, 8), 16);
        const lower = parseInt(hex.substr(8, 8), 16);
        return new NamespaceId(UInt64.toBigInt([lower, higher]));
    }

    /**
     * Get string value of id
     * @returns {string}
     */
    public toHex(): string {
        return this.id.toHex();
    }

    /**
     * Compares namespaceIds for equality.
     *
     * @return boolean
     */
    public equals(id: any): boolean {
        if (id instanceof NamespaceId) {
            return this.id.value == id.id.value;
        }
        return false;
    }

    /**
     * Create DTO object
     */
    public toDTO(): any {
        return {
            id: this.id.toHex(),
            fullName: this.fullName ? this.fullName : '',
        };
    }

    /**
     * Creates the builder object.
     */
    public toBuilder(): NamespaceIdDto {
        return new NamespaceIdDto(this.id.toDTO());
    }

    /**
     * Encoded unresolved address
     * @returns {Uint8Array}
     */
    public encodeUnresolvedAddress(networkType: NetworkType): Uint8Array {
        return RawAddress.aliasToRecipient(Convert.hexToUint8(this.toHex()), networkType);
    }

    /**
     * Get string value of id
     * @returns {string}
     */
    public plain(): string {
        return this.toHex();
    }
}
