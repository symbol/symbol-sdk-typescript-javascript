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
import { IdGenerator as idGenerator } from '../../../src/core/format';
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
        address_mainnet: 'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y',
        address_Testnet: 'TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q',
        mosaicId_Mainnet: '044C577DBDD6DC71',
        mosaicId_Testnet: '1796754FB181EF1E',
    },
    {
        mosaicNonce: 1477337076,
        address_mainnet: 'NDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YCZOQQ',
        address_Testnet: 'TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KA',
        mosaicId_Mainnet: '7E45A001465DEEA0',
        mosaicId_Testnet: '5E55573E3EBBB596',
    },
    {
        mosaicNonce: 1921674920,
        address_mainnet: 'NCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRH6SYIQ',
        address_Testnet: 'TCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRE3VIBQ',
        mosaicId_Mainnet: '28E680397FDD9336',
        mosaicId_Testnet: '2F05C98474E9B263',
    },
    {
        mosaicNonce: 812613930,
        publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
        address_mainnet: 'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y',
        address_Testnet: 'TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q',
        mosaicId_Mainnet: '296994F01121AFC9',
        mosaicId_Testnet: '570FB3ED9379624C',
    },
    {
        mosaicNonce: 1456792364,
        publicKey: '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
        address_mainnet: 'NDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YCZOQQ',
        address_Testnet: 'TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KA',
        mosaicId_Mainnet: '14AA6D651D9081B4',
        mosaicId_Testnet: '3A334999B5C56073',
    },
    {
        mosaicNonce: 2843362027,
        publicKey: '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
        address_mainnet: 'NCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRH6SYIQ',
        address_Testnet: 'TCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRE3VIBQ',
        mosaicId_Mainnet: '4A0C3A1CA50F2CFC',
        mosaicId_Testnet: '23CE1EAEBE30195A',
    },
    {
        mosaicNonce: 1686841592,
        publicKey: '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
        address_mainnet: 'NDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFDDCHA',
        address_Testnet: 'TDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWEPHRSI',
        mosaicId_Mainnet: '75A9C882F9A89606',
        mosaicId_Testnet: '748A1BD01A40DCF8',
    },
    {
        mosaicNonce: 4206379750,
        publicKey: '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
        address_mainnet: 'NDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QAZ4BMQ',
        address_Testnet: 'TDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCY5ZUA',
        mosaicId_Mainnet: '3E949FBC6D09833D',
        mosaicId_Testnet: '40B85E3227EE56A0',
    },
    {
        mosaicNonce: 2539328334,
        publicKey: '4F593111964B37A9CAC59D2A70BC959AE9269589B75FBD640145EB0038960540',
        address_mainnet: 'NAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4SCMOAI',
        address_Testnet: 'TAA6RO4ZAPEDGTCVADE3G4C7SWAE3DBQ4RTFBQY',
        mosaicId_Mainnet: '1B5FFAEBF3C9602A',
        mosaicId_Testnet: '503EBA0288209C64',
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

        // @dataProvider mosaicTestVector
        it('generates correct mosaicId given nonce and address', () => {
            mosaicTestVector.map((row) => {
                const addressPublic = Address.createFromRawAddress(row.address_mainnet);
                const addressTest = Address.createFromRawAddress(row.address_Testnet);

                // Assert:
                expect(
                    MosaicId.createFromNonce(MosaicNonce.createFromNumber(row.mosaicNonce), addressPublic).toHex(),
                    'Mainnet',
                ).to.deep.equal(row.mosaicId_Mainnet);
                expect(
                    MosaicId.createFromNonce(MosaicNonce.createFromNumber(row.mosaicNonce), addressTest).toHex(),
                    'Testnet',
                ).to.deep.equal(row.mosaicId_Testnet);
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
