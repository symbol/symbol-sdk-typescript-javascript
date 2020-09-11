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
import { AccountInfo } from '../../../src/model/account/AccountInfo';
import { ActivityBucket } from '../../../src/model/account/ActivityBucket';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { UInt64 } from '../../../src/model/UInt64';
import { SupplementalPublicKeys } from '../../../src/model/account/SupplementalPublicKeys';
import { AccountLinkPublicKey } from '../../../src/model/account/AccountLinkPublicKey';
import { AccountLinkVotingKey } from '../../../src/model/account/AccountLinkVotingKey';

describe('AccountInfo', () => {
    it('should createComplete an AccountInfo object', () => {
        const accountInfoDTO = {
            account: {
                address: Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144'),
                addressHeight: new UInt64([1, 0]),
                importance: new UInt64([405653170, 0]),
                importanceHeight: new UInt64([6462, 0]),
                accountType: 0,
                supplementalPublicKeys: {
                    linked: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    node: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    vrf: { publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F' },
                    voting: {
                        publicKeys: [
                            {
                                publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                                startEpoch: 1,
                                endEpoch: 3,
                            },
                        ],
                    },
                },
                activityBucket: [
                    {
                        startHeight: '1000',
                        totalFeesPaid: '100',
                        beneficiaryCount: 1,
                        rawScore: '20',
                    },
                ],
                mosaics: [
                    {
                        amount: new UInt64([1830592442, 94387]),
                        id: new MosaicId([3646934825, 3576016193]),
                    },
                ],
                publicKey: '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                publicKeyHeight: new UInt64([13, 0]),
            },
        };

        const accountInfo = new AccountInfo(
            accountInfoDTO.account.address,
            accountInfoDTO.account.addressHeight,
            accountInfoDTO.account.publicKey,
            accountInfoDTO.account.publicKeyHeight,
            accountInfoDTO.account.accountType,
            new SupplementalPublicKeys(
                accountInfoDTO.account.supplementalPublicKeys.linked
                    ? new AccountLinkPublicKey(accountInfoDTO.account.supplementalPublicKeys.linked?.publicKey)
                    : undefined,
                accountInfoDTO.account.supplementalPublicKeys.node
                    ? new AccountLinkPublicKey(accountInfoDTO.account.supplementalPublicKeys.node?.publicKey)
                    : undefined,
                accountInfoDTO.account.supplementalPublicKeys.vrf
                    ? new AccountLinkPublicKey(accountInfoDTO.account.supplementalPublicKeys.vrf?.publicKey)
                    : undefined,
                accountInfoDTO.account.supplementalPublicKeys.voting
                    ? accountInfoDTO.account.supplementalPublicKeys.voting?.publicKeys.map(
                          (v) => new AccountLinkVotingKey(v.publicKey, v.startEpoch, v.endEpoch),
                      )
                    : undefined,
            ),
            accountInfoDTO.account.activityBucket.map(
                (bucket) =>
                    new ActivityBucket(
                        UInt64.fromNumericString(bucket.startHeight),
                        UInt64.fromNumericString(bucket.totalFeesPaid),
                        bucket.beneficiaryCount,
                        UInt64.fromNumericString(bucket.rawScore),
                    ),
            ),
            accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(mosaicDTO.id, mosaicDTO.amount)),
            accountInfoDTO.account.importance,
            accountInfoDTO.account.importanceHeight,
        );
        deepEqual(accountInfo.address, accountInfoDTO.account.address);
        deepEqual(accountInfo.addressHeight, accountInfoDTO.account.addressHeight);
        expect(accountInfo.publicKey).to.be.equal(accountInfoDTO.account.publicKey);
        deepEqual(accountInfo.publicKeyHeight, accountInfoDTO.account.publicKeyHeight);
        deepEqual(accountInfo.importance, accountInfoDTO.account.importance);
        deepEqual(accountInfo.importanceHeight, accountInfoDTO.account.importanceHeight);
        deepEqual(accountInfo.publicAccount, PublicAccount.createFromPublicKey(accountInfoDTO.account.publicKey, NetworkType.MIJIN));
    });
});
