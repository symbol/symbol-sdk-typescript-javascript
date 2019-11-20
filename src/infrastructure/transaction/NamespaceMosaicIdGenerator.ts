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

import {Crypto} from '../../core/crypto';
import {IdGenerator} from '../../core/format';
import {NetworkType} from '../../model/blockchain/NetworkType';

export class NamespaceMosaicIdGenerator {
    /**
     * @param   nonce           {object}        Uint8Array of bytes for nonce OR array with uint8 integer
     * @param   networkType     {NetworkType}   The network type for hash algorithm resolution
     * @returns mosaic Id
     */
    public static mosaicId = (
        nonce,
        ownerPublicId,
        networkType: NetworkType,
    ) => {
        return IdGenerator.generateMosaicId(nonce, ownerPublicId, networkType);
    }

    /**
     * @returns random mosaic nonce
     */
    public static generateRandomMosaicNonce = () => {
        return Crypto.randomBytes(4);
    }

    /**
     * @param   {string}        namespaceName   The namespace name
     * @param   {NetworkType}   networkType     The network type for hash algorithm resolution
     * @returns sub namespace id
     */
    public static namespaceId = (
        namespaceName,
        networkType: NetworkType,
    ) => {
        const path = IdGenerator.generateNamespacePath(namespaceName, networkType);
        return path.length ? IdGenerator.generateNamespacePath(namespaceName, networkType)[path.length - 1] : [];
    }

    /**
     * @param   {string}        parentNamespaceName The parent namespace name
     * @param   {string}        namespaceName       The namespace name
     * @param   {NetworkType}   networkType         The network type for hash algorithm resolution
     * @returns sub namespace parent id
     */
    public static subnamespaceParentId = (
        parentNamespaceName: string,
        namespaceName: string,
        networkType: NetworkType,
    ) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`, networkType);
        return IdGenerator.generateNamespacePath(parentNamespaceName, networkType)[path.length - 2];
    }

    /**
     * @param   {string}        parentNamespaceName The parent namespace name
     * @param   {string}        namespaceName       The namespace name
     * @param   {NetworkType}   networkType         The network type for hash algorithm resolution
     * @returns sub namespace id
     */
    public static subnamespaceNamespaceId = (
        parentNamespaceName: string,
        namespaceName: string,
        networkType: NetworkType,
    ) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`, networkType);
        return path[path.length - 1];
    }

}
