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

import { deepEqual } from 'assert';
import { UInt64 } from '../../../src/model/UInt64';
import { SecretLockInfoDTO, LockHashAlgorithmEnum, SecretLockEntryDTO } from 'symbol-openapi-typescript-fetch-client';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { Address } from '../../../src/model/account/Address';
import { SecretLockInfo } from '../../../src/model/lock/SecretLockInfo';

describe('SecretLockInfo', () => {
    it('should createComplete an SecretLockInfo object', () => {
        const dto = {} as SecretLockInfoDTO;
        const lockDto = {} as SecretLockEntryDTO;
        dto.id = '1';
        lockDto.amount = '10';
        lockDto.endHeight = '122';
        lockDto.compositeHash = 'AAA';
        lockDto.secret = 'AAA';
        lockDto.mosaicId = new MosaicId([3294802500, 2243684972]).toHex();
        lockDto.ownerAddress = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ').plain();
        lockDto.recipientAddress = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ').plain();
        lockDto.status = 1;
        lockDto.hashAlgorithm = LockHashAlgorithmEnum.NUMBER_0;
        dto.lock = lockDto;
        const info = new SecretLockInfo(
            dto.id,
            Address.createFromRawAddress(lockDto.ownerAddress),
            new MosaicId(lockDto.mosaicId),
            UInt64.fromNumericString(lockDto.amount),
            UInt64.fromNumericString(lockDto.endHeight),
            lockDto.status,
            lockDto.hashAlgorithm.valueOf(),
            lockDto.secret,
            Address.createFromRawAddress(lockDto.recipientAddress),
            lockDto.compositeHash,
        );

        deepEqual(info.amount.toString(), lockDto.amount);
        deepEqual(info.recordId, dto.id);
        deepEqual(info.endHeight.toString(), lockDto.endHeight);
        deepEqual(info.ownerAddress.plain(), lockDto.ownerAddress);
        deepEqual(info.recipientAddress.plain(), lockDto.ownerAddress);
        deepEqual(info.compositeHash, lockDto.compositeHash);
        deepEqual(info.mosaicId.toHex(), lockDto.mosaicId);
        deepEqual(info.status, lockDto.status);
        deepEqual(info.secret, lockDto.secret);
        deepEqual(info.hashAlgorithm.valueOf(), lockDto.hashAlgorithm.valueOf());
    });
});
