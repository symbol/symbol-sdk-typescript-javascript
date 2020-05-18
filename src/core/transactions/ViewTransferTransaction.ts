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
import {
  Address,
  EmptyMessage,
  Message,
  Mosaic,
  MosaicId,
  NamespaceId,
  PlainMessage,
  RawUInt64,
  TransferTransaction,
  UInt64,
} from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { AttachedMosaic } from '@/services/MosaicService'
import { MosaicModel } from '@/core/database/entities/MosaicModel'
import i18n from '@/language'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'

/// region custom types
export type TransferFormFieldsType = {
  recipient: Address | NamespaceId
  mosaics: {
    mosaicHex: string
    amount: number
  }[]
  message?: string
  maxFee: UInt64
}

/// end-region custom types

export class ViewTransferTransaction extends TransactionView<TransferFormFieldsType> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = ['recipient', 'mosaics', 'message', 'maxFee']

  /**
   * Parse form items and return a ViewTransferTransaction
   * @param {TransferFormFieldsType} formItems
   * @return {ViewTransferTransaction}
   */
  public parse(formItems: TransferFormFieldsType): ViewTransferTransaction {
    // - set recipient from form field (no formatting needed)
    this.values.set('recipient', formItems.recipient)

    // - set mosaics from form fields (requires divisibility info)
    const mosaics: Mosaic[] = []
    if (!!formItems.mosaics && formItems.mosaics.length) {
      // - get known mosaics
      const mosaicsInfo = this.$store.getters['mosaic/mosaics'] as MosaicModel[]

      // - prepare mosaic entries (push always ABSOLUTE amount)
      formItems.mosaics.map((spec) => {
        const info = mosaicsInfo.find((i) => i.mosaicIdHex === spec.mosaicHex)
        const div = info ? info.divisibility : 0

        // - format amount to absolute
        const mosaic = new Mosaic(
          new MosaicId(RawUInt64.fromHex(spec.mosaicHex)),
          UInt64.fromUint(spec.amount * Math.pow(10, div)),
        )
        mosaics.push(mosaic)
      })
    }

    this.values.set('mosaics', mosaics)

    // - set message empty or populate
    this.values.set('message', EmptyMessage)
    if (formItems.message && formItems.message.length) {
      this.values.set('message', PlainMessage.create(formItems.message))
    }

    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a ViewTransferTransaction
   * @param {TransferTransaction} transaction
   * @return {ViewTransferTransaction}
   */
  public use(transaction: TransferTransaction): ViewTransferTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)

    // - map recipient
    this.values.set('recipient', transaction.recipientAddress)

    // - set mosaics (Absolute amount)
    const attachedMosaics = transaction.mosaics.map((transactionMosaic) => {
      return {
        id: transactionMosaic.id,
        mosaicHex: transactionMosaic.id.toHex(),
        amount: transactionMosaic.amount.compact(),
      } as AttachedMosaic
    })

    this.values.set('mosaics', attachedMosaics)

    // - set message
    this.values.set('message', transaction.message)
    return this
  }
  /**
   * Displayed sender
   * @var {string}
   */
  private get sender(): string {
    if (this.transaction.signer) return this.transaction.signer.address.pretty()
    const currentSignerAddress = this.$store.getters['account/currentSignerAddress']
    return currentSignerAddress ? currentSignerAddress.pretty() : ''
  }

  /**
   * Displayed recipient
   * @var {string}
   */
  private get recipient(): Address | NamespaceId {
    return (this.transaction as TransferTransaction).recipientAddress
  }

  /**
   * Displayed items
   */
  public resolveDetailItems(): TransactionDetailItem[] {
    const attachedMosaics: AttachedMosaic[] = this.values.get('mosaics')
    const message: Message = this.values.get('message')
    const incoming = this.values.get('isIncoming')
    const mosaicItems = attachedMosaics.map((mosaic, index, self) => {
      const color = incoming ? 'green' : 'red'
      const mosaicLabel = i18n.t('mosaic')
      return {
        key: `${mosaicLabel} (${index + 1}/${self.length})`,
        value: { ...mosaic, color },
        isMosaic: true,
      }
    })

    return [
      { key: 'sender', value: this.sender },
      { key: 'transfer_target', value: this.recipient, isAddress: true },
      ...mosaicItems,
      { key: 'message', value: message.payload || '-' },
    ]
  }
}
