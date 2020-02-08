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
import {MosaicId, UInt64, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from './TransactionParams'

export interface MosaicSupplyChangeFormFieldsType {
  mosaicId: MosaicId
  mosaicSupplyChangeAction: MosaicSupplyChangeAction
  supply: UInt64
  maxFee: UInt64
}

export class MosaicSupplyChangeTransactionParams extends TransactionParams {
  /**
   * Create a transaction parameters instance
   *
   * @param {string[]} fields
   */
  constructor() {
    super([
      'mosaicId',
      'mosaicSupplyChangeAction',
      'supply',
      'maxFee',
    ])
  }

  public static create(rawParams: MosaicSupplyChangeFormFieldsType): MosaicSupplyChangeTransactionParams {
    const params = new MosaicSupplyChangeTransactionParams()
    
    params.setParam('mosaicId', rawParams.mosaicId)
    params.setParam('mosaicSupplyChangeAction', rawParams.mosaicSupplyChangeAction)
    params.setParam('supply', rawParams.supply)
    params.setParam('maxFee', rawParams.maxFee)

    return params
  }

  public static getView(transaction: MosaicSupplyChangeTransaction) {
    // @TODO 
    return null
  }
}
