/**
 * 
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
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
import {MosaicId, UInt64, MosaicDefinitionTransaction, MosaicFlags, MosaicNonce} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from './TransactionParams'

export interface MosaicDefinitionFormFieldsType {
  nonce: MosaicNonce
  mosaicId: MosaicId
  mosaicFlags: MosaicFlags
  divisibility: number
  permanent: boolean
  duration: number
  maxFee: UInt64
}

export class MosaicDefinitionTransactionParams extends TransactionParams {
  /**
   * Create a transaction parameters instance
   *
   * @param {string[]} fields
   */
  constructor() {
    super([
      'nonce',
      'mosaicId',
      'mosaicFlags',
      'divisibility',
      'duration',
      'maxFee',
    ])
  }

  public static create(rawParams: MosaicDefinitionFormFieldsType): MosaicDefinitionTransactionParams {
    const params = new MosaicDefinitionTransactionParams()
    
    params.setParam('nonce', rawParams.nonce)
    params.setParam('mosaicId', rawParams.mosaicId)
    params.setParam('mosaicFlags', rawParams.mosaicFlags)
    params.setParam('divisibility', rawParams.divisibility)
    params.setParam('duration', rawParams.permanent ? undefined : rawParams.duration)
    params.setParam('maxFee', rawParams.maxFee)

    return params
  }

  public static getView(transaction: MosaicDefinitionTransaction) {
    // @TODO 
    return null
  }
}
