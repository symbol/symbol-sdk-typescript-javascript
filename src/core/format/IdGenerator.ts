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
import {NetworkType} from '../../model/blockchain/NetworkType';
import {SHA3Hasher} from '../crypto/SHA3Hasher';
import * as utilities from './Utilities';

export class IdGenerator {
    /**
     * Generates a mosaic id given a nonce and a public id.
     * @param   {object}        nonce           The mosaic nonce.
     * @param   {object}        ownerPublicId   The public id.
     * @param   {NetworkType}   networkType     The network type for hash algorithm resolution
     * @returns {module:coders/uint64~uint64} The mosaic id.
     */
    public static generateMosaicId = (
        nonce,
        ownerPublicId,
        networkType: NetworkType,
    ) => {
        const signSchema = SHA3Hasher.resolveSignSchema(networkType);
        const hash = SHA3Hasher.getHasher(32, signSchema).create();
        hash.update(nonce);
        hash.update(ownerPublicId);
        const result = new Uint32Array(hash.arrayBuffer());
        return [result[0], result[1] & 0x7FFFFFFF];
    }

    /**
     * Generates a namespace id given a parent id and name.
     * @param   {object}        parentId    The parent namespace id.
     * @param   {object}        name        The namespace name.
     * @param   {NetworkType}   networkType The network type for hash algorithm resolution
     * @returns {module:coders/uint64~uint64} The namespace id.
     */
    public static generateNamespaceId = (
        parentId,
        name: string,
        networkType: NetworkType,
    ) => {
        const signSchema = SHA3Hasher.resolveSignSchema(networkType);
        const hash = SHA3Hasher.getHasher(32, signSchema).create();
        hash.update(Uint32Array.from(parentId).buffer as any);
        hash.update(name);
        const result = new Uint32Array(hash.arrayBuffer());
        // right zero-filling required to keep unsigned number representation
        return [result[0], (result[1] | 0x80000000) >>> 0];
    }

    /**
     * Parses a unified namespace name into a path.
     * @param   {string}        name        The unified namespace name.
     * @param   {NetworkType}   networkType The network type for hash algorithm resolution
     * @returns {array<module:coders/uint64~uint64>} The namespace path.
     */
    public static generateNamespacePath = (
        name: string,
        networkType: NetworkType,
    ) => {
        if (0 >= name.length) {
            utilities.throwInvalidFqn('having zero length', name);
        }
        let namespaceId = utilities.idGeneratorConst.namespace_base_id;
        const path = [];
        const start = utilities.split(name, (substringStart, size) => {
            namespaceId = IdGenerator.generateNamespaceId(
                namespaceId,
                utilities.extractPartName(name, substringStart, size),
                networkType,
            );
            utilities.append(path, namespaceId, name);
        });
        namespaceId = IdGenerator.generateNamespaceId(
            namespaceId,
            utilities.extractPartName(name, start, name.length - start),
            networkType,
        );
        utilities.append(path, namespaceId, name);
        return path;
    }
}
