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

import { NamespaceId } from './NamespaceId';

/**
 * The namespace name info structure describes basic information of a namespace and name.
 */
export class NamespaceName {
    /**
     * @param namespaceId
     * @param name
     */
    constructor(
        /**
         * The namespace id.
         */
        public readonly namespaceId: NamespaceId,
        /**
         * The namespace name.
         */
        public readonly name: string,
        /**
         * The parent id.
         */
        public readonly parentId?: NamespaceId,
    ) {}
}
