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

import { array, Schema, TypeSize, ubyte, uint, ushort } from './Schema';

/**
 * @module schema/MosaicCreationTransactionSchema
 */

/**
 * Mosaic definition creation transaction schema
 * @const {module:schema/Schema}
 */
export const schema = new Schema([
	uint('size'),
	array('signature'),
	array('signer'),
	ushort('version'),
	ushort('type'),
	array('fee', TypeSize.INT),
	array('deadline', TypeSize.INT),
	array('nonce', TypeSize.BYTE),
	array('mosaicId', TypeSize.INT),
	ubyte('numOptionalProperties'),
	ubyte('flags'),
	ubyte('divisibility'),
	ubyte('indicateDuration'),
	array('duration', TypeSize.INT)
]);

export const schemaNoDuration = new Schema([
	uint('size'),
	array('signature'),
	array('signer'),
	ushort('version'),
	ushort('type'),
	array('fee', TypeSize.INT),
	array('deadline', TypeSize.INT),
	array('nonce', TypeSize.BYTE),
	array('mosaicId', TypeSize.INT),
	ubyte('numOptionalProperties'),
	ubyte('flags'),
	ubyte('divisibility')
]);
