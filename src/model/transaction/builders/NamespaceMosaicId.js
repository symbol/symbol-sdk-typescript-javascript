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

import IdGenerator from '../coders/idGenerator';
import {nacl_catapult} from '../crypto/nacl_catapult';

export function mosaicId(nonce, ownerPublicId) {
	return IdGenerator.generateMosaicId(nonce, ownerPublicId);
}

export function generateRandomMosaicNonce() {
	return nacl_catapult.randomBytes(4);
}

export function namespaceId(namespaceName) {
	const path = IdGenerator.generateNamespacePath(namespaceName);
	return path.length ? IdGenerator.generateNamespacePath(namespaceName)[path.length - 1] : [];
}

export function subnamespaceParentId(parentNamespaceName, namespaceName) {
	const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
	return IdGenerator.generateNamespacePath(parentNamespaceName)[path.length - 2];
}

export function subnamespaceNamespaceId(parentNamespaceName, namespaceName) {
	const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
	return path[path.length - 1];
}

