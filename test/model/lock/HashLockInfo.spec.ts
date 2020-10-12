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
import { HashLockInfoDTO, HashLockEntryDTO } from 'symbol-openapi-typescript-fetch-client';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { Address } from '../../../src/model/account/Address';
import { HashLockInfo } from '../../../src/model/lock/HashLockInfo';

describe('HashLockInfo', () => {
    it('should createComplete an HashLockInfo object', () => {
        const dto = {} as HashLockInfoDTO;
        dto.id = '1';
        const lockDto = {} as HashLockEntryDTO;
        lockDto.amount = '10';
        lockDto.endHeight = '122';
        lockDto.hash = 'AAA';
        lockDto.mosaicId = new MosaicId([3294802500, 2243684972]).toHex();
        lockDto.ownerAddress = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ').plain();
        lockDto.status = 1;
        dto.lock = lockDto;
        const info = new HashLockInfo(
            dto.id,
            Address.createFromRawAddress(lockDto.ownerAddress),
            new MosaicId(lockDto.mosaicId),
            UInt64.fromNumericString(lockDto.amount),
            UInt64.fromNumericString(lockDto.endHeight),
            lockDto.status,
            lockDto.hash,
        );

        deepEqual(info.amount.toString(), lockDto.amount);
        deepEqual(info.recordId, dto.id);
        deepEqual(info.endHeight.toString(), lockDto.endHeight);
        deepEqual(info.ownerAddress.plain(), lockDto.ownerAddress);
        deepEqual(info.hash, lockDto.hash);
        deepEqual(info.mosaicId.toHex(), lockDto.mosaicId);
        deepEqual(info.status, lockDto.status);
    });
});
