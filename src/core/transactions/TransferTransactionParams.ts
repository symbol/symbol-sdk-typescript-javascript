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
import {Store} from 'vuex'
import {Address, Mosaic, MosaicId, NamespaceId, UInt64, RawUInt64, PlainMessage, EmptyMessage, TransferTransaction, MosaicInfo} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from './TransactionParams'
import {Validator} from '@/core/validators/Validator'
import {AddressValidator} from '@/core/validators/AddressValidator'
import {PublicKeyValidator} from '@/core/validators/PublicKeyValidator'
import {NamespaceIdValidator} from '@/core/validators/NamespaceIdValidator'

type TransferFormFieldsType = {
  recipient: Address | NamespaceId,
  mosaics: {
    mosaicHex: string,
    amount: number
  }[],
  message?: string
}

export class TransferTransactionParams extends TransactionParams {
  /**
   * List of mosaics info
   * @var {MosaicInfo[]}
   */
  protected readonly mosaicsInfo: MosaicInfo[]

  /**
   * Create a transaction parameters instance
   *
   * @param {string[]} fields
   */
  constructor(mosaicsInfo: MosaicInfo[] = []) {
    super([
      'recipient',
      'mosaics',
      'message',
      'maxFee',
    ])

    this.mosaicsInfo = mosaicsInfo
  }

  public static create(formItems: TransferFormFieldsType, mosaicsInfo: MosaicInfo[] = []): TransferTransactionParams {
    const params = new TransferTransactionParams(mosaicsInfo)
    params.setParam('recipient', formItems.recipient)

    const mosaics: Mosaic[] = []
    if (!!formItems.mosaics && formItems.mosaics.length) {
      formItems.mosaics.map(spec => {
        // prepare mosaic entry (push always ABSOLUTE amount)
        const info = params.mosaicsInfo.find(i => i.id.toHex() === spec.mosaicHex)
        const div  = info ? info.divisibility : 0
        const mosaic = new Mosaic(
          new MosaicId(RawUInt64.fromHex(spec.mosaicHex)),
          UInt64.fromUint(spec.amount * Math.pow(10, div))
        )
        mosaics.push(mosaic)
      })
    }

    params.setParam('message', EmptyMessage)
    if (formItems.message && formItems.message.length) {
      params.setParam('message', PlainMessage.create(formItems.message))
    }

    return params
  }

  public static createFromTransaction(transaction: TransferTransaction, mosaicsInfo: MosaicInfo[] = []): TransferTransactionParams {
    const params = new TransferTransactionParams(mosaicsInfo)

    // - map recipient
    params.setParam('recipient', transaction.recipientAddress)

    // - set mosaics (return RELATIVE amount)
    params.setParam('mosaics', transaction.mosaics.map(
      mosaic => {
        const info = params.mosaicsInfo.find(i => i.id.equals(mosaic.id))
        const div  = info ? info.divisibility : 0
        return ({
          mosaicHex: mosaic.id.toHex(),
          amount: mosaic.amount.compact() / Math.pow(10, div)
        })
      }))

    // - set message
    params.setParam('message', transaction.message)
    return params
  }
}
