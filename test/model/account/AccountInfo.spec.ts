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
import { AccountStateBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { AccountInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { AccountHttp } from '../../../src/infrastructure';
import { UInt64 } from '../../../src/model';
import { Address, PublicAccount } from '../../../src/model/account';
import { MosaicId } from '../../../src/model/mosaic';
import { NetworkType } from '../../../src/model/network';

describe('AccountInfo', () => {
    it('should createComplete an AccountInfo object', () => {
        const mosaicId = new MosaicId([3646934825, 3576016193]);
        const mosaicAmount = new UInt64([1830592442, 94387]);
        const addressHeight = new UInt64([1, 0]);
        const importance = new UInt64([405653170, 0]);
        const importanceHeight = new UInt64([6462, 0]);
        const address = Address.createFromEncoded('7826D27E1D0A26CA4E316F901E23E55C8711DB20DF5C49B5');
        const publicKeyHeight = new UInt64([13, 0]);
        const accountInfoDTO: AccountInfoDTO = {
            id: 'someId',
            account: {
                address: address.encoded(),
                addressHeight: addressHeight.toString(),
                importance: importance.toString(),
                importanceHeight: importanceHeight.toString(),
                accountType: 0,
                supplementalPublicKeys: {
                    linked: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    node: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    vrf: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    voting: {
                        publicKeys: [
                            {
                                publicKey: '3E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                                startEpoch: 1,
                                endEpoch: 3,
                            },
                        ],
                    },
                },
                activityBuckets: [
                    {
                        startHeight: '1000',
                        totalFeesPaid: '100',
                        beneficiaryCount: 1,
                        rawScore: '10',
                    },

                    {
                        startHeight: '2000',
                        totalFeesPaid: '200',
                        beneficiaryCount: 2,
                        rawScore: '20',
                    },

                    {
                        startHeight: '3000',
                        totalFeesPaid: '300',
                        beneficiaryCount: 3,
                        rawScore: '30',
                    },

                    {
                        startHeight: '4000',
                        totalFeesPaid: '400',
                        beneficiaryCount: 4,
                        rawScore: '40',
                    },

                    {
                        startHeight: '5000',
                        totalFeesPaid: '500',
                        beneficiaryCount: 5,
                        rawScore: '50',
                    },
                ],
                mosaics: [
                    {
                        amount: mosaicAmount.toString(),
                        id: mosaicId.toHex(),
                    },
                ],
                publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                publicKeyHeight: publicKeyHeight.toString(),
            },
        };

        const accountInfo = AccountHttp.toAccountInfo(accountInfoDTO);
        deepEqual(accountInfo.address, address);
        deepEqual(accountInfo.addressHeight, addressHeight);
        expect(accountInfo.publicKey).to.be.equal(accountInfoDTO.account.publicKey);
        deepEqual(accountInfo.publicKeyHeight, publicKeyHeight);
        deepEqual(accountInfo.importance, importance);
        deepEqual(accountInfo.importanceHeight, importanceHeight);
        deepEqual(accountInfo.publicAccount, PublicAccount.createFromPublicKey(accountInfoDTO.account.publicKey, NetworkType.PRIVATE));

        const serialized = accountInfo.serialize();
        expect(serialized.length).eq(386);
        expect(Convert.uint8ToHex(serialized)).eq(
            '7826D27E1D0A26CA4E316F901E23E55C8711DB20DF5C49B501000000000000002E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F0D00000000000000000107012E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F3E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F0100000003000000B2C62D18000000003E19000000000000E8030000000000006400000000000000010000000A00000000000000D007000000000000C800000000000000020000001400000000000000B80B0000000000002C01000000000000030000001E00000000000000A00F00000000000090010000000000000400000028000000000000008813000000000000F401000000000000050000003200000000000000010029CF5FD941AD25D5BA9F1C6DB3700100',
        );
        deepEqual(AccountStateBuilder.loadFromBinary(serialized).serialize(), serialized);
    });

    it('should create and validate state hash', () => {
        const dto: AccountInfoDTO = {
            account: {
                address: '98D03B971EEBCE0E72A8EFA9F5CECFF613260B63B645A186',
                addressHeight: '1',
                publicKey: '0000000000000000000000000000000000000000000000000000000000000000',
                publicKeyHeight: '0',
                accountType: 0,
                supplementalPublicKeys: {},
                activityBuckets: [
                    {
                        startHeight: '1',
                        totalFeesPaid: '0',
                        beneficiaryCount: 0,
                        rawScore: '5000000',
                    },
                ],
                mosaics: [
                    {
                        id: '725CEC19BBA31720',
                        amount: '5000000',
                    },
                ],
                importance: '5000000',
                importanceHeight: '1',
            },
            id: '5FA893BB6D1B44BFCD93AE74',
        };

        const rawMerklePath =
            '0000FD8DAADC5471ECF36FC77723C1887995DB35986D0AE576F82541D6E05E2B3D6DDD581181519DB828A365CC21174B16BDFB8892BC4BBA09A49207C41ACCD4F15745CDADFB195FEF8E11A5B8A9A872E6C6C37790382E7C0641F7A7F6B1300F707A28FE2D1169E8329EF5605409E7E596BFDDB019D5C249A8A061F2DCCEDDF7B0DE6576E9897026CA39F772A1DEBA23D6BACD9720CA2723811E2399B4244B856CCB96CC89E858B8831ADFD12423505B0AC6787D2A8FB4C63BA12B04D6767DD44B8493DC749FAA444A17F490998C0E2ED5B6CDF7A645A5F2F7936DB24486014ED449283FA52369945D71A5FB40235666749E8DF6E0485FCC1C33566071FD0EE5684E4BD69A1744846CBFE69E012C98FAC6C087E8516A6E75494EE616BDB226ADF6179F3A0C585595E38B6C27551608C1E70B08E2958C9D82E2ACEEABEB43405D77164ABCA8D585502AD2B2E108641B8A4ACDBFBC9CF40EF1F93862E6608348FAA1A944EE00000802271ED22F4583DE7FCDD871E8B5BD7B27583C340949EA753DE61FF3A38AC38BB72445182EB5DB548A562A6C6F3D9F760F19D280122EECC8D9725B075295BA25B9FF3E44E8AF8871AF72668806C64BB13D23687FEC2B89AA7F5D3C1A9DD8686292013AD3F8AFAABF2FF39A4B6500FA5101608E0E084765FF682F0629684DB2C945C5';

        const info = AccountHttp.toAccountInfo(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq(
            '98D03B971EEBCE0E72A8EFA9F5CECFF613260B63B645A1860100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001002017A3BB19EC5C72404B4C0000000000',
        );
    });
});
