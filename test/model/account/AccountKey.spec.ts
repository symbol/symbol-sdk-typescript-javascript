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
import { AccountLinkPublicKey } from '../../../src/model/account/AccountLinkPublicKey';
import { AccountLinkVotingKey } from '../../../src/model/account/AccountLinkVotingKey';
import { UInt64 } from '../../../src/model/UInt64';
import { SupplementalPublicKeys } from '../../../src/model/account/SupplementalPublicKeys';

describe('AccountLinkPublicKey', () => {
    it('should createComplete an AccountLinkPublicKey object', () => {
        const accountKey = new AccountLinkPublicKey('abc');
        expect(accountKey.publicKey).to.be.equal('abc');
    });
});

describe('AccountLinkVotingKey', () => {
    it('should createComplete an AccountLinkVotingKey object', () => {
        const accountKey = new AccountLinkVotingKey('abc', UInt64.fromUint(1), UInt64.fromUint(3));
        expect(accountKey.publicKey).to.be.equal('abc');
        expect(accountKey.startPoint.toString()).to.be.equal('1');
        expect(accountKey.endPoint.toString()).to.be.equal('3');
    });
});

describe('SupplementalPublicKeys', () => {
    it('should createComplete an SupplementalPublicKeys object', () => {
        let accountKey = new SupplementalPublicKeys();
        expect(accountKey.voting).to.be.undefined;
        expect(accountKey.node).to.be.undefined;
        expect(accountKey.vrf).to.be.undefined;
        expect(accountKey.linked).to.be.undefined;

        accountKey = new SupplementalPublicKeys(new AccountLinkPublicKey('abc'));
        expect(accountKey.voting).to.be.undefined;
        expect(accountKey.node).to.be.undefined;
        expect(accountKey.vrf).to.be.undefined;
        expect(accountKey.linked?.publicKey).to.be.eq('abc');

        accountKey = new SupplementalPublicKeys(undefined, new AccountLinkPublicKey('abc'));
        expect(accountKey.voting).to.be.undefined;
        expect(accountKey.node?.publicKey).to.be.eq('abc');
        expect(accountKey.vrf).to.be.undefined;
        expect(accountKey.linked).to.be.undefined;

        accountKey = new SupplementalPublicKeys(undefined, undefined, new AccountLinkPublicKey('abc'));
        expect(accountKey.voting).to.be.undefined;
        expect(accountKey.node).to.be.undefined;
        expect(accountKey.vrf?.publicKey).to.be.eq('abc');
        expect(accountKey.linked).to.be.undefined;

        accountKey = new SupplementalPublicKeys(undefined, undefined, undefined, [
            new AccountLinkVotingKey('abc', UInt64.fromUint(1), UInt64.fromUint(3)),
        ]);
        expect(accountKey.voting).not.to.be.undefined;
        expect(accountKey.voting![0].publicKey).to.be.eq('abc');
        expect(accountKey.voting![0].startPoint.toString()).to.be.eq('1');
        expect(accountKey.voting![0].endPoint.toString()).to.be.eq('3');
        expect(accountKey.node).to.be.undefined;
        expect(accountKey.vrf).to.be.undefined;
        expect(accountKey.linked).to.be.undefined;
    });
});
