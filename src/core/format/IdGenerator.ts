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
import { SHA3Hasher } from '../crypto';
import * as utilities from './Utilities';

export class IdGenerator {
    /**
     * Generates a mosaic id given a nonce and a address.
     * @param {object} nonce The mosaic nonce.
     * @param {object} ownerAddress The address.
     * @returns {module:coders/uint64~uint64} The mosaic id.
     */
    public static generateMosaicId = (nonce: number[] | Uint8Array, ownerAddress: number[] | Uint8Array): number[] => {
        const hash = SHA3Hasher.getHasher(32).create();
        hash.update(new Uint8Array(nonce));
        hash.update(new Uint8Array(ownerAddress));
        const result = new Uint32Array(hash.digest().buffer);
        return [result[0], result[1] & 0x7fffffff];
    };

    /**
     * Parses a unified namespace name into a path.
     * @param {string} name The unified namespace name.
     * @returns {array<module:coders/uint64~uint64>} The namespace path.
     */
    public static generateNamespacePath = (name: string): number[] => {
        if (0 >= name.length) {
            utilities.throwInvalidFqn('having zero length', name);
        }
        let namespaceId = utilities.idGeneratorConst.namespace_base_id;
        const path = [];
        const start = utilities.split(name, (substringStart, size) => {
            namespaceId = utilities.generateNamespaceId(namespaceId, utilities.extractPartName(name, substringStart, size));
            utilities.append(path, namespaceId);
        });
        namespaceId = utilities.generateNamespaceId(namespaceId, utilities.extractPartName(name, start, name.length - start));
        utilities.append(path, namespaceId);
        return path;
    };
}
