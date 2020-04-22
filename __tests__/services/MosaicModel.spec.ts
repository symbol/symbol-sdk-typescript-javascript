/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import {Address, MosaicFlags, MosaicId, MosaicInfo, NetworkType, PublicAccount, UInt64} from 'symbol-sdk'
import {MosaicModel} from '@/core/database/entities/MosaicModel'

describe('services/MosaicData', () => {
  describe('serialization', () => {
    test('canSerializeDeserialize', () => {
      // act
      const address = Address.createFromEncoded('917E7E29A01014C2F300000000000000000000000000000000')

      const id = new MosaicId('85BBEA6CC462B244')
      const mosaicInfo = new MosaicInfo(
        id, // mosaicId
        new UInt64([ 3403414400, 2095475 ]), // supply
        new UInt64([ 1, 0 ]), // height
        PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType.MIJIN_TEST),
        1, // revision
        MosaicFlags.create(true, true, true),
        3,
        UInt64.fromUint(1000),
      )
      const expected = new MosaicModel(address.plain(), address.plain(), 'someName', true, 1234, mosaicInfo)

      // assert
      expect(expected).not.toBeNull()
      expect(expected.mosaicIdHex).toBe('85BBEA6CC462B244')
      expect(expected.addressRawPlain).toBe(address.plain())

      const deserialized: MosaicModel = JSON.parse(JSON.stringify(expected))
      expect(deserialized).not.toBeNull()
      expect(deserialized.mosaicIdHex).toBe('85BBEA6CC462B244')
      expect(deserialized.addressRawPlain).toBe(address.plain())
      expect(JSON.stringify(expected)).toBe(JSON.stringify(deserialized))

      const deserializedMosaicInfo: MosaicInfo = JSON.parse(JSON.stringify(mosaicInfo))
      // NOTE I lose the methods!
      expect(deserializedMosaicInfo).not.toBeNull()
      expect(deserializedMosaicInfo.id.toHex).toBe(undefined)
      expect(deserializedMosaicInfo.duration.compact).toBe(undefined)

    })
  })
})
