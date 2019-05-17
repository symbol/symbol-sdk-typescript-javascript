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

/** @module crypto/sha3Hasher */
import { sha3_256, sha3_512 } from 'js-sha3';

const array = require('../format/array');
import  convert  from '../format/convert';

function getHasher(length = 64) {
	return { 32: sha3_256, 64: sha3_512 }[length];
}

/**
 * Calculates the hash of data.
 * @param {Uint8Array} dest The computed hash destination.
 * @param {Uint8Array} data The data to hash.
 * @param {numeric} length The hash length in bytes.
 */
function func(dest, data, length) {
	const hasher = getHasher(length);
	const hash = hasher.arrayBuffer(data);
	array.default.copy(dest, array.default.uint8View(hash));
}

/**
 * Creates a hasher object.
 * @param {numeric} length The hash length in bytes.
 * @returns {object} The hasher.
 */
function createHasher(length) {
	let hash;
	return {
		reset: () => {
			hash = getHasher(length).create();
		},
		update: data => {
			if (data instanceof Uint8Array)
				hash.update(data);
			else if ('string' === typeof data)
				hash.update(convert.hexToUint8(data));
			else
				throw Error('unsupported data type');
		},
		finalize: result => {
			array.default.copy(result, array.default.uint8View(hash.arrayBuffer()));
		}
	};
}
module.exports.sha3Hasher = {
    func,
    createHasher
}
