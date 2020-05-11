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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { AccountKey } from '../../../src/model/account/AccountKey';
import { AccountKeyType } from '../../../src/model/account/AccountKeyType';

describe('AccountKey', () => {
    it('should createComplete an AccountKey object', () => {
        let accountKey = new AccountKey(AccountKeyType.Unset, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.Unset.valueOf());

        accountKey = new AccountKey(AccountKeyType.Linked, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.Linked.valueOf());

        accountKey = new AccountKey(AccountKeyType.Node, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.Node.valueOf());

        accountKey = new AccountKey(AccountKeyType.VRF, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.VRF.valueOf());

        accountKey = new AccountKey(AccountKeyType.Voting, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.Voting.valueOf());

        accountKey = new AccountKey(AccountKeyType.All, 'abc');
        expect(accountKey.key).to.be.equal('abc');
        deepEqual(accountKey.keyType.valueOf(), AccountKeyType.All.valueOf());
    });
});
