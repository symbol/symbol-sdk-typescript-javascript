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

import {MosaicInfo} from 'symbol-sdk'

/**
 * Stored POJO that holds mosaic information.
 *
 * The stored data is cached from rest.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be fined.
 *
 */
export class MosaicModel {

  public readonly mosaicIdHex: string
  public readonly divisibility: number
  public readonly transferable: boolean
  public readonly supplyMutable: boolean
  public readonly restrictable: boolean
  public readonly duration: number
  public readonly height: number
  public readonly supply: number

  constructor(
    public readonly addressRawPlain: string,
    public readonly ownerRawPlain: string,
    public readonly name: string | undefined,
    public readonly isCurrencyMosaic: boolean,
    public readonly balance: number | undefined,
    mosaicInfo: MosaicInfo,
  ) {
    this.mosaicIdHex = mosaicInfo.id.toHex()
    this.divisibility = mosaicInfo.divisibility
    this.transferable = mosaicInfo.isTransferable()
    this.supplyMutable = mosaicInfo.isSupplyMutable()
    this.restrictable = mosaicInfo.isRestrictable()
    this.duration = mosaicInfo.duration.compact()
    this.height = mosaicInfo.height.compact()
    this.supply = mosaicInfo.supply.compact()

  }
}
