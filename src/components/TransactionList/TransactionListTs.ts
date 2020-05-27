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
import { mapGetters } from 'vuex'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AggregateTransaction, MosaicId, Transaction } from 'symbol-sdk'
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel'
// child components
// @ts-ignore
import ModalTransactionCosignature from '@/views/modals/ModalTransactionCosignature/ModalTransactionCosignature.vue'
// @ts-ignore
import ModalTransactionDetails from '@/views/modals/ModalTransactionDetails/ModalTransactionDetails.vue'
// @ts-ignore
import PageTitle from '@/components/PageTitle/PageTitle.vue'
// @ts-ignore
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue'
// @ts-ignore
import TransactionTable from '@/components/TransactionList/TransactionTable/TransactionTable.vue'
import { TransactionGroup } from '@/store/Transaction'

@Component({
  components: {
    ModalTransactionCosignature,
    ModalTransactionDetails,
    PageTitle,
    TransactionListFilters,
    TransactionTable,
  },
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      networkMosaic: 'mosaic/networkMosaic',
      // use partial+unconfirmed from store because
      // of ephemeral nature (websocket only here)
      confirmedTransactions: 'transaction/confirmedTransactions',
      partialTransactions: 'transaction/partialTransactions',
      unconfirmedTransactions: 'transaction/unconfirmedTransactions',
      displayedTransactionStatus: 'transaction/displayedTransactionStatus',
    }),
  },
})
export class TransactionListTs extends Vue {
  @Prop({
    default: '',
  })
  address: string

  @Prop({
    default: 10,
  })
  pageSize: number

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountModel}
   */
  public currentAccount: AccountModel

  /**
   * Network mosaic id
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * List of confirmed transactions (per-request)
   */
  public confirmedTransactions: Transaction[]

  /**
   * List of unconfirmed transactions (per-request)
   */
  public unconfirmedTransactions: Transaction[]

  /**
   * List of confirmed transactions (per-request)
   */
  public partialTransactions: Transaction[]

  /**
   * set the default to select all
   */
  public displayedTransactionStatus: TransactionGroup
  /**
   * The current page number
   * @var {number}
   */
  public currentPage: number = 1

  /**
   * Active transaction (in-modal)
   * @var {Transaction}
   */
  public activeTransaction: Transaction = null

  /**
   * Active bonded transaction (in-modal)
   * @var {AggregateTransaction}
   */
  public activePartialTransaction: AggregateTransaction = null

  /**
   * Whether the detail modal box is open
   * @var {boolean}
   */
  public isDisplayingDetails: boolean = false

  /**
   * Whether the cosignature modal box is open
   * @var {boolean}
   */
  public isAwaitingCosignature: boolean = false

  public getEmptyMessage() {
    return this.displayedTransactionStatus === TransactionGroup.all
      ? 'no_data_transactions'
      : `no_${this.displayedTransactionStatus}_transactions`
  }

  /// region computed properties getter/setter
  public get countPages(): number {
    if (!this.confirmedTransactions) return 0
    return Math.ceil([...this.confirmedTransactions].length / 10)
  }

  public get totalCountItems(): number {
    return this.getCurrentTabTransactions(this.displayedTransactionStatus).length
  }

  /**
   * Returns the transactions of the current page
   * from the getter that matches the provided tab name.
   * Undefined means the list is being loaded.
   * @param {TabName} tabName
   * @returns {Transaction[]}
   */
  public getCurrentPageTransactions(): Transaction[] {
    // get current tab transactions
    const transactions = this.getCurrentTabTransactions(this.displayedTransactionStatus)
    // get pagination params
    const start = (this.currentPage - 1) * this.pageSize
    const end = this.currentPage * this.pageSize
    // slice and return
    return [...transactions].slice(start, end)
  }

  /**
   * Returns all the transactions,
   * from the getter that matches the provided tab name
   * @param {TabName} group
   * @returns {Transaction[]}
   */
  public getCurrentTabTransactions(group: TransactionGroup): Transaction[] {
    if (group === TransactionGroup.confirmed) return this.confirmedTransactions
    if (group === TransactionGroup.unconfirmed) return this.unconfirmedTransactions
    if (group === TransactionGroup.partial) return this.partialTransactions
    if (group === TransactionGroup.all) {
      return [...this.unconfirmedTransactions, ...this.partialTransactions, ...this.confirmedTransactions]
    }

    return []
  }

  public get hasDetailModal(): boolean {
    return this.isDisplayingDetails
  }

  public set hasDetailModal(f: boolean) {
    this.isDisplayingDetails = f
  }

  public get hasCosignatureModal(): boolean {
    return this.isAwaitingCosignature
  }

  public set hasCosignatureModal(f: boolean) {
    this.isAwaitingCosignature = f
  }

  /// end-region computed properties getter/setter
  /**
   * Refresh transaction list
   * @return {void}
   */
  /* public async getTransactionListByOption(filter: TransactionGroup) {
    this.selectedOption = filter
  } */

  /**
   * Hook called when a transaction is clicked
   * @param {Transaction} transaction
   */
  public onClickTransaction(transaction: Transaction | AggregateTransaction) {
    if (transaction.hasMissingSignatures()) {
      this.activePartialTransaction = transaction as AggregateTransaction
      this.hasCosignatureModal = true
    } else {
      this.activeTransaction = transaction
      this.hasDetailModal = true
    }
  }

  public onCloseDetailModal() {
    this.hasDetailModal = false
    this.activeTransaction = undefined
  }

  public onCloseCosignatureModal() {
    this.hasCosignatureModal = false
    this.activePartialTransaction = undefined
  }

  /**
   * Hook called at each page change
   */
  public onPageChange(page: number): void {
    if (page > this.countPages) page = this.countPages
    else if (page < 1) page = 1
    this.currentPage = page
  }
}
