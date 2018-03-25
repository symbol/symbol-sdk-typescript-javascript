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
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashType} from '../../../src/model/transaction/HashType';
import {SecretProofTransaction} from '../../../src/model/transaction/SecretProofTransaction';

describe('SecretProofTransaction', () => {

    it('should be created', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7680ADA57DCEC8EEE91C' +
            '4E3BF3BFA9AF6FFDE90CD1D249D1C6121D7B759A001B1';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.SHA3_512,
            sha3_512.create().update(convert.hexToUint8(proof)).hex(),
            proof,
            NetworkType.MIJIN_TEST,
        );
        expect(secretProofTransaction.hashType).to.be.equal(0);
        expect(secretProofTransaction.secret).to.be.equal('d23859866f93f2698a5b48586543c608d85a57c74e9ce92d86a0b25065d8' +
            '155c16754d840026b8c536f2bcb963a7d867f034ec241b87162ac33daf7b707cb5f7');
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7680ADA57DCEC8EEE91C' +
                '4E3BF3BFA9AF6FFDE90CD1D249D1C6121D7B759A001B1';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.SHA3_512,
                'non valid hash',
                proof,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
});
