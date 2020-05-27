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
import { MosaicDefinitionTransaction, MosaicFlags, MosaicId } from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'

export class ViewMosaicDefinitionTransaction extends TransactionView<MosaicDefinitionTransaction> {
  /**
   * Displayed items
   */
  protected resolveDetailItems(): TransactionDetailItem[] {
    const mosaicId: MosaicId = this.transaction.mosaicId
    const divisibility: number = this.transaction.divisibility
    const mosaicFlags: MosaicFlags = this.transaction.flags

    return [
      { key: 'mosaicId', value: mosaicId.toHex() },
      {
        key: 'table_header_divisibility',
        value: `${divisibility}`,
      },
      {
        key: 'duration',
        value: this.transaction.duration.compact(),
      },
      {
        key: 'table_header_transferable',
        value: mosaicFlags.transferable,
      },
      {
        key: 'table_header_supply_mutable',
        value: mosaicFlags.supplyMutable,
      },
      {
        key: 'table_header_restrictable',
        value: mosaicFlags.restrictable,
      },
    ]
  }
}
