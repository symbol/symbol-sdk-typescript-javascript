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
                                publicKey:
                                    '3D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E022',
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
        expect(Convert.uint8ToHex(serialized)).eq(
            '01007826D27E1D0A26CA4E316F901E23E55C8711DB20DF5C49B501000000000000002E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F0D00000000000000000107012E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F3D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E0220100000003000000B2C62D18000000003E19000000000000E8030000000000006400000000000000010000000A00000000000000D007000000000000C800000000000000020000001400000000000000B80B0000000000002C01000000000000030000001E00000000000000A00F00000000000090010000000000000400000028000000000000008813000000000000F401000000000000050000003200000000000000010029CF5FD941AD25D5BA9F1C6DB3700100',
        );
        // deepEqual(AccountStateBuilder.loadFromBinary(serialized).serialize(), serialized);
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

        const info = AccountHttp.toAccountInfo(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq(
            '010098D03B971EEBCE0E72A8EFA9F5CECFF613260B63B645A1860100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001002017A3BB19EC5C72404B4C0000000000',
        );
    });
});
