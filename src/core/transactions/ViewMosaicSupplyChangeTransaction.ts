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
import { MosaicSupplyChangeAction, MosaicSupplyChangeTransaction } from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
import i18n from '@/language'

export class ViewMosaicSupplyChangeTransaction extends TransactionView<MosaicSupplyChangeTransaction> {
  /**
   * Displayed items
   */
  protected resolveDetailItems(): TransactionDetailItem[] {
    const mosaicId = this.transaction.mosaicId
    const action = this.transaction.action
    const delta = this.transaction.delta

    return [
      { key: 'mosaicId', value: mosaicId.toHex() },
      {
        key: 'direction',
        value: `${i18n.t(action === MosaicSupplyChangeAction.Increase ? 'Increase' : 'Decrease')}`,
      },
      {
        key: 'delta',
        value: delta.compact().toLocaleString(),
      },
    ]
  }
}
