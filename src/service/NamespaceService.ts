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

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import {Observable} from 'rxjs/Observable';
import {NamespaceHttp} from '../infrastructure/NamespaceHttp';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {NamespaceInfo} from '../model/namespace/NamespaceInfo';
import {NamespaceName} from '../model/namespace/NamespaceName';
import {Namespace} from './Namespace';

/**
 * Namespace service
 */
export class NamespaceService {

    /**
     * Constructor
     * @param namespaceHttp
     */
    constructor(private readonly namespaceHttp: NamespaceHttp) {
    }

    /**
     * Get namespace info and name from namespace Id
     * @param id
     * @returns {Observable<Namespace>}
     */
    namespace(id: NamespaceId): Observable<Namespace> {
        return this.namespaceHttp.getNamespace(id)
            .flatMap((namespaceInfo: NamespaceInfo) => this.namespaceHttp
                .getNamespacesName(namespaceInfo.levels)
                .map((names) => Object.assign(
                    {__proto__: Object.getPrototypeOf(namespaceInfo)},
                    namespaceInfo,
                    {name: this.extractFullNamespace(namespaceInfo, names)})));
    }

    private extractFullNamespace(namespace: NamespaceInfo, namespaceNames: NamespaceName[]): string {
        return namespace.levels.map((level) => {
            const namespaceName = namespaceNames.find((name) => name.namespaceId.equals(level));
            if (namespace === undefined) {
                throw new Error('Not found');
            }
            return namespaceName;
        })
            .map((namespaceName: NamespaceName) => namespaceName.name)
            .join('.');
    }
}
