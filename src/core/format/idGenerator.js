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

import { sha3_256 } from 'js-sha3';


const constants = {
	namespace_base_id: [0, 0],
	namespace_max_depth: 3,
	name_pattern: /^[a-z0-9][a-z0-9-_]*$/
};

const generateNamespaceId = (parentId, name) => {
	const hash = sha3_256.create();
	hash.update(Uint32Array.from(parentId).buffer);
	hash.update(name);
	const result = new Uint32Array(hash.arrayBuffer());
	// right zero-filling required to keep unsigned number representation
	return [result[0], (result[1] | 0x80000000) >>> 0];
}

function throwInvalidFqn(reason, name) {
	throw Error(`fully qualified id is invalid due to ${reason} (${name})`);
}

function extractPartName(name, start, size) {
	if (0 === size)
		throwInvalidFqn('empty part', name);

	const partName = name.substr(start, size);
	if (!constants.name_pattern.test(partName))
		throwInvalidFqn(`invalid part name [${partName}]`, name);

	return partName;
}

function append(path, id, name) {
	if (constants.namespace_max_depth === path.length)
		throwInvalidFqn('too many parts', name);

	path.push(id);
}

function split(name, processor) {
	let start = 0;
	for (let index = 0; index < name.length; ++index) {
		if ('.' === name[index]) {
			processor(start, index - start);
			start = index + 1;
		}
	}

	return start;
}

/** @exports coders/idGenerator */
const idGenerator = {
	/**
	 * Generates a mosaic id given a nonce and a public id.
	 * @param {object} nonce The mosaic nonce.
	 * @param {object} name The public id.
	 * @returns {module:coders/uint64~uint64} The mosaic id.
	 */
	generateMosaicId: (nonce, ownerPublicId) => {
		const hash = sha3_256.create();
		hash.update(nonce);
		hash.update(ownerPublicId);
		const result = new Uint32Array(hash.arrayBuffer());
		return [result[0], result[1] & 0x7FFFFFFF];
	},

	/**
	 * Parses a unified namespace name into a path.
	 * @param {string} name The unified namespace name.
	 * @returns {array<module:coders/uint64~uint64>} The namespace path.
	 */
	generateNamespacePath: name => {
		if (0 >= name.length)
			throwInvalidFqn('having zero length', name);

		let namespaceId = constants.namespace_base_id;
		const path = [];
		const start = split(name, (substringStart, size) => {
			namespaceId = generateNamespaceId(namespaceId, extractPartName(name, substringStart, size));
			append(path, namespaceId, name);
		});

		namespaceId = generateNamespaceId(namespaceId, extractPartName(name, start, name.length - start));
		append(path, namespaceId, name);
		return path;
	}
};

export default idGenerator;
