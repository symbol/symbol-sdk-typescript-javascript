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

import {Crypto, SignSchema} from '../../core/crypto';
import { IdGenerator } from '../../core/format';

export class NamespaceMosaicIdGenerator {
    /**
     * @returns mosaic Id
     */
    public static mosaicId = (nonce, ownerPublicId, signSchema: SignSchema = SignSchema.SHA3) => {
        return IdGenerator.generateMosaicId(nonce, ownerPublicId, signSchema);
    }

    /**
     * @returns random mosaic nonce
     */
    public static generateRandomMosaicNonce = () => {
        return Crypto.randomBytes(4);
    }

    /**
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static namespaceId = (namespaceName, signSchema: SignSchema = SignSchema.SHA3) => {
        const path = IdGenerator.generateNamespacePath(namespaceName, signSchema);
        return path.length ? IdGenerator.generateNamespacePath(namespaceName, signSchema)[path.length - 1] : [];
    }
    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace parent id
     */
    public static subnamespaceParentId = (
        parentNamespaceName: string,
        namespaceName: string,
        signSchema: SignSchema = SignSchema.SHA3,
    ) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`, signSchema);
        return IdGenerator.generateNamespacePath(parentNamespaceName, signSchema)[path.length - 2];
    }

    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static subnamespaceNamespaceId = (
        parentNamespaceName: string,
        namespaceName: string,
        signSchema: SignSchema = SignSchema.SHA3,
    ) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`, signSchema);
        return path[path.length - 1];
    }

}
