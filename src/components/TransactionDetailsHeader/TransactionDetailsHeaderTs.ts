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
import { Component, Prop, Vue } from 'vue-property-decorator'

// internal dependencies
import { TransactionService, TransactionViewType } from '@/services/TransactionService'
import { Formatters } from '@/core/utils/Formatters'
// configuration
// child components
// @ts-ignore
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
// @ts-ignore
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({
  components: {
    TransactionDetailRow,
  },
})
export class TransactionDetailsHeaderTs extends Vue {
  @Prop({
    default: null,
  })
  view: TransactionViewType

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters = Formatters

  private getFeeDetailItem(): TransactionDetailItem {
    if (this.view.transaction.isConfirmed()) {
      return {
        key: 'paid_fee',
        value: this.view.transaction,
        isPaidFee: true,
      }
    } else {
      return {
        key: 'max_fee',
        value: {
          amount: this.view.values.get('maxFee') || 0,
          color: 'red',
        },
        isMosaic: true,
      }
    }
  }

  /**
   * Displayed items
   * @see {Store.Mosaic}
   * @type {({ key: string, value: string | boolean, | Mosaic }[])}
   */
  get items(): TransactionDetailItem[] {
    return [
      {
        key: 'status',
        value: this.$t(`transaction_status_${TransactionService.getTransactionStatus(this.view.transaction)}`),
      },
      {
        key: 'transaction_type',
        value: `${this.$t(`transaction_descriptor_${this.view.transaction.type}`)}`,
      },
      {
        key: 'hash',
        value: this.view.info ? this.view.info.hash : '-',
      },
      this.getFeeDetailItem(),
      {
        key: 'block_height',
        value: this.view.info ? `${this.$t('block')} #${this.view.info.height.compact()}` : '-',
      },
      {
        key: 'deadline',
        value: `${this.view.values.get('deadline').value.toLocalDate()} ${this.view.values
          .get('deadline')
          .value.toLocalTime()}`,
      },
    ]
  }
}
