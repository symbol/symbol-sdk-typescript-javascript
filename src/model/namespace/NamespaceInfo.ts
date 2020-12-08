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

import {
    AddressDto,
    HeightDto,
    NamespaceAliasBuilder,
    NamespaceIdDto,
    NamespaceLifetimeBuilder,
    NamespacePathBuilder,
    RootNamespaceHistoryBuilder,
} from 'catbuffer-typescript';
import { Address } from '../account/Address';
import { UInt64 } from '../UInt64';
import { Alias } from './Alias';
import { NamespaceId } from './NamespaceId';
import { NamespaceRegistrationType } from './NamespaceRegistrationType';
import Long = require('long');

/**
 * Object containing information of a namespace.
 */
export class NamespaceInfo {
    /**
     * @param version
     * @param active
     * @param index
     * @param recordId
     * @param registrationType
     * @param depth
     * @param levels
     * @param parentId
     * @param ownerAddress
     * @param startHeight
     * @param endHeight
     * @param alias
     */
    constructor(
        /**
         * Version
         */
        public readonly version: number,
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
        public readonly recordId: string,
        /**
         * The namespace registration type, namespace and sub namespace.
         */
        public readonly registrationType: number,
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
        public readonly parentId: NamespaceId,
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

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(fullPath: NamespaceInfo[]): Uint8Array {
        const root = fullPath.find((n) => n.registrationType === NamespaceRegistrationType.RootNamespace);
        if (!root) {
            throw new Error('Cannot find root namespace info.');
        }
        const id: NamespaceIdDto = root.id.toBuilder();
        const ownerAddress: AddressDto = root.ownerAddress.toBuilder();
        const lifetime: NamespaceLifetimeBuilder = new NamespaceLifetimeBuilder(
            new HeightDto(root.startHeight.toDTO()),
            new HeightDto(root.endHeight.toDTO()),
        );
        const rootAlias = this.getAliasBuilder(root);
        const paths: NamespacePathBuilder[] = this.getNamespacePath(fullPath, root.id);
        return new RootNamespaceHistoryBuilder(this.version, id, ownerAddress, lifetime, rootAlias, paths).serialize();
    }

    /**
     * Generate the namespace full path builder
     * @param namespaces Full path of namespaces
     * @param rootId Root namespace id
     * @returns {NamespacePathBuilder[]}
     */
    private getNamespacePath(namespaces: NamespaceInfo[], rootId: NamespaceId): NamespacePathBuilder[] {
        const path: NamespacePathBuilder[] = [];
        const level1 = this.sortNamespaceInfo(namespaces.filter((n) => n.depth === 2 && n.parentId.equals(rootId)));
        level1.forEach((n) => {
            const level2 = this.sortNamespaceInfo(namespaces.filter((l) => l.depth === 3 && l.parentId.equals(n.id)));
            path.push(new NamespacePathBuilder([n.id.toBuilder()], this.getAliasBuilder(n)));
            if (level2.length) {
                level2.forEach((l) => {
                    path.push(new NamespacePathBuilder([n.id.toBuilder(), l.id.toBuilder()], this.getAliasBuilder(l)));
                });
            }
        });
        return path;
    }

    /**
     * Generate namespace alias builder
     * @param namespaceInfo namespace info
     * @requires {NamespaceAliasBuilder}
     */
    private getAliasBuilder(namespaceInfo: NamespaceInfo): NamespaceAliasBuilder {
        return new NamespaceAliasBuilder(
            namespaceInfo.alias.type.valueOf(),
            namespaceInfo.alias.mosaicId?.toBuilder(),
            namespaceInfo.alias.address?.toBuilder(),
        );
    }

    /**
     * Sort namespace info by namespace id
     * @param info array of namespace info
     * @returns {NamespaceInfo[]}
     */
    private sortNamespaceInfo(info: NamespaceInfo[]): NamespaceInfo[] {
        return info.sort((a, b) => {
            const long_a = Long.fromBits(a.id.id.lower, a.id.id.higher, true);
            const long_b = Long.fromBits(b.id.id.lower, b.id.id.higher, true);
            return long_a.compare(long_b);
        });
    }
}
