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
import {expect} from 'chai';
import {sha3_512} from 'js-sha3';
import {convert} from 'nem2-library';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {XEM} from '../../../src/model/mosaic/XEM';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashType} from '../../../src/model/transaction/HashType';
import {SecretLockTransaction} from '../../../src/model/transaction/SecretLockTransaction';
import {UInt64} from '../../../src/model/UInt64';

describe('SecretLockTransaction', () => {

    it('should be created', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7680ADA57' +
            'DCEC8EEE91C4E3BF3BFA9AF6FFDE90CD1D249D1C6121D7B759A001B1';
        const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            XEM.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.SHA3_512,
            sha3_512.create().update(convert.hexToUint8(proof)).hex(),
            recipient,
            NetworkType.MIJIN_TEST,
        );
        expect(secretLockTransaction.mosaic.id).to.be.equal(XEM.MOSAIC_ID);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(0);
        expect(secretLockTransaction.secret).to.be.equal('d23859866f93f2698a5b48586543c608d85a57c74e9ce92d86a0b25065d' +
            '8155c16754d840026b8c536f2bcb963a7d867f034ec241b87162ac33daf7b707cb5f7');
        expect(secretLockTransaction.recipient).to.be.equal(recipient);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                XEM.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.SHA3_512,
                'non valid hash',
                recipient,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
});
