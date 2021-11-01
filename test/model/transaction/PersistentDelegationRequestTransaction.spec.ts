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
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MessageMarker } from '../../../src/model/message/MessageMarker';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PersistentDelegationRequestTransaction } from '../../../src/model/transaction/PersistentDelegationRequestTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('PersistentDelegationRequestTransaction', () => {
    let account: Account;
    const delegatedPrivateKey = '8A78C9E9B0E59D0F74C0D47AB29FBD523C706293A3FA9CD9FE0EEB2C10EA924A';
    const vrfPrivateKey = '800F35F1CC66C2B62CE9DD9F31003B9B3E5C7A2F381FB8952A294277A1015D83';
    const recipientPublicKey = '9DBF67474D6E1F8B131B4EB1F5BA0595AFFAE1123607BC1048F342193D7E669F';
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const messageMarker = MessageMarker.PersistentDelegationUnlock;
    const epochAdjustment = 1573430400;

    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
            Deadline.create(epochAdjustment),
            delegatedPrivateKey,
            vrfPrivateKey,
            recipientPublicKey,
            NetworkType.TEST_NET,
        );

        expect(persistentDelegationRequestTransaction.maxFee.higher).to.be.equal(0);
        expect(persistentDelegationRequestTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
            Deadline.create(epochAdjustment),
            delegatedPrivateKey,
            vrfPrivateKey,
            recipientPublicKey,
            NetworkType.TEST_NET,
            new UInt64([1, 0]),
        );

        expect(persistentDelegationRequestTransaction.maxFee.higher).to.be.equal(0);
        expect(persistentDelegationRequestTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an persistentDelegationRequestTransaction object and sign it', () => {
        const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
            Deadline.create(epochAdjustment),
            delegatedPrivateKey,
            vrfPrivateKey,
            recipientPublicKey,
            NetworkType.TEST_NET,
        );

        expect(persistentDelegationRequestTransaction.message.payload.length).to.be.equal(248 + messageMarker.length);
        expect(persistentDelegationRequestTransaction.message.payload.includes(messageMarker)).to.be.true;
        expect(persistentDelegationRequestTransaction.mosaics.length).to.be.equal(0);
        expect(persistentDelegationRequestTransaction.recipientAddress).to.be.instanceof(Address);
        expect((persistentDelegationRequestTransaction.recipientAddress as Address).plain()).to.be.equal(
            'TDBC4JE7GTJAKN2XJCQWWRJMYA35AFOYQB5BQMY',
        );

        const signedTransaction = persistentDelegationRequestTransaction.signWith(account, generationHash);

        expect(
            signedTransaction.payload
                .substring(256, signedTransaction.payload.length)
                .includes(persistentDelegationRequestTransaction.message.payload),
        ).to.be.true;
    });

    it('should throw exception with invalid harvester publicKey (message)', () => {
        expect(() => {
            PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(epochAdjustment),
                'abc',
                vrfPrivateKey,
                recipientPublicKey,
                NetworkType.TEST_NET,
                new UInt64([1, 0]),
            );
        }).to.throw();
    });
});
