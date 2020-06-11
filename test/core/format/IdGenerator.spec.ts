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
import { sha3_256 } from 'js-sha3';
import { Convert as convert, IdGenerator as idGenerator, RawUInt64 as uint64 } from '../../../src/core/format';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';

const constants = {
    nem_id: [0x375ffa4b, 0x84b3552d],
    xem_id: [0xd95fcf29, 0xd525ad41],
    namespace_base_id: [0, 0],
};

const basicMosaicInfo = {
    nonce: [0x78, 0xe3, 0x6f, 0xb7],
    address: [144, 43, 151, 19, 142, 202, 193, 168, 140, 158, 106, 98, 111, 47, 199, 100, 233, 98, 104, 137, 71, 177, 230, 122],
    id: [339608571, 538088181],
};

/**
 * @links https://raw.githubusercontent.com/nemtech/test-vectors/master/5.test-mosaic-id.json
 */
const mosaicTestVector = [
    {
        mosaicNonce: 2039925808,
        address_Public: 'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y',
        address_PublicTest: 'TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q',
        address_Mijin: 'MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACRA',
        address_MijinTest: 'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ',
        mosaicId_Public: '044C577DBDD6DC71',
        mosaicId_PublicTest: '1796754FB181EF1E',
        mosaicId_Mijin: '7DCEDD54DAEDF7B7',
        mosaicId_MijinTest: '5BCD295FC8801FE6',
    },
    {
        mosaicNonce: 1477337076,
        address_Public: 'NDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YCZOQQ',
        address_PublicTest: 'TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KA',
        address_Mijin: 'MDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22B27FI',
        address_MijinTest: 'SDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2Z5UYYY',
        mosaicId_Public: '7E45A001465DEEA0',
        mosaicId_PublicTest: '5E55573E3EBBB596',
        mosaicId_Mijin: '0D47486978FA4316',
        mosaicId_MijinTest: '55595BF89461E7C1',
    },
    {
        mosaicNonce: 1921674920,
        address_Public: 'NCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRH6SYIQ',
        address_PublicTest: 'TCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRE3VIBQ',
        address_Mijin: 'MCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFDHL7I',
        address_MijinTest: 'SCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFENHXQ',
        mosaicId_Public: '28E680397FDD9336',
        mosaicId_PublicTest: '2F05C98474E9B263',
        mosaicId_Mijin: '51B440266AE7F5B4',
        mosaicId_MijinTest: '5693742C8290F33E',
    },
    {
        mosaicNonce: 737150288,
        address_Public: 'NDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFDDCHA',
        address_PublicTest: 'TDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWEPHRSI',
        address_Mijin: 'MDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFN3NKY',
        address_MijinTest: 'SDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWH6N46A',
        mosaicId_Public: '75FAE31C9E1CEE38',
        mosaicId_PublicTest: '35C831D2A6D9702B',
        mosaicId_Mijin: '0476D83DF29A0426',
        mosaicId_MijinTest: '4F5597E18C0182BC',
    },
    {
        mosaicNonce: 4118830514,
        address_Public: 'NDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QAZ4BMQ',
        address_PublicTest: 'TDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCY5ZUA',
        address_Mijin: 'MDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCLCVEA',
        address_MijinTest: 'SDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QDVZG2I',
        mosaicId_Public: '656748D5F82E87A1',
        mosaicId_PublicTest: '1CB636C5A32F0293',
        mosaicId_Mijin: '35C2901E25DCF921',
        mosaicId_MijinTest: '18FF3D8F9FA932D4',
    },
    {
        mosaicNonce: 2640226657,
        address_Public: 'NAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4SCMOAI',
        address_PublicTest: 'TAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4RTFBQY',
        address_Mijin: 'MAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4TEKNHA',
        address_MijinTest: 'SAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4RYAIEA',
        mosaicId_Public: '3840F6C79934A159',
        mosaicId_PublicTest: '5B0FFAA57C41D62E',
        mosaicId_Mijin: '11BA1D842237D52B',
        mosaicId_MijinTest: '0585182BF5BC7B57',
    },
    {
        mosaicNonce: 1996615061,
        address_Public: 'NBEOZ72O73OYXFDLID5KGBMP67MROHONPQHVKAI',
        address_PublicTest: 'TBEOZ72O73OYXFDLID5KGBMP67MROHONPR72UPQ',
        address_Mijin: 'MBEOZ72O73OYXFDLID5KGBMP67MROHONPTHVSXQ',
        address_MijinTest: 'SBEOZ72O73OYXFDLID5KGBMP67MROHONPTACBLI',
        mosaicId_Public: '5AA0FF3892EF3345',
        mosaicId_PublicTest: '79BD9AF30668FBDF',
        mosaicId_Mijin: '0F8D3270B8ADDF77',
        mosaicId_MijinTest: '092E4A9D08A9C1C5',
    },
    {
        mosaicNonce: 205824978,
        address_Public: 'NAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRG2X5RI',
        address_PublicTest: 'TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I',
        address_Mijin: 'MAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRG7GL5A',
        address_MijinTest: 'SAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRGLZY6A',
        mosaicId_Public: '3AB75AF98A5E0365',
        mosaicId_PublicTest: '3494FFAE1F6B2B4D',
        mosaicId_Mijin: '3DF5D3B47E956692',
        mosaicId_MijinTest: '4AA757991E36C79C',
    },
    {
        mosaicNonce: 3310277026,
        address_Public: 'NCOVTFVVDZGNURZFU4IJLJR37X5TXNWMTSEHR6I',
        address_PublicTest: 'TCOVTFVVDZGNURZFU4IJLJR37X5TXNWMTTXN3DI',
        address_Mijin: 'MCOVTFVVDZGNURZFU4IJLJR37X5TXNWMTTARXZQ',
        address_MijinTest: 'SCOVTFVVDZGNURZFU4IJLJR37X5TXNWMTSJ6YWY',
        mosaicId_Public: '213E6E2EC43285C4',
        mosaicId_PublicTest: '659C0D4A03D119D2',
        mosaicId_Mijin: '756AC167798FA3DF',
        mosaicId_MijinTest: '164D3F56862E9520',
    },
];

describe('id generator', () => {
    function generateNamespaceId(parentId, name): number[] {
        const hash = sha3_256.create();
        hash.update(Uint32Array.from(parentId).buffer);
        hash.update(name);
        const result = new Uint32Array(hash.arrayBuffer());
        // right zero-filling required to keep unsigned number representation
        return [result[0], (result[1] | 0x80000000) >>> 0];
    }

    function addBasicTests(generator): void {
        it('produces different results for different names', () => {
            // Assert:
            ['bloodyrookie.alice', 'nem.mex', 'bloodyrookie.xem', 'bloody_rookie.xem'].forEach((name) =>
                expect(generator(name), `nem.xem vs ${name}`).to.not.equal(generator('nem.xem')),
            );
        });

        it('rejects names with uppercase characters', () => {
            // Assert:
            ['NEM.xem', 'NEM.XEM', 'nem.XEM', 'nEm.XeM', 'NeM.xEm'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('invalid part name'),
            );
        });

        it('rejects improper qualified names', () => {
            // Assert:
            ['.', '..', '...', '.a', 'b.', 'a..b', '.a.b', 'b.a.'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('empty part'),
            );
        });

        it('rejects improper part names', () => {
            // Assert:
            ['alpha.bet@.zeta', 'a!pha.beta.zeta', 'alpha.beta.ze^a'].forEach((name) =>
                expect(() => generator(name), `name ${name}`).to.throw('invalid part name'),
            );
        });

        it('rejects empty string', () => {
            // Assert:
            expect(() => generator(''), 'empty string').to.throw('having zero length');
        });
    }

    describe('generate mosaic id', () => {
        it('generates correct well known id', () => {
            // Assert:
            expect(idGenerator.generateMosaicId(basicMosaicInfo.nonce, basicMosaicInfo.address)).to.deep.equal(basicMosaicInfo.id);
        });
        mosaicTestVector.forEach((row) => {
            // @dataProvider mosaicTestVector
            it('generates correct mosaicId given nonce and address', () => {
                const addressPublic = Address.createFromRawAddress(row.address_Public);
                const addressTest = Address.createFromRawAddress(row.address_PublicTest);
                const addressMijin = Address.createFromRawAddress(row.address_Mijin);
                const addressMijinTest = Address.createFromRawAddress(row.address_MijinTest);
                const nonce = MosaicNonce.createFromNumber(row.mosaicNonce);

                // Assert:
                expect(MosaicId.createFromNonceAndAddress(nonce, addressPublic).toHex(), 'Public').to.deep.equal(row.mosaicId_Public);
                expect(MosaicId.createFromNonceAndAddress(nonce, addressTest).toHex(), 'PublicTest').to.deep.equal(row.mosaicId_PublicTest);
                expect(MosaicId.createFromNonceAndAddress(nonce, addressMijin).toHex(), 'Mijin').to.deep.equal(row.mosaicId_Mijin);
                expect(MosaicId.createFromNonceAndAddress(nonce, addressMijinTest).toHex(), 'MijinTest').to.deep.equal(
                    row.mosaicId_MijinTest,
                );
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

        it('generates correct well known child path', () => {
            // Act:
            const path = idGenerator.generateNamespacePath('nem.xem');

            // Assert:
            expect(path.length).to.equal(2);
            expect(path[0]).to.deep.equal(constants.nem_id);
            expect(path[1]).to.deep.equal(constants.xem_id);
        });

        it('supports multi level namespaces', () => {
            // Arrange:
            const expected: number[][] = [];
            expected.push(generateNamespaceId(constants.namespace_base_id, 'foo'));
            expected.push(generateNamespaceId(expected[0], 'bar'));
            expected.push(generateNamespaceId(expected[1], 'baz'));

            // Assert:
            expect(idGenerator.generateNamespacePath('foo.bar.baz')).to.deep.equal(expected);
        });

        it('rejects improper qualified names', () => {
            // Assert:
            ['a:b:c', 'a::b'].forEach((name) =>
                expect(() => idGenerator.generateNamespacePath(name), `name ${name}`).to.throw('invalid part name'),
            );
        });
        addBasicTests(idGenerator.generateNamespacePath);
    });
});
