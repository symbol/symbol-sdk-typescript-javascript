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

describe('AccountInfo', () => {
    it('should createComplete an AccountInfo object', () => {
        const accountInfoDTO = {
            account: {
                address: Address.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142'),
                addressHeight: new UInt64([1, 0]),
                importance: new UInt64([405653170, 0]),
                importanceHeight: new UInt64([6462, 0]),
                accountType: 0,
                linkedAccountKey: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
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
                publicKey: '846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2',
                publicKeyHeight: new UInt64([13, 0]),
            },
        };

        const accountInfo = new AccountInfo(
            accountInfoDTO.account.address,
            accountInfoDTO.account.addressHeight,
            accountInfoDTO.account.publicKey,
            accountInfoDTO.account.publicKeyHeight,
            accountInfoDTO.account.accountType,
            accountInfoDTO.account.linkedAccountKey,
            accountInfoDTO.account.activityBucket.map(
                (bucket) =>
                    new ActivityBucket(
                        bucket.startHeight,
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
        deepEqual(accountInfo.publicAccount, PublicAccount.createFromPublicKey(accountInfoDTO.account.publicKey, NetworkType.MIJIN_TEST));
    });
});
