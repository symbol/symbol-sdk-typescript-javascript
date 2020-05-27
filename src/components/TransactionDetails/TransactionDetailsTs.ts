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
import { AggregateTransaction, Transaction } from 'symbol-sdk'

// internal dependencies
import { Formatters } from '@/core/utils/Formatters'

// child components
// @ts-ignore
import DetailView from './DetailView.vue'
// @ts-ignore
import TransactionDetailsHeader from '@/components/TransactionDetailsHeader/TransactionDetailsHeader.vue'
import { TransactionViewFactory } from '@/core/transactions/TransactionViewFactory'
import { TransactionView } from '@/core/transactions/TransactionView'

//@ts-ignore
@Component({
  components: { DetailView, TransactionDetailsHeader },
})
export class TransactionDetailsTs extends Vue {
  /**
   * Transaction to render
   * @type {Transaction}
   */
  @Prop({ default: null }) transaction: Transaction

  protected views: TransactionView<Transaction>[] = []

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters = Formatters

  public mounted() {
    if (this.transaction instanceof AggregateTransaction) {
      this.views = [this.getView(this.transaction), ...this.transaction.innerTransactions.map((tx) => this.getView(tx))]
      return
    }

    this.views = [this.getView(this.transaction)]
  }

  private getView(transaction: Transaction): TransactionView<Transaction> {
    return TransactionViewFactory.getView(this.$store, transaction)
  }
}
