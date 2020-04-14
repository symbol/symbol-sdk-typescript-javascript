/*
 * Copyright 2019 NEM
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
import { WalletAlgorithm } from '../../../src/model/wallet/WalletAlgorithm';

import CryptoJS = require('crypto-js');
describe('crypto tests', () => {
    it('Can derive a key from password and count', () => {
        // Arrange:
        const password = 'TestTest';
        const count = 20;
        const expectedKey = '8cd87bc513857a7079d182a6e19b370e907107d97bd3f81a85bcebcc4b5bd3b5';

        // Act:
        const result = Crypto.derivePassSha(password, count);

        // Assert:
        expect(result.priv).equal(expectedKey);
    });

    it('Can encrypt a private key', () => {
        // Arrange:
        const password = 'TestTest';
        const privateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';
        const expectedKey = '8cd87bc513857a7079d182a6e19b370e907107d97bd3f81a85bcebcc4b5bd3b5';

        // Act:
        const result = Crypto.encodePrivateKey(privateKey, password);
        const pass = Crypto.derivePassSha(password, 20);

        // Assert:
        expect(pass.priv).equal(expectedKey);
        expect(result.iv.length).equal(16 * 2);
        expect(result.ciphertext.length).equal(48 * 2);
    });

    it('Can decrypt a private key', () => {
        // Arrange:
        const expectedPrivateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';
        const key = '8cd87bc513857a7079d182a6e19b370e907107d97bd3f81a85bcebcc4b5bd3b5';
        const encrypted = 'c09ef3ed0cadd6ca6d3638b5dd854ac871a0afaec6b7fed791166b571a64d57f564376dc0180c851b0a1120b5896e6a0';
        const iv = '0329814121c7a4bb11418084dbe40560';
        const obj = {
            ciphertext: CryptoJS.enc.Hex.parse(encrypted),
            iv: convert.hexToUint8(iv),
            key: convert.hexToUint8(key),
        };

        // Act:
        const decrypted = Crypto.decrypt(obj);

        // Assert:
        expect(decrypted).equal(expectedPrivateKey);
    });

    it('Can encrypt and decrypt private Key', () => {
        // Arrange:
        const password = 'TestTest';
        const privateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';

        // Act:
        const result = Crypto.encodePrivateKey(privateKey, password);
        const pass = Crypto.derivePassSha(password, 20);
        const obj = {
            ciphertext: CryptoJS.enc.Hex.parse(result.ciphertext),
            iv: convert.hexToUint8(result.iv),
            key: convert.hexToUint8(pass.priv),
        };
        const decrypted = Crypto.decrypt(obj);

        // Assert:
        expect(privateKey).equal(decrypted);
    });

    describe('Encrypt private key edge-cases', () => {
        it('Encryption throw error if no password', () => {
            // Arrange:
            const password = '';
            const privateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';

            // Act:
            const result = Crypto.encodePrivateKey.bind(null, privateKey, password);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });

        it('Encryption throw error if no private key', () => {
            // Arrange:
            const password = 'TestTest';
            const privateKey = '';

            // Act
            const result = Crypto.encodePrivateKey.bind(null, privateKey, password);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });
    });

    it('Can decrypt private key of pass:enc wallets', () => {
        // Arrange:
        const common = {
            password: 'TestTest',
            privateKey: '',
        };
        const walletAccount = {
            encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
            iv: 'dccffaa4883cda85d6b06714aabe6ec6',
        };
        const mainAlgo = WalletAlgorithm.Pass_enc;
        const expectedPrivateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';

        // Act:
        const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

        // Assert:
        expect(result).equal(true);
        expect(common.privateKey).equal(expectedPrivateKey);
    });

    it('Can decrypt private key of pass:bip32 wallets', () => {
        // Arrange:
        const common = {
            password: 'TestTest',
            privateKey: '',
        };
        const walletAccount = {
            encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
            iv: 'dccffaa4883cda85d6b06714aabe6ec6',
        };
        const mainAlgo = WalletAlgorithm.Pass_bip32;
        const expectedPrivateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';

        // Act:
        const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

        // Assert:
        expect(result).equal(true);
        expect(common.privateKey).equal(expectedPrivateKey);
    });

    it('Can decrypt private key of pass:6k wallets', () => {
        // Arrange:
        const common = {
            password: 'TestTest',
            privateKey: '',
        };
        const walletAccount = {
            encrypted: '',
            iv: '',
        };
        const mainAlgo = WalletAlgorithm.Pass_6k;
        const expectedPrivateKey = '8fac70ea9aca3ae3418e25c0d31d9a0723e0a1790ae8fa97747c00dc0037472e';

        // Act:
        const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

        // Assert:
        expect(result).equal(true);
        expect(common.privateKey).equal(expectedPrivateKey);
    });

    it('Can decrypt private key of pass:6k wallets childs', () => {
        // Arrange:
        const common = {
            password: 'TestTest',
            privateKey: '',
        };
        const walletAccount = {
            encrypted: '5c3a7ebbefb391e5175a29ec5a22cb162cd590bb2e0b09416273f86bdc39fa83c04c4bb53b9c64fd1e6eaba5dba149bd',
            iv: 'f131d9a4dfb1b0b696e05ccae9412e8f',
        };
        const mainAlgo = WalletAlgorithm.Pass_6k;
        const expectedPrivateKey = '4f27ca43521bbc394a6f6dde65b533e0768f954fa47ce320b0e9f4b5fe450f9d';

        // Act:
        const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

        // Assert:
        expect(result).equal(true);
        expect(common.privateKey).equal(expectedPrivateKey);
    });

    describe('Decrypt private key edge-cases', () => {
        it('Private key decryption throw error if no algo', () => {
            // Arrange:
            const common = {
                password: 'TestTest',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
                iv: 'dccffaa4883cda85d6b06714aabe6ec6',
            };
            const mainAlgo = '';

            // Act:
            const result = Crypto.passwordToPrivateKey.bind(null, common, walletAccount, mainAlgo);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });

        it('Decryption of pass:enc wallets thow error if no password', () => {
            // Arrange:
            const common = {
                password: '',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
                iv: 'dccffaa4883cda85d6b06714aabe6ec6',
            };
            const mainAlgo = WalletAlgorithm.Pass_enc;

            // Act:
            const result = Crypto.passwordToPrivateKey.bind(null, common, walletAccount, mainAlgo);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });

        it('Decryption of pass:bip32 wallets throw error if no password', () => {
            // Arrange:
            const common = {
                password: '',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
                iv: 'dccffaa4883cda85d6b06714aabe6ec6',
            };
            const mainAlgo = WalletAlgorithm.Pass_bip32;

            // Act:
            const result = Crypto.passwordToPrivateKey.bind(null, common, walletAccount, mainAlgo);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });

        it('Decryption of pass:6k wallets throw error if no password', () => {
            // Arrange:
            const common = {
                password: '',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
                iv: 'dccffaa4883cda85d6b06714aabe6ec6',
            };
            const mainAlgo = WalletAlgorithm.Pass_6k;

            // Act:
            const result = Crypto.passwordToPrivateKey.bind(null, common, walletAccount, mainAlgo);

            // Assert:
            expect(result).to.throw('Missing argument !');
        });

        it('Decryption of pass:6k wallets generate a private key if no encrypted and iv in wallet account', () => {
            // Arrange:
            const common = {
                password: 'TestTest',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '',
                iv: '',
            };
            const mainAlgo = WalletAlgorithm.Pass_6k;
            const expectedPrivateKey = '8fac70ea9aca3ae3418e25c0d31d9a0723e0a1790ae8fa97747c00dc0037472e';

            // Act:
            const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

            // Assert:
            expect(result).equal(true);
            expect(common.privateKey).equal(expectedPrivateKey);
        });

        it('Decryption of pass:6k wallets return false if encrypted data but no iv', () => {
            // Arrange:
            const common = {
                password: 'TestTest',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '2e1717f245b7e1138b0dfe99dfce65b16b1c9d8ca03a9f90b86b43677b6337ce56ec474c64f73244790eb2490ad14752',
                iv: '',
            };
            const mainAlgo = WalletAlgorithm.Pass_6k;

            // Act:
            const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

            // Assert:
            expect(result).equal(false);
            expect(common.privateKey).equal('');
        });

        it('Decryption of pass:6k wallets return false if no encrypted data but iv', () => {
            // Arrange:
            const common = {
                password: 'TestTest',
                privateKey: '',
            };
            const walletAccount = {
                encrypted: '',
                iv: 'dccffaa4883cda85d6b06714aabe6ec6',
            };
            const mainAlgo = WalletAlgorithm.Pass_6k;

            // Act:
            const result = Crypto.passwordToPrivateKey(common, walletAccount, mainAlgo);

            // Assert:
            expect(result).equal(false);
            expect(common.privateKey).equal('');
        });
    });

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
            const message = 'NEM is awesome !';
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
            const message = 'NEM is awesome !';
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
            const message = 'NEM is awesome !';
            const encryptedMessage = '';

            // Act:
            const result = Crypto.decode.bind(null, recipientPriv, senderPublic, encryptedMessage);

            // Assert:
            expect(result).to.throw();
        });
    });

    it('Can encrypt and decrypt private key for mobile', () => {
        // Arrange:
        const privateKey = '2a91e1d5c110a8d0105aad4683f962c2a56663a3cad46666b16d243174673d90';
        const password = 'TestTest';

        // Act:
        const result = Crypto.toMobileKey(password, privateKey);
        const encrypted = result.encrypted;
        const salt = CryptoJS.enc.Hex.parse(result.salt);

        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 2000,
        });

        const iv = encrypted.substring(0, 32);
        const encryptedPrvKey = encrypted.substring(32, 128);

        const obj = {
            ciphertext: CryptoJS.enc.Hex.parse(encryptedPrvKey),
            iv: convert.hexToUint8(iv),
            key: convert.hexToUint8(key.toString()),
        };

        const decrypted = Crypto.decrypt(obj);

        // Assert:
        expect(encrypted.length).equal(128);
        expect(salt.toString().length).equal(32 * 2);
        expect(decrypted).equal(privateKey);
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
});
