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
import {crypto} from '../../../src/core/crypto/crypto';

describe('crypto test', () => {

    it('Can derive a key from password and count', () => {
        // Arrange:
        const  password = 'TestTest';
        const  count = 20;
        const  expectedKey = '8cd87bc513857a7079d182a6e19b370e907107d97bd3f81a85bcebcc4b5bd3b5';

        // Act:
        const  result = crypto.derivePassSha(password, count);

        // Assert:
        expect(result.priv).equal(expectedKey);
    });
});
