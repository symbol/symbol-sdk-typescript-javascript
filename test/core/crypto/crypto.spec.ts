/*
 * Copyright 2020 NEM
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
import { Crypto } from '../../../src/core/crypto';
import { KeyPair } from '../../../src/core/crypto/KeyPair';
import { Convert, Convert as convert } from '../../../src/core/format';

describe('crypto tests', () => {
    it('Can encode and decode message', () => {
        const sender = KeyPair.createKeyPairFromPrivateKeyString('E1C8521608F4896CA26A0C2DE739310EA4B06861D126CF4D6922064678A1969B');
        const recipient = KeyPair.createKeyPairFromPrivateKeyString('A22A4BBF126A2D7D7ECE823174DFD184C5DE0FDE4CB2075D30CFA409F7EF8908');
        const message = 'NEM is awesome !';
        const encryptedMessage = Crypto.encode(Convert.uint8ToHex(sender.privateKey), Convert.uint8ToHex(recipient.publicKey), message);
        const expectedMessage = 'NEM is awesome !';
        const decrypted = Crypto.decode(Convert.uint8ToHex(recipient.privateKey), Convert.uint8ToHex(sender.publicKey), encryptedMessage);

        expect(decrypted).equal(convert.utf8ToHex(expectedMessage));
    });

    it('Can encode a message and failed decode with wrong key', () => {
        const sender = KeyPair.createKeyPairFromPrivateKeyString('E1C8521608F4896CA26A0C2DE739310EA4B06861D126CF4D6922064678A1969B');
        const recipient = KeyPair.createKeyPairFromPrivateKeyString('A22A4BBF126A2D7D7ECE823174DFD184C5DE0FDE4CB2075D30CFA409F7EF8908');
        const message = 'NEM is awesome !';
        const encryptedMessage = Crypto.encode(Convert.uint8ToHex(sender.privateKey), Convert.uint8ToHex(recipient.publicKey), message);
        const senderPublic = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const recipientPriv = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const expectedMessage = 'NEM is awesome !';
        const decrypted = Crypto.decode(recipientPriv, senderPublic, encryptedMessage);

        expect(decrypted).not.equal(convert.utf8ToHex(expectedMessage));
    });

    describe('Encode & decode message edge-cases', () => {
        it('Message encoding throw error if no sender private key', () => {
            // Arrange:
            const senderPriv = '';
            const recipientPublic = '2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9';
            const message = 'NEM is awesome !';

            // Act:
            const result = Crypto.encode.bind(null, senderPriv, recipientPublic, message);

            // Assert:
            expect(result).to.throw();
        });

        it('Message encoding throw error if no recipient public key', () => {
            // Arrange:
            const senderPriv = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';
            const recipientPublic = '';
            const message = 'NEM is awesome !';

            // Act:
            const result = Crypto.encode.bind(null, senderPriv, recipientPublic, message);

            // Assert:
            expect(result).to.throw();
        });

        it('Message encoding throw error if no message', () => {
            // Arrange:
            const senderPriv = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';
            const recipientPublic = '2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9';
            const message = '';

            // Act:
            const result = Crypto.encode.bind(null, senderPriv, recipientPublic, message);

            // Assert:
            expect(result).to.throw();
        });

        it('Message decoding throw error if no recipient private key', () => {
            // Arrange:
            const senderPublic = '9291abb3c52134be9d20ef21a796743497df7776d2661237bda9cadade34e44c';
            const recipientPriv = '';
            const encryptedMessage =
                'dd31d6b4111c1023bae6533399e74f73a29c6e6b48ab550f8a7bea127e27ddd' +
                'b4fd3fe4fad3c835307c0da52d9c268f56237d1810e07912e6a6568cba09d9a9176ee6b1ade9569c2e1e273e9675bd4ff';

            // Act:
            const result = Crypto.decode.bind(null, recipientPriv, senderPublic, encryptedMessage);

            // Assert:
            expect(result).to.throw();
        });

        it('Message decoding throw error if no sender public key', () => {
            // Arrange:
            const senderPublic = '';
            const recipientPriv = '2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9';
            const encryptedMessage =
                'dd31d6b4111c1023bae6533399e74f73a29c6e6b48ab550f8a7bea127e27ddd' +
                'b4fd3fe4fad3c835307c0da52d9c268f56237d1810e07912e6a6568cba09d9a9176ee6b1ade9569c2e1e273e9675bd4ff';

            // Act:
            const result = Crypto.decode.bind(null, recipientPriv, senderPublic, encryptedMessage);

            // Assert:
            expect(result).to.throw();
        });

        it('Message decoding throw error if no payload', () => {
            // Arrange:
            const senderPublic = '9291abb3c52134be9d20ef21a796743497df7776d2661237bda9cadade34e44c';
            const recipientPriv = '2618090794e9c9682f2ac6504369a2f4fb9fe7ee7746f9560aca228d355b1cb9';
            const encryptedMessage = '';

            // Act:
            const result = Crypto.decode.bind(null, recipientPriv, senderPublic, encryptedMessage);

            // Assert:
            expect(result).to.throw();
        });
    });

    /**
     * @see https://github.com/nemtech/test-vectors/blob/master/4.test-cipher.json
     */
    describe('test vector cipher', () => {
        it('test vector cipher', () => {
            // Arrange:
            const Private_Key = '3140f94c79f249787d1ec75a97a885980eb8f0a7d9b7aa03e7200296e422b2b6';

            const Public_Keys = 'C62827148875ACAF05D25D29B1BB1D947396A89CE41CB48888AE6961D9991DDF';

            const ivs = [
                'a73ff5c32f8fd055b09775817a6a3f95',
                '91246c2d5493867c4fa3e78f85963677',
                '9f8e33d82374dad6aac0e3dbe7aea704',
                '6acdf8e01acc8074ddc807281b6af888',
                'f2e9f18aeb374965f54d2f4e31189a8f',
            ];

            const cipherText = [
                'EEF67A32E1FE96AF1401DF42DD356A1CAEC5B6B36576357C22232049D174F63E',
                'F94355BEF2CBF73E06AF2FF57BB8D72D7090062379062B60E8EF37EA858D8FF4',
                '18FF3AB60B01D5D39CFDD50ADDE0F49ECAEE4355B224D0D8A0607455A3DFA823',
                'E64795B1B980A6101E9C12824FAA5A4DFC1467F767AA3DC5A990F3A28692A1FA',
                '17817662A9B61AF1E9C6F3D7C1D02CAAACEA586E4BD777A68C0765D5231619F3',
            ];

            const clearText = [
                '86ddb9e713a8ebf67a51830eff03b837e147c20d75e67b2a54aa29e98c',
                '86ddb9e713a8ebf67a51830eff03b837e147c20d75e67b2a54aa29e98c',
                '86ddb9e713a8ebf67a51830eff03b837e147c20d75e67b2a54aa29e98c',
                '86ddb9e713a8ebf67a51830eff03b837e147c20d75e67b2a54aa29e98c',
                '86ddb9e713a8ebf67a51830eff03b837e147c20d75e67b2a54aa29e98c',
            ];

            for (let i = 0; i < ivs.length; ++i) {
                // Arrange:
                const iv = Convert.hexToUint8(ivs[i]);

                // Act:
                const encoded = Crypto._encode(Private_Key, Public_Keys, clearText[i], iv);
                // Assert:
                expect(encoded.toUpperCase()).to.deep.equal(ivs[i].toUpperCase() + cipherText[i].toUpperCase());
            }
        });
    });

    describe('AES Encryption', () => {
        const cipher1 = Crypto.encrypt('a', 'password');
        const cipher2 = Crypto.encrypt('a', 'password');
        const knownPass = 'password';
        const knownValue = '987654321';
        const knownCipher = '9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ==';

        it('encrypt() should generate distinct values always', () => {
            expect(cipher1 === cipher2).to.equal(false);
        });

        it('decrypt() should return value given valid ciphertext and password', () => {
            const plain = Crypto.decrypt(knownCipher, knownPass);
            expect(plain.length).to.equal(knownValue.length);
            expect(plain).to.equal(knownValue);
        });

        it('decrypt() should return empty given invalid ciphertext', () => {
            const cipher = '+QgfP/KHmUl+wk7rPwmEQ=='; // invalid ciphertext
            const plain = Crypto.decrypt(cipher, knownPass);
            expect(plain.length).to.equal(0);
            expect(plain).to.equal('');
        });

        it('decrypt() should return empty given invalid password', () => {
            const plain = Crypto.decrypt(knownCipher, 'password1'); // invalid password
            expect(plain.length).to.equal(0);
            expect(plain).to.equal('');
        });

        it('decrypt() should accept ciphertext given encrypt', () => {
            const data = ['encrypt', 'this'];

            data.map((word: string) => {
                const pw = '1234567a';
                const cipher = Crypto.encrypt(word, pw);
                const plain = Crypto.decrypt(cipher, pw);
                expect(plain).to.equal(word);
            });
        });
    });
});
