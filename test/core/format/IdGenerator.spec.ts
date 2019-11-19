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
import {sha3_256} from 'js-sha3';
import {
    Convert as convert,
    IdGenerator as idGenerator,
    RawUInt64 as uint64,
} from '../../../src/core/format';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';

const constants = {
    nem_id: [0x375FFA4B, 0x84B3552D], // 84B3552D375FFA4B
    xem_id: [0xD95FCF29, 0xD525AD41], // D525AD41D95FCF29
    namespace_base_id: [0, 0],
};

const keccak_constants = {
    nem_id: [0x12A2C7B8, 0xA912FDE5], // A912FDE512A2C7B8
    xem_id: [0x125CB3C7, 0xB5557B0C], // B5557B0C125CB3C7
    namespace_base_id: [0, 0],
};

const basicMosaicInfo = {
    nonce: [0x78, 0xE3, 0x6F, 0xB7],
    publicId: [
        0x4A, 0xFF, 0x7B, 0x4B, 0xA8, 0xC1, 0xC2, 0x6A, 0x79, 0x17, 0x57, 0x59, 0x93, 0x34, 0x66, 0x27,
        0xCB, 0x6C, 0x80, 0xDE, 0x62, 0xCD, 0x92, 0xF7, 0xF9, 0xAE, 0xDB, 0x70, 0x64, 0xA3, 0xDE, 0x62,
    ],
    id: [0xC0AFC518, 0x3AD842A8],
    keccak_id: [0xEDE4A3B5, 0x5BE12991],
};

const mosaicTestVector = {
    rows: [{
            publicKey: '4AFF7B4BA8C1C26A7917575993346627CB6C80DE62CD92F7F9AEDB7064A3DE62',
            nonce: 'B76FE378',
            expectedMosaicId: '3AD842A8C0AFC518',
            expectedMosaicId_keccak: '5BE12991EDE4A3B5',
        },
        {
            publicKey: '3811EDF245F1D30171FF1474B24C4366FECA365A8457AAFA084F3DE4AEA0BA60',
            nonce: '21832A2A',
            expectedMosaicId: '24C54740A9F3893F',
            expectedMosaicId_keccak: '2BE164F9A75DF7E3',
        },
        {
            publicKey: '3104D468D20491EC12C988C50CAD9282256052907415359201C46CBD7A0BCD75',
            nonce: '2ADBB332',
            expectedMosaicId: '43908F2DEEA04245',
            expectedMosaicId_keccak: '150E9D162C201699',
        },
        {
            publicKey: '6648E16513F351E9907B0EA34377E25F579BE640D4698B28E06585A21E94CFE2',
            nonce: 'B9175E0F',
            expectedMosaicId: '183172772BD29E78',
            expectedMosaicId_keccak: '0B2EC34268F9E738',
        },
        {
            publicKey: '1C05C40D38463FE725CF0584A3A69E3B0D6B780196A88C50624E49B921EE1404',
            nonce: 'F6077DDD',
            expectedMosaicId: '423DB0B12F787422',
            expectedMosaicId_keccak: '79D9511DB0820357',
        },
        {
            publicKey: '37926B3509987093C776C8EA3E7F978E3A78142B5C96B9434C3376177DC65EFD',
            nonce: '08190C6D',
            expectedMosaicId: '1F07D26B6CD352D5',
            expectedMosaicId_keccak: '3600A75CB6BAC564',
        },
        {
            publicKey: 'FDC6B0D415D90536263431F05C46AC492D0BD9B3CFA1B79D5A35E0F371655C0C',
            nonce: '81662AA5',
            expectedMosaicId: '74511F54940729CB',
            expectedMosaicId_keccak: '148207CC42F848F5',
        },
        {
            publicKey: '2D4EA99965477AEB3BC162C09C24C8DA4DABE408956C2F69642554EA48AAE1B2',
            nonce: 'EA16BF58',
            expectedMosaicId: '4C55843B6EB4A5BD',
            expectedMosaicId_keccak: '242117E483E89C97',
        },
        {
            publicKey: '68EB2F91E74D005A7C22D6132926AEF9BFD90A3ACA3C7F989E579A93EFF24D51',
            nonce: 'E5F87A8B',
            expectedMosaicId: '4D89DE2B6967666A',
            expectedMosaicId_keccak: '02F85234BB69DE96',
        },
        {
            publicKey: '3B082C0074F65D1E205643CDE72C6B0A3D0579C7ACC4D6A7E23A6EC46363B90F',
            nonce: '1E6BB49F',
            expectedMosaicId: '0A96B3A44615B62F',
            expectedMosaicId_keccak: '6540ADD2F5553B1C',
        },
        {
            publicKey: '81245CA233B729FAD1752662EADFD73C5033E3B918CE854E01F6EB51E98CD9F1',
            nonce: 'B82965E3',
            expectedMosaicId: '1D6D8E655A77C4E6',
            expectedMosaicId_keccak: '0428FF2C77E73627',
        },
        {
            publicKey: 'D3A2C1BFD5D48239001174BFF62A83A52BC9A535B8CDBDF289203146661D8AC4',
            nonce: 'F37FB460',
            expectedMosaicId: '268A3CC23ADCDA2D',
            expectedMosaicId_keccak: '256E43F770A82286',
        },
        {
            publicKey: '4C4CA89B7A31C42A7AB963B8AB9D85628BBB94735C999B2BD462001A002DBDF3',
            nonce: 'FF6323B0',
            expectedMosaicId: '51202B5C51F6A5A9',
            expectedMosaicId_keccak: '1B919D2A45478B06',
        },
        {
            publicKey: '2F95D9DCD4F18206A54FA95BD138DA1C038CA82546525A8FCC330185DA0647DC',
            nonce: '99674492',
            expectedMosaicId: '5CE4E38B09F1423D',
            expectedMosaicId_keccak: '6DD76C9AA0126E9B',
        },
        {
            publicKey: 'A7892491F714B8A7469F763F695BDB0B3BF28D1CC6831D17E91F550A2D48BD12',
            nonce: '55141880',
            expectedMosaicId: '5EFD001B3350C9CB',
            expectedMosaicId_keccak: '0D3FBC12110B84DF',
        },
        {
            publicKey: '68BBDDF5C08F54278DA516F0E4A5CCF795C10E2DE26CAF127FF4357DA7ACF686',
            nonce: '11FA5BAF',
            expectedMosaicId: '179F0CDD6D2CCA7B',
            expectedMosaicId_keccak: '50B75F5CC92102F2',
        },
        {
            publicKey: '014F6EF90792F814F6830D64017107534F5B718E2DD43C25ACAABBE347DEC81E',
            nonce: '6CFBF7B3',
            expectedMosaicId: '53095813DEB3D108',
            expectedMosaicId_keccak: '60C553D950B6F874',
        },
        {
            publicKey: '95A6344597E0412C51B3559F58F564F9C2DE3101E5CC1DD8B115A93CE7040A71',
            nonce: '905EADFE',
            expectedMosaicId: '3551C4B12DDF067D',
            expectedMosaicId_keccak: '2CA716F0461A5441',
        },
        {
            publicKey: '0D7DDFEB652E8B65915EA734420A1233A233119BF1B0D41E1D5118CDD44447EE',
            nonce: '61F5B671',
            expectedMosaicId: '696E2FB0682D3199',
            expectedMosaicId_keccak: '4A9E186E4841F27C',
        },
        {
            publicKey: 'FFD781A20B01D0C999AABC337B8BAE82D1E7929A9DD77CC1A71E4B99C0749684',
            nonce: 'D8542F1A',
            expectedMosaicId: '6C55E05D11D19FBD',
            expectedMosaicId_keccak: '38928F01C609BBCD',
        },
    ],
};

describe('id generator', () => {

    function addBasicTests(generator) {
        it('produces different results for different names', () => {
            // Assert:
            ['bloodyrookie.alice', 'nem.mex', 'bloodyrookie.xem', 'bloody_rookie.xem'].forEach((name) =>
                expect(() => generator(name), `nem.xem vs ${name}`).to.not.equal(generator('nem.xem')));
        });

        it('uses SignSchema.SHA3 as default signature schema', () => {
            const sha3_xem = generator('nem.xem', NetworkType.MIJIN_TEST);
            const xem = generator('nem.xem');

            expect(xem, `DEFAULT nem.xem vs SHA3 nem.xem`).to.deep.equal(sha3_xem);
        });

        it('produces different results for different signature schema', () => {
            // Assert:
            ['bloodyrookie.alice', 'nem.mex', 'bloodyrookie.xem', 'bloody_rookie.xem'].forEach((name) => {
                const sha3_ns = generator(name, NetworkType.MIJIN_TEST);
                const keccak_ns = generator(name, NetworkType.TEST_NET);

                expect(() => keccak_ns, `KECCAK ${name} vs SHA3 ${name}`).to.not.equal(sha3_ns);
            });
        });

        it('rejects names with uppercase characters', () => {
            // Assert:
            ['NEM.xem', 'NEM.XEM', 'nem.XEM', 'nEm.XeM', 'NeM.xEm'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('invalid part name'));
        });

        it('rejects improper qualified names', () => {
            // Assert:
            ['.', '..', '...', '.a', 'b.', 'a..b', '.a.b', 'b.a.'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('empty part'));
        });

        it('rejects improper part names', () => {
            // Assert:
            ['alpha.bet@.zeta', 'a!pha.beta.zeta', 'alpha.beta.ze^a'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('invalid part name'));
        });

        it('rejects empty string', () => {
            // Assert:
            expect(() => generator(''), 'empty string').to.throw('having zero length');
        });
    }

    describe('generate mosaic id', () => {
        it('generates correct well known id', () => {
            // Assert:
            expect(idGenerator.generateMosaicId(basicMosaicInfo.nonce, basicMosaicInfo.publicId))
                .to.deep.equal(basicMosaicInfo.id);
        });

        it('generates correct well known id with KECCAK given NetworkType.TEST_NET', () => {
            // Assert:
            expect(idGenerator.generateMosaicId(basicMosaicInfo.nonce, basicMosaicInfo.publicId, NetworkType.TEST_NET))
                .to.deep.equal(basicMosaicInfo.keccak_id);
        });

        // @dataProvider mosaicTestVector
        it('generates correct mosaicId given nonce and public key', () => {
            mosaicTestVector.rows.map((row, i) => {
                const pubKey = convert.hexToUint8(row.publicKey);
                const nonce = convert.hexToUint8(row.nonce).reverse(); // Little-Endianness!
                const mosaicId = idGenerator.generateMosaicId(nonce, pubKey);
                const expectedId = uint64.fromHex(row.expectedMosaicId);

                // Assert:
                expect(mosaicId)
                    .to.deep.equal(expectedId);
            });
        });

        // @dataProvider mosaicTestVector
        it('generates correct mosaicId given nonce and public key with KECCAK given NetworkType.(TEST_NET|MAIN_NET)', () => {
            mosaicTestVector.rows.map((row, i) => {
                const pubKey = convert.hexToUint8(row.publicKey);
                const nonce = convert.hexToUint8(row.nonce).reverse(); // Little-Endianness!
                const mosaicId_publicTest = idGenerator.generateMosaicId(nonce, pubKey, NetworkType.TEST_NET);
                const mosaicId_public =  idGenerator.generateMosaicId(nonce, pubKey, NetworkType.MAIN_NET);
                const expectedId = uint64.fromHex(row.expectedMosaicId_keccak);

                // Assert:
                expect(mosaicId_publicTest)
                    .to.deep.equal(expectedId);

                expect(mosaicId_public)
                    .to.deep.equal(expectedId);
            });
        });
    });

    describe('generate namespace paths', () => {
        it('generates correct well known root path', () => {
            // Act:
            const path = idGenerator.generateNamespacePath('nem');

            // Assert:
            expect(path.length).to.equal(1);
            expect(path[0]).to.deep.equal(constants.nem_id);
        });

        it('generates correct well known root path with KECCAK given NetworkType.TEST_NET', () => {
            // Act:
            const path = idGenerator.generateNamespacePath('nem', NetworkType.TEST_NET);

            // Assert:
            expect(path.length).to.equal(1);
            expect(path[0]).to.deep.equal(keccak_constants.nem_id);
        });

        it('generates correct well known child path', () => {
            // Act:
            const path = idGenerator.generateNamespacePath('nem.xem');

            // Assert:
            expect(path.length).to.equal(2);
            expect(path[0]).to.deep.equal(constants.nem_id);
            expect(path[1]).to.deep.equal(constants.xem_id);
        });

        it('generates correct well known child path with KECCAK given NetworkType.TEST_NET', () => {
            // Act:
            const path = idGenerator.generateNamespacePath('nem.xem', NetworkType.TEST_NET);

            // Assert:
            expect(path.length).to.equal(2);
            expect(path[0]).to.deep.equal(keccak_constants.nem_id);
            expect(path[1]).to.deep.equal(keccak_constants.xem_id);
        });

        it('supports multi level namespaces', () => {
            // Arrange:
            const expected: any = [];
            expected.push(idGenerator.generateNamespaceId(constants.namespace_base_id, 'foo'));
            expected.push(idGenerator.generateNamespaceId(expected[0], 'bar'));
            expected.push(idGenerator.generateNamespaceId(expected[1], 'baz'));

            // Assert:
            expect(idGenerator.generateNamespacePath('foo.bar.baz')).to.deep.equal(expected);
        });

        it('supports multi level namespaces with KECCAK given NetworkType.TEST_NET', () => {
            // Arrange:
            const expected: any = [];
            expected.push(idGenerator.generateNamespaceId(constants.namespace_base_id, 'foo', NetworkType.TEST_NET));
            expected.push(idGenerator.generateNamespaceId(expected[0], 'bar', NetworkType.TEST_NET));
            expected.push(idGenerator.generateNamespaceId(expected[1], 'baz', NetworkType.TEST_NET));

            // Assert:
            expect(idGenerator.generateNamespacePath('foo.bar.baz', NetworkType.TEST_NET)).to.deep.equal(expected);
        });

        it('rejects names with too many parts', () => {
            // Assert:
            ['a.b.c.d', 'a.b.c.d.e'].forEach((name) =>
                expect(() => idGenerator.generateNamespacePath(name), `name ${name}`).to.throw('too many parts'));
        });

        it('rejects improper qualified names', () => {
            // Assert:
            ['a:b:c', 'a::b'].forEach((name) =>
                expect(() => idGenerator.generateNamespacePath(name), `name ${name}`).to.throw('invalid part name'));
        });

        addBasicTests(idGenerator.generateNamespacePath);
    });
});
