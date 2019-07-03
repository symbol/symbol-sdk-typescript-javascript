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
import { SignSchema } from '../../../src/core/crypto';
import { Convert } from '../../../src/core/format/Convert';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { Account } from '../../../src/model/account/Account';

describe('PublicAccount', () => {
    const publicKey = 'b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf';

    it('should createComplete a public account from public key', () => {
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(publicAccount.publicKey).to.be.equal(publicKey);
        expect(publicAccount.address.plain()).to.be.equal('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP');
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    it('should createComplete a public account from public key using NIS1', () => {
        const publicAccount = PublicAccount.createFromPublicKey('c5f54ba980fcbb657dbaaa42700539b207873e134d2375efeab5f1ab52f87844',
            NetworkType.MIJIN, SignSchema.KECCAK_REVERSED_KEY);
        expect(publicAccount.address.plain()).to.be.equal('MDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5LDT7JHT');
    });
});

describe('Signature verification', () => {
    it('Can verify a signature', () => {
        // Arrange:'
        const signerPublicAccount = PublicAccount.createFromPublicKey(
            '1464953393CE96A08ABA6184601FD08864E910696B060FF7064474726E666CA8',
            NetworkType.MIJIN_TEST);
        const data = 'I am so so so awesome as always';
        const signature = '2092660F5BD4AE832B2E290F34A76B41506EE473B02FD7FD468B32C80C945CF60A0D60D005FA9B2DB3AD3212F8028C1449D3DCF81C9FAB3EB4975A7409D8D802'; // tslint:disable-line

        // Act & Assert:
        expect(signerPublicAccount.verifySignature(data, signature)).to.be.true;
    });

    it('Verify a signature using NIS1 schema', () => {
        // Arrange:'
        const account = Account.createFromPrivateKey(
            'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
            NetworkType.MIJIN_TEST,
            SignSchema.KECCAK_REVERSED_KEY,
        );
        const publicAccount = account.publicAccount;
        const signed = account.signData('catapult rocks!', SignSchema.KECCAK_REVERSED_KEY);
        expect(publicAccount.verifySignature('catapult rocks!', signed, SignSchema.KECCAK_REVERSED_KEY))
            .to.be.true;
    });

    it('Throw error if signature has invalid length', () => {
        // Arrange:
        const signerPublicAccount = PublicAccount.createFromPublicKey('22816F825B4CACEA334723D51297D8582332D8B875A5829908AAE85831ABB508',
            NetworkType.MIJIN_TEST);
        const data = 'I am so so so awesome as always';
        const signature = 'B01DCA6484026C2ECDF3C822E64DEAAFC15EBCCE337EEE209C28513CB5351CDED8863A8E7B855CD471B55C91FAE611C5486'; // tslint:disable-line

        // Act & Assert:
        expect(() => { signerPublicAccount.verifySignature(data, signature); }).to.throw('Signature length is incorrect');
    });

    it('Throw error if signature is not strictly hexadecimal', () => {
        // Arrange:
        const signerPublicAccount = PublicAccount.createFromPublicKey('22816F825B4CACEA334723D51297D8582332D8B875A5829908AAE85831ABB508',
            NetworkType.MIJIN_TEST);
        const data = 'I am so so so awesome as always';
        const signature = 'B01DCA6484026C2ECDF3C822E64DEAAFC15EBCCE337EEE209C28513CB5351CDED8863A8E7B855CD471B55C91FAE611C548625C9A5916A555A24F72F35a1wwwww';// tslint:disable-line

        // Act & Assert:
        expect(() => { signerPublicAccount.verifySignature(data, signature); })
            .to.throw('Signature must be hexadecimal only');
    });

    it('Return false if wrong public key provided', () => {
        // Arrange:
        const signerPublicAccount = PublicAccount.createFromPublicKey('12816F825B4CACEA334723D51297D8582332D8B875A5829908AAE85831ABB509',
            NetworkType.MIJIN_TEST);
        const data = 'I am so so so awesome as always';
        const signature = 'B01DCA6484026C2ECDF3C822E64DEAAFC15EBCCE337EEE209C28513CB5351CDED8863A8E7B855CD471B55C91FAE611C548625C9A5916A555A24F72F3526FA508';// tslint:disable-line

        // Act & Assert:
        expect(signerPublicAccount.verifySignature(data, signature)).to.be.false;
    });

    it('Return false if data is not corresponding to signature provided', () => {
        // Arrange:
        const signerPublicAccount = PublicAccount.createFromPublicKey('22816F825B4CACEA334723D51297D8582332D8B875A5829908AAE85831ABB508',
            NetworkType.MIJIN_TEST);
        const data = 'I am awesome as always';
        const signature = 'B01DCA6484026C2ECDF3C822E64DEAAFC15EBCCE337EEE209C28513CB5351CDED8863A8E7B855CD471B55C91FAE611C548625C9A5916A555A24F72F3526FA508';// tslint:disable-line

        // Act & Assert:
        expect(signerPublicAccount.verifySignature(data, signature)).to.be.false;
    });

    it('Return false if signature is not corresponding to data provided', () => {
        // Arrange:
        const signerPublicAccount = PublicAccount.createFromPublicKey('22816F825B4CACEA334723D51297D8582332D8B875A5829908AAE85831ABB508',
            NetworkType.MIJIN_TEST);
        const data = 'I am so so so awesome as always';
        const signature = 'A01DCA6484026C2ECDF3C822E64DEAAFC15EBCCE337EEE209C28513CB5351CDED8863A8E7B855CD471B55C91FAE611C548625C9A5916A555A24F72F3526FA509';// tslint:disable-line

        // Act & Assert:
        expect(signerPublicAccount.verifySignature(data, signature)).to.be.false;
    });
});
