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
import { words2ua } from '../../../src/core/crypto/Utilities';
import { Convert } from '../../../src/core/format';

describe('crypto utilities', () => {
    it('words2ua creates an ua from a word array', () => {
        // Arrange:
        const key = '4344645752e57065f814b51713d05810';
        const words = [1128555607, 1390768229, -132860649, 332421136];

        // Act:
        const ua = words2ua(new Uint8Array(16), { words });

        // Assert:
        expect(ua).deep.equal(Convert.hexToUint8(key));
    });
});
