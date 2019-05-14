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

/** @module coders/base32 */
import charMapping from './charMapping';

const Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const Decoded_Block_Size = 5;
const Encoded_Block_Size = 8;

// region encode

function encodeBlock(input, inputOffset, output, outputOffset) {
	output[outputOffset + 0] = Alphabet[input[inputOffset + 0] >> 3];
	output[outputOffset + 1] = Alphabet[((input[inputOffset + 0] & 0x07) << 2) | (input[inputOffset + 1] >> 6)];
	output[outputOffset + 2] = Alphabet[(input[inputOffset + 1] & 0x3E) >> 1];
	output[outputOffset + 3] = Alphabet[((input[inputOffset + 1] & 0x01) << 4) | (input[inputOffset + 2] >> 4)];
	output[outputOffset + 4] = Alphabet[((input[inputOffset + 2] & 0x0F) << 1) | (input[inputOffset + 3] >> 7)];
	output[outputOffset + 5] = Alphabet[(input[inputOffset + 3] & 0x7F) >> 2];
	output[outputOffset + 6] = Alphabet[((input[inputOffset + 3] & 0x03) << 3) | (input[inputOffset + 4] >> 5)];
	output[outputOffset + 7] = Alphabet[input[inputOffset + 4] & 0x1F];
}

// endregion

// region decode

const Char_To_Decoded_Char_Map = (function () {
	const builder = charMapping.createBuilder();
	builder.addRange('A', 'Z', 0);
	builder.addRange('2', '7', 26);
	return builder.map;
})();

function decodeChar(c) {
	const decodedChar = Char_To_Decoded_Char_Map[c];
	if (undefined !== decodedChar)
		return decodedChar;

	throw Error(`illegal base32 character ${c}`);
}

function decodeBlock(input, inputOffset, output, outputOffset) {
	const bytes = new Uint8Array(Encoded_Block_Size);
	for (let i = 0; i < Encoded_Block_Size; ++i)
		bytes[i] = decodeChar(input[inputOffset + i]);

	output[outputOffset + 0] = (bytes[0] << 3) | (bytes[1] >> 2);
	output[outputOffset + 1] = ((bytes[1] & 0x03) << 6) | (bytes[2] << 1) | (bytes[3] >> 4);
	output[outputOffset + 2] = ((bytes[3] & 0x0F) << 4) | (bytes[4] >> 1);
	output[outputOffset + 3] = ((bytes[4] & 0x01) << 7) | (bytes[5] << 2) | (bytes[6] >> 3);
	output[outputOffset + 4] = ((bytes[6] & 0x07) << 5) | bytes[7];
}

// endregion

export default {
	/**
	 * Base32 encodes a binary buffer.
	 * @param {Uint8Array} data The binary data to encode.
	 * @returns {string} The base32 encoded string corresponding to the input data.
	 */
	encode: data => {
		if (0 !== data.length % Decoded_Block_Size)
			throw Error(`decoded size must be multiple of ${Decoded_Block_Size}`);

		const output = new Array(data.length / Decoded_Block_Size * Encoded_Block_Size);
		for (let i = 0; i < data.length / Decoded_Block_Size; ++i)
			encodeBlock(data, i * Decoded_Block_Size, output, i * Encoded_Block_Size);

		return output.join('');
	},

	/**
	 * Base32 decodes a base32 encoded string.
	 * @param {string} encoded The base32 encoded string to decode.
	 * @returns {Uint8Array} The binary data corresponding to the input string.
	 */
	decode: encoded => {
		if (0 !== encoded.length % Encoded_Block_Size)
			throw Error(`encoded size must be multiple of ${Encoded_Block_Size}`);

		const output = new Uint8Array(encoded.length / Encoded_Block_Size * Decoded_Block_Size);
		for (let i = 0; i < encoded.length / Encoded_Block_Size; ++i)
			decodeBlock(encoded, i * Encoded_Block_Size, output, i * Decoded_Block_Size);

		return output;
	}
};
