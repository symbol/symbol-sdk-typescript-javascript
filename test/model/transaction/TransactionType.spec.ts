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
import {TransactionType} from '../../../src/model/transaction/TransactionType';

describe('TransactionType', () => {
    it('Should match the specification', () => {
        expect(TransactionType.TRANSFER).to.be.equal(0x4154);
        expect(TransactionType.REGISTER_NAMESPACE).to.be.equal(0x414e);
        expect(TransactionType.MOSAIC_DEFINITION).to.be.equal(0x414d);
        expect(TransactionType.MOSAIC_SUPPLY_CHANGE).to.be.equal(0x424d);
        expect(TransactionType.MODIFY_MULTISIG_ACCOUNT).to.be.equal(0x4155);
        expect(TransactionType.AGGREGATE_COMPLETE).to.be.equal(0x4141);
        expect(TransactionType.AGGREGATE_BONDED).to.be.equal(0x4241);
        expect(TransactionType.AGGREGATE_BONDED).to.be.equal(0x4241);
        expect(TransactionType.LOCK).to.be.equal(0x414C);
        expect(TransactionType.SECRET_LOCK).to.be.equal(0x424C);
        expect(TransactionType.SECRET_PROOF).to.be.equal(0x434C);
    });
});
