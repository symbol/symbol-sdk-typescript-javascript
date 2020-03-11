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

import {NetworkType} from '../../../src/model/network/NetworkType';
import {SignedTransaction} from '../../../src/model/transaction/SignedTransaction';
import {TransactionType} from '../../../src/model/transaction/TransactionType';

describe('SignedTransaction', () => {
    const hash = '8498B38D89C1DC8A448EA5824938FF828926CD9F7747B1844B59B4B6807E878B';
    const publicKey = '5D58EC16F07BF00BDE9B040E7451A37F9908C59E143A01438C04345D8E9DDF39';

    it('should return transfer transaction type', () => {
        const signedTransaction = new SignedTransaction(
            '9700000037FB5DD4291F2D1343B31E31D88A4392C8987BA76B329A273F51AE74E99' +
            '554135DFE270D44EA8452E3E6075C6B898C26DD753D169452A115D96F6A4D7562C9' +
            '0CC2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE0' +
            '39054410000000000000000B098B7C00D000000900D8D3E65BF27ABE158BCD37C0A' +
            '708BF6524A07EB09046A30030000004869',
            '07901DA8A8AFE1DFB76D1A079B8E785C1186BAF2C5B98227B62BDE2C77D79481',
            'C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE',
            TransactionType.TRANSFER,
            NetworkType.MIJIN_TEST,
        );
        expect(signedTransaction.type).to.be.equal(TransactionType.TRANSFER);
    });

    it('should return aggregate transaction type', () => {
        const signedTransaction = new SignedTransaction(
            'C3000000E854AA7D4466D66A7045F858F6D43022B7C72524B79A6D519431EEAC' +
            'CD020608B4672BB9B74168DAB04B55135F528187FB93E7AE6FAFB59A01C96F218' +
            '0216308C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB' +
            '402EFE0290414100000000000000001FBFBDC00D0000004700000047000000C2F' +
            '93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE0390' +
            '5441900D8D3E65BF27ABE158BCD37C0A708BF6524A07EB09046A30030000004869',
            '231AA7700DC158CFC85606E0E2AC80F409923C6F3A845577C7D8D7A51A99E883',
            'C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE',
            TransactionType.AGGREGATE_COMPLETE,
            NetworkType.MIJIN_TEST,
        );
        expect(signedTransaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
    });

    [
        '',
        '8498B38D89C1DC8A448EA5824938FF828926CD9F7747B1844B59B4B6807E878',
        '8498B38D89C1DC8A448EA5824938FF828926CD9F7747B1844B59B4B6807E878BB',
    ].forEach((item) => {
        it('throws exception if string hasn\'t 64 character long', () => {
            expect(() => {
                new SignedTransaction('', item, publicKey, TransactionType.AGGREGATE_BONDED, NetworkType.MIJIN_TEST);
            }).to.throw(Error);
        });
    });
});
