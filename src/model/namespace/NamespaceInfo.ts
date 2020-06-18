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

import { UInt64 } from '../UInt64';
import { Alias } from './Alias';
import { NamespaceId } from './NamespaceId';
import { Address } from '../account/Address';

/**
 * Object containing information of a namespace.
 */
export class NamespaceInfo {
    /**
     * @param active
     * @param index
     * @param metaId
     * @param registrationType
     * @param depth
     * @param levels
     * @param parentId
     * @param ownerAddress
     * @param startHeight
     * @param endHeight
     */
    constructor(
        /**
         * Namespace is active.
         */
        public readonly active: boolean,
        /**
         * The namespace index.
         */
        public readonly index: number,
        /**
         * The meta data id.
         */
        public readonly metaId: string,
        /**
         * The namespace registration type, namespace and sub namespace.
         */
        private readonly registrationType: number,
        /**
         * The level of namespace.
         */
        public readonly depth: number,
        /**
         * The namespace id levels.
         */
        public readonly levels: NamespaceId[],
        /**
         * The namespace parent id.
         */
        private readonly parentId: NamespaceId,
        /**
         * The namespace owner's address.
         */
        public readonly ownerAddress: Address,
        /**
         * The height at which the ownership begins.
         */
        public readonly startHeight: UInt64,
        /**
         * The height at which the ownership ends.
         */
        public readonly endHeight: UInt64,
        /**
         * The alias linked to a namespace.
         */
        public readonly alias: Alias,
    ) {}

    /**
     * Namespace id
     * @returns {Id}
     */
    get id(): NamespaceId {
        return this.levels[this.levels.length - 1];
    }

    /**
     * Is root namespace
     * @returns {boolean}
     */
    public isRoot(): boolean {
        return this.registrationType === 0;
    }

    /**
     * Is sub namepsace
     * @returns {boolean}
     */
    public isSubnamespace(): boolean {
        return this.registrationType === 1;
    }

    /**
     * Has alias
     * @returns {boolean}
     */
    public hasAlias(): boolean {
        return this.alias.type !== 0;
    }

    /**
     * Get parent id
     * @returns {Id}
     */
    public parentNamespaceId(): NamespaceId {
        if (this.isRoot()) {
            throw new Error('Is a Root Namespace');
        }
        return this.parentId;
    }
}
