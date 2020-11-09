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

import { FinalizedBlockHeaderBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { FinalizedBlockDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { ChainHttp } from '../../../src/infrastructure';

it('should create FinalizedBlock from dto', () => {
    const dto: FinalizedBlockDTO = {
        finalizationEpoch: 6,
        finalizationPoint: 1,
        height: '436',
        hash: 'AE9DEFA30A76F0AAF1F2BCE1ECE7BF0DDFC7E4DA2E54FBFF369CEFF7B77ACF11',
    };

    const info = ChainHttp.toFinalizationBlock(dto);
    const serializedHex = Convert.uint8ToHex(info.serialize());
    expect(serializedHex).eq(
        '98D03B971EEBCE0E72A8EFA9F5CECFF613260B63B645A1860100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001002017A3BB19EC5C72404B4C0000000000',
    );
});

it('should create FinalizedBlock from serialized payload', () => {
    const expectedSerializedHex = '90FD35818960C7B18B72F49A5598FA9F712A354DB38EB076C40300000000000011111111111111111111111111111111';
    const builder = FinalizedBlockHeaderBuilder.loadFromBinary(Convert.hexToUint8(expectedSerializedHex));

    const serializedHex = Convert.uint8ToHex(builder.serialize());
    expect(serializedHex).eq(serializedHex);
});
