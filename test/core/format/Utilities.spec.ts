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
import {expect} from 'chai';
import * as utilities from '../../../src/core/format/Utilities';

describe('Char Mapping', () => {
    describe('builder', () => {
        it('initially has empty map', () => {
            // Arrange:
            const builder = utilities.createBuilder();

            // Act:
            const map = builder.map;

            // Assert:
            expect(map).to.deep.equal({});
        });

        it('can add single arbitrary range with zero base', () => {
            // Arrange:
            const builder = utilities.createBuilder();

            // Act:
            builder.addRange('d', 'f', 0);
            const map = builder.map;

            // Assert:
            expect(map).to.deep.equal({
                d: 0,
                e: 1,
                f: 2,
            });
        });

        it('can add single arbitrary range with nonzero base', () => {
            // Arrange:
            const builder = utilities.createBuilder();

            // Act:
            builder.addRange('d', 'f', 17);
            const map = builder.map;

            // Assert:
            expect(map).to.deep.equal({
                d: 17,
                e: 18,
                f: 19,
            });
        });

        it('can add multiple arbitrary ranges', () => {
            // Arrange:
            const builder = utilities.createBuilder();

            // Act:
            builder.addRange('b', 'b', 8);
            builder.addRange('d', 'f', 17);
            builder.addRange('y', 'z', 0);
            const map = builder.map;

            // Assert:
            expect(map).to.deep.equal({
                b: 8,
                d: 17,
                e: 18,
                f: 19,
                y: 0,
                z: 1,
            });
        });

        it('can add multiple arbitrary overlapping ranges', () => {
            // Arrange:
            const builder = utilities.createBuilder();

            // Act:
            builder.addRange('b', 'b', 18);
            builder.addRange('d', 'f', 17);
            builder.addRange('y', 'z', 19);
            const map = builder.map;

            // Assert:
            expect(map).to.deep.equal({
                b: 18,
                d: 17,
                e: 18,
                f: 19,
                y: 19,
                z: 20,
            });
        });
    });
});

describe('Convert', () => {
    describe('tryParseUint', () => {
        function addTryParseSuccessTest(name, str, expectedValue) {
            it(name, () => {
                // Act:
                const value = utilities.tryParseUint(str);

                // Assert:
                expect(value).to.equal(expectedValue);
            });
        }

        addTryParseSuccessTest('can parse decimal string', '14952', 14952);
        addTryParseSuccessTest('can parse zero decimal string', '0', 0);
        addTryParseSuccessTest('can parse decimal string with all digits', '1234567890', 1234567890);
        addTryParseSuccessTest('can parse decimal string with zeros', '10002', 10002);
        addTryParseSuccessTest('can parse max safe integer decimal string', Number.MAX_SAFE_INTEGER.toString(), 9007199254740991);

        function addTryParseFailureTest(name, str) {
            it(name, () => {
                // Act:
                const value = utilities.tryParseUint(str);

                // Assert:
                expect(value).to.equal(undefined);
            });
        }

        addTryParseFailureTest('cannot parse decimal string with left padding', ' 14952');
        addTryParseFailureTest('cannot parse decimal string with right padding', '14952 ');
        addTryParseFailureTest('cannot parse decimal string too large', '9007199254740992');
        addTryParseFailureTest('cannot parse zeros string', '00');
        addTryParseFailureTest('cannot parse octal string', '0123');
        addTryParseFailureTest('cannot parse hex string', '0x14A52');
        addTryParseFailureTest('cannot parse double string', '14.52');
        addTryParseFailureTest('cannot parse negative decimal string', '-14952');
        addTryParseFailureTest('cannot parse arbitrary string', 'catapult');
    });
});
