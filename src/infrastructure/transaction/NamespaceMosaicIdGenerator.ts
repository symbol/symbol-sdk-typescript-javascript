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
import { IdGenerator } from '../../core/format';

export class NamespaceMosaicIdGenerator {
    /**
     * @param {Uint8Array} nonce Mosaic nonce
     * @param {Uint8Array} ownerAddress Address
     * @returns {number[]} mosaic Id
     */
    public static mosaicId = (nonce: Uint8Array, ownerAddress: Uint8Array): number[] => {
        return IdGenerator.generateMosaicId(nonce, ownerAddress);
    };

    /**
     * @returns random mosaic nonce
     */
    public static generateRandomMosaicNonce = (): any => {
        return Crypto.randomBytes(4);
    };

    /**
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static namespaceId = (namespaceName: string): any => {
        const path = IdGenerator.generateNamespacePath(namespaceName);
        return path.length ? IdGenerator.generateNamespacePath(namespaceName)[path.length - 1] : [];
    };
    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace parent id
     */
    public static subnamespaceParentId = (parentNamespaceName: string, namespaceName: string): any => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
        return IdGenerator.generateNamespacePath(parentNamespaceName)[path.length - 2];
    };

    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static subnamespaceNamespaceId = (parentNamespaceName: string, namespaceName: string): any => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
        return path[path.length - 1];
    };
}
