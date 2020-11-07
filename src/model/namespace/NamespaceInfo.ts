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

/**
 * Object containing information of a namespace.
 */
export class NamespaceInfo {
    /**
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
        public readonly recordId: string,
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

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(children: NamespaceInfo[]): Uint8Array {
        const id: NamespaceIdDto = this.id.toBuilder();
        const ownerAddress: AddressDto = this.ownerAddress.toBuilder();
        const lifetime: NamespaceLifetimeBuilder = new NamespaceLifetimeBuilder(
            new HeightDto(this.startHeight.toDTO()),
            new HeightDto(this.endHeight.toDTO()),
        );
        const rootAlias = this.alias.type;
        const paths: NamespacePathBuilder[] = children.map((dto) => this.toNamespaceAliasTypeDto(dto));
        return new RootNamespaceHistoryBuilder(id, ownerAddress, lifetime, rootAlias, paths).serialize();
    }

    private toNamespaceAliasTypeDto(namespaceInfo: NamespaceInfo): NamespacePathBuilder {
        const path: NamespaceIdDto[] = namespaceInfo.levels.map((id) => id.toBuilder());
        const alias: NamespaceAliasBuilder = new NamespaceAliasBuilder(
            namespaceInfo.alias.type.valueOf(),
            namespaceInfo.alias.mosaicId?.toBuilder(),
            namespaceInfo.alias.address?.toBuilder(),
        );
        return new NamespacePathBuilder(path, alias);
    }
}
