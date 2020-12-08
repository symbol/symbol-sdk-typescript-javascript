/*
 * Copyright 2020 NEM
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
import * as hkdf from 'futoin-hkdf';
import { Convert } from '../../../src/core/format';

describe('hkdf', () => {
    describe('Example tests', () => {
        // This test is used to validate that values are the same in both java and ts implementation.
        const sharedSecret = 'string-or-buffer';
        const hash = 'SHA-256';
        const info = 'catapult';
        const sharedKey = hkdf(sharedSecret, 32, { salt: Buffer.from(new Uint8Array(32)), info, hash });
        expect(Convert.uint8ToHex(sharedKey)).equal('E618ACB2558E1721492E4AE3BED3F4D86F26C2B0CE6AD939943A6A540855D23F');
    });
});
