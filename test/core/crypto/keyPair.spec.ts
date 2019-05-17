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

import { expect } from 'chai';
import { keyPair as KeyPair} from '../../../src/core/crypto/keyPair';
import * as test from '../../testUtils.spec';

const convert = require('../../../src/core/format/convert').default;

describe('key pair', () => {
	const Private_Key_Size = 32;
	const Signature_Size = 64;
	const Private_Keys = [
		'8D31B712AB28D49591EAF5066E9E967B44507FC19C3D54D742F7B3A255CFF4AB',
		'15923F9D2FFFB11D771818E1F7D7DDCD363913933264D58533CB3A5DD2DAA66A',
		'A9323CEF24497AB770516EA572A0A2645EE2D5A75BC72E78DE534C0A03BC328E',
		'D7D816DA0566878EE739EDE2131CD64201BCCC27F88FA51BA5815BCB0FE33CC8',
		'27FC9998454848B987FAD89296558A34DEED4358D1517B953572F3E0AAA0A22D'
	];
	describe('construction', () => {
		it('can extract from private key test vectors', () => {
			// Arrange:
			const Expected_Public_Keys = [
				'53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1B',
				'3FE4A1AA148F5E76891CE924F5DC05627A87047B2B4AD9242C09C0ECED9B2338',
				'F398C0A2BDACDBD7037D2F686727201641BBF87EF458F632AE2A04B4E8F57994',
				'6A283A241A8D8203B3A1E918B1E6F0A3E14E75E16D4CFFA45AE4EF89E38ED6B5',
				'4DC62B38215826438DE2369743C6BBE6D13428405025DFEFF2857B9A9BC9D821'
			];
			// Assert:
			expect(Private_Keys.length).equal(Expected_Public_Keys.length);
			for (let i = 0; i < Private_Keys.length; ++i) {
				// Arrange:
				const privateKeyHex = Private_Keys[i];
				const expectedPublicKey = Expected_Public_Keys[i];

				// Act:
				const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex);

				// Assert:
				const message = ` from ${privateKeyHex}`;
				expect(convert.uint8ToHex(keyPair.publicKey), `public ${message}`).equal(expectedPublicKey);
				expect(convert.uint8ToHex(keyPair.privateKey), `private ${message}`).equal(privateKeyHex);
			}
		});
		it('cannot extract from invalid private key', () => {
			// Arrange:
			const invalidPrivateKeys = [
				'', // empty
				'53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
				'53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB' // long
			];
			// Act:
			invalidPrivateKeys.forEach(privateKey => {
				// Assert:
				expect(() => {
					KeyPair.createKeyPairFromPrivateKeyString(privateKey);
				}, `from ${privateKey}`).to.throw('private key has unexpected size');
			});
		});
	});
	describe('sign', () => {
		it('fills the signature', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);

			// Act:
			const signature = KeyPair.sign(keyPair, payload);

			// Assert:
			expect(signature).to.not.deep.equal(new Uint8Array(Signature_Size));
		});

		it('returns same signature for same data signed by same key pairs', () => {
			// Arrange:
			const privateKey = convert.uint8ToHex(test.default.random.bytes(Private_Key_Size));
			const keyPair1 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
			const keyPair2 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
			const payload = test.default.random.bytes(100);

			// Act:
			const signature1 = KeyPair.sign(keyPair1, payload);
			const signature2 = KeyPair.sign(keyPair2, payload);

			// Assert:
			expect(signature2).to.deep.equal(signature1);
		});

		it('returns different signature for same data signed by different key pairs', () => {
			// Arrange:
			const keyPair1 = test.default.random.keyPair();
			const keyPair2 = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);

			// Act:
			const signature1 = KeyPair.sign(keyPair1, payload);
			const signature2 = KeyPair.sign(keyPair2, payload);

			// Assert:
			expect(signature2).to.not.deep.equal(signature1);
		});

		it('cannot sign unsupported data type', () => {
			// Arrange:
			const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[0]);
			// expect(KeyPair.sign(keyPair, {})).to.not.deep.equal('');
		});
	});

	describe('verify', () => {
		it('returns true for data signed with same key pair', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);
			const signature = KeyPair.sign(keyPair, payload);

			// Act:
			const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

			// Assert:
			expect(isVerified).to.equal(true);
		});

		it('returns false for data signed with different key pair', () => {
			// Arrange:
			const keyPair1 = test.default.random.keyPair();
			const keyPair2 = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);
			const signature = KeyPair.sign(keyPair1, payload);
			// Act:
			const isVerified = KeyPair.verify(keyPair2.publicKey, payload, signature);
			// Assert:
			expect(isVerified).to.equal(false);
		});

		it('returns false if signature has been modified', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);

			for (let i = 0; i < Signature_Size; i += 4) {
				const signature = KeyPair.sign(keyPair, payload);
				signature[i] ^= 0xFF;
				// Act:
				const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);
				// Assert:
				expect(isVerified, `signature modified at ${i}`).to.equal(false);
			}
		});

		it('returns false if payload has been modified', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = test.default.random.bytes(44);

			for (let i = 0; i < payload.length; i += 4) {
				const signature = KeyPair.sign(keyPair, payload);
				payload[i] ^= 0xFF;

				// Act:
				const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

				// Assert:
				expect(isVerified, `payload modified at ${i}`).to.equal(false);
			}
		});

		it('fails if public key is not on curve', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			keyPair.publicKey.fill(0);
			keyPair.publicKey[keyPair.publicKey.length - 1] = 1;

			const payload = test.default.random.bytes(100);
			const signature = KeyPair.sign(keyPair, payload);

			// Act:
			const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

			// Assert:
			expect(isVerified).to.equal(false);
		});

		it('fails if public key does not correspond to private key', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = test.default.random.bytes(100);
			const signature = KeyPair.sign(keyPair, payload);

			for (let i = 0; i < keyPair.publicKey.length; ++i)
				keyPair.publicKey[i] ^= 0xFF;

			// Act:
			const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

			// Assert:
			expect(isVerified).to.equal(false);
		});

		it('rejects zero public key', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			keyPair.publicKey.fill(0);

			const payload = test.default.random.bytes(100);
			const signature = KeyPair.sign(keyPair, payload);

			// Act:
			const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

			// Assert:
			expect(isVerified).to.equal(false);
		});

		it('cannot verify non canonical signature', () => {
			function scalarAddGroupOrder(scalar) {
				// 2^252 + 27742317777372353535851937790883648493, little endian
				const Group_Order = [
					0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
					0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10
				];

				let r = 0;
				for (let i = 0; i < scalar.length; ++i) {
					const t = scalar[i] + Group_Order[i];
					scalar[i] += Group_Order[i] + r;
					r = (t >> 8) & 0xFF;
				}
			}

			// Arrange:
			const keyPair = test.default.random.keyPair();
			const payload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
			const canonicalSignature = KeyPair.sign(keyPair, payload);

			// this is signature with group order added to 'encodedS' part of signature
			const nonCanonicalSignature = canonicalSignature.slice();
			scalarAddGroupOrder(nonCanonicalSignature.subarray(32));

			// Act:
			const isCanonicalVerified = KeyPair.verify(keyPair.publicKey, payload, canonicalSignature);
			const isNonCanonicalVerified = KeyPair.verify(keyPair.privateKey, payload, nonCanonicalSignature);

			// Assert:
			expect(isCanonicalVerified).to.equal(true);
			expect(isNonCanonicalVerified).to.equal(false);
		});
	});

	describe('test vectors', () => {
		const Input_Data = [
			'8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9',
			'e4a92208a6fc52282b620699191ee6fb9cf04daf48b48fd542c5e43daa9897763a199aaa4b6f10546109f47ac3564fade0',
			'13ed795344c4448a3b256f23665336645a853c5c44dbff6db1b9224b5303b6447fbf8240a2249c55',
			'a2704638434e9f7340f22d08019c4c8e3dbee0df8dd4454a1d70844de11694f4c8ca67fdcb08fed0cec9abb2112b5e5f89',
			'd2488e854dbcdfdb2c9d16c8c0b2fdbc0abb6bac991bfe2b14d359a6bc99d66c00fd60d731ae06d0'
		];
		const Expected_Signatures = [
			'C9B1342EAB27E906567586803DA265CC15CCACA411E0AEF44508595ACBC47600D02527F2EED9AB3F28C856D27E30C3808AF7F22F5F243DE698182D373A9ADE03',
			'0755E437ED4C8DD66F1EC29F581F6906AB1E98704ECA94B428A25937DF00EC64796F08E5FEF30C6F6C57E4A5FB4C811D617FA661EB6958D55DAE66DDED205501',
			'15D6585A2A456E90E89E8774E9D12FE01A6ACFE09936EE41271AA1FBE0551264A9FF9329CB6FEE6AE034238C8A91522A6258361D48C5E70A41C1F1C51F55330D',
			'F6FB0D8448FEC0605CF74CFFCC7B7AE8D31D403BCA26F7BD21CB4AC87B00769E9CC7465A601ED28CDF08920C73C583E69D621BA2E45266B86B5FCF8165CBE309',
			'E88D8C32FE165D34B775F70657B96D8229FFA9C783E61198A6F3CCB92F487982D08F8B16AB9157E2EFC3B78F126088F585E26055741A9F25127AC13E883C9A05'
		];

		function assertCanSignTestVectors(dataTransform) {
			// Sanity:
			expect(Private_Keys.length).equal(Input_Data.length);
			expect(Private_Keys.length).equal(Expected_Signatures.length);

			for (let i = 0; i < Private_Keys.length; ++i) {
				// Arrange:
				const inputData = dataTransform(Input_Data[i]);
				const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[i]);

				// Act:
				const signature = KeyPair.sign(keyPair, inputData);

				// Assert:
				const message = `signing with ${Private_Keys[i]}`;
				expect(convert.uint8ToHex(signature), message).equal(Expected_Signatures[i]);
			}
		}

		it('can sign test vectors as hex string', () => {
			// Assert:
			assertCanSignTestVectors(data => data);
		});

		it('can sign test vectors as binary', () => {
			// Assert:
			assertCanSignTestVectors(data => convert.hexToUint8(data));
		});

		function assertCanVerifyTestVectors(dataTransform) {
			// Sanity:
			expect(Private_Keys.length).equal(Input_Data.length);
			expect(Private_Keys.length).equal(Expected_Signatures.length);

			for (let i = 0; i < Private_Keys.length; ++i) {
				// Arrange:
				const inputData = dataTransform(Input_Data[i]);
				const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[i]);
				const signature = KeyPair.sign(keyPair, inputData);

				// Act:
				const isVerified = KeyPair.verify(keyPair.publicKey, inputData, signature);

				// Assert:
				const message = `verifying with ${Private_Keys[i]}`;
				expect(isVerified, message).equal(true);
			}
		}

		it('can verify test vectors as hex string', () => {
			// Assert:
			assertCanVerifyTestVectors(data => data);
		});

		it('can verify test vectors as binary', () => {
			// Assert:
			assertCanVerifyTestVectors(data => convert.hexToUint8(data));
		});
	});

	describe('derive shared key', () => {
		const Salt_Size = 32;

		it('fails if salt is wrong size', () => {
			// Arrange: create a salt that is too long
			const keyPair = test.default.random.keyPair();
			const publicKey = test.default.random.publicKey();
			const salt = test.default.random.bytes(Salt_Size + 1);

			// Act:
			expect(() => {
				KeyPair.deriveSharedKey(keyPair, publicKey, salt);
			})
				.to.throw('salt has unexpected size');
		});

		it('derives same shared key for both partners', () => {
			// Arrange:
			const keyPair1 = test.default.random.keyPair();
			const keyPair2 = test.default.random.keyPair();
			const salt = test.default.random.bytes(Salt_Size);

			// Act:
			const sharedKey1 = KeyPair.deriveSharedKey(keyPair1, keyPair2.publicKey, salt);
			const sharedKey2 = KeyPair.deriveSharedKey(keyPair2, keyPair1.publicKey, salt);

			// Assert:
			expect(sharedKey1).to.deep.equal(sharedKey2);
		});

		it('derives different shared keys for different partners', () => {
			// Arrange:
			const keyPair = test.default.random.keyPair();
			const publicKey1 = test.default.random.publicKey();
			const publicKey2 = test.default.random.publicKey();
			const salt = test.default.random.bytes(Salt_Size);

			// Act:
			const sharedKey1 = KeyPair.deriveSharedKey(keyPair, publicKey1, salt);
			const sharedKey2 = KeyPair.deriveSharedKey(keyPair, publicKey2, salt);

			// Assert:
			expect(sharedKey1).to.not.deep.equal(sharedKey2);
		});

		it('can derive deterministic shared key from well known inputs', () => {
			// Arrange:
			const privateKey = convert.hexToUint8('8F545C2816788AB41D352F236D80DBBCBC34705B5F902EFF1F1D88327C7C1300');
			const publicKey = convert.hexToUint8('BF684FB1A85A8C8091EE0442EDDB22E51683802AFA0C0E7C6FE3F3E3E87A8D72');
			const salt = convert.hexToUint8('422C39DF16AAE42A74A5597D6EE2D59CFB4EEB6B3F26D98425B9163A03DAA3B5');

			// Act:
			const sharedKey = KeyPair.deriveSharedKey({ privateKey }, publicKey, salt);

			// Assert:
			expect(convert.uint8ToHex(sharedKey)).to.equal('FF9623D28FBC13B6F0E0659117FC7BE294DB3385C046055A6BAC39EDF198D50D');
		});
	});
});
