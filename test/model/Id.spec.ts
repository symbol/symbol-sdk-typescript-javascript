// /*
//  * Copyright 2018 NEM
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import {expect} from 'chai';
// import {Id} from '../../src/model/Id';

// describe('Id', () => {
//     describe('toHex()', () => {
//         it('should generate mosaic xem id', () => {
//             const idName = new Id([3646934825, 3576016193]).toHex();
//             expect(idName).to.be.equal('D525AD41D95FCF29');
//         });

//         it('should generate namespace nem id', () => {
//             const idName = new Id([929036875, 2226345261]).toHex();
//             expect(idName).to.be.equal('84B3552D375FFA4B');
//         });
//     });

//     describe('fromHex()', () => {
//         it('should createComplete from xem hex string', () => {
//             const id = Id.fromHex('d525ad41d95fcf29');
//             expect(id.lower).to.be.equal(3646934825);
//             expect(id.higher).to.be.equal(3576016193);
//         });

//         it('should createComplete from nem hex string', () => {
//             const id = Id.fromHex('84b3552d375ffa4b');
//             expect(id.lower).to.be.equal(929036875);
//             expect(id.higher).to.be.equal(2226345261);
//         });
//     });
// });
