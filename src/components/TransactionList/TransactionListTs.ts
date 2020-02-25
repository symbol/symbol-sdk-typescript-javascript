/**
 * Copyright 2020 NEM Foundation (https://nem.io)
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
import {mapGetters} from 'vuex'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Transaction, MosaicId} from 'nem2-sdk'
import {of, Observable} from 'rxjs'
import {pluck, concatMap} from 'rxjs/operators'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {TransactionService} from '@/services/TransactionService'

// child components
// @ts-ignore
import ModalTransactionDetails from '@/views/modals/ModalTransactionDetails/ModalTransactionDetails.vue'
// @ts-ignore
import TransactionTable from '@/components/TransactionList/TransactionTable/TransactionTable.vue'
// @ts-ignore
import PageTitle from '@/components/PageTitle/PageTitle.vue'

@Component({
  components: {
    ModalTransactionDetails,
    TransactionTable,
    PageTitle,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
    networkMosaic: 'mosaic/networkMosaic',
    currentHeight: 'network/currentHeight',
    // use partial+unconfirmed from store because
    // of ephemeral nature (websocket only here)
    confirmedTransactions: 'wallet/confirmedTransactions',
    partialTransactions: 'wallet/partialTransactions',
    unconfirmedTransactions: 'wallet/unconfirmedTransactions',
  })},
})
export class TransactionListTs extends Vue {

  @Prop({
    default: '',
  }) address: string

  @Prop({
    default: 10,
  }) pageSize: number

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Active account's wallets
   * @see {Store.Wallet}
   * @var {WalletsModel[]}
   */
  public knownWallets: WalletsModel[]

  /**
   * Network block height
   * @see {Store.Network}
   * @var {number}
   */
  public currentHeight: number

  /**
   * Network mosaic id
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * List of confirmed transactions (per-request)
   * @var {Transaction[]}
   */
  public confirmedTransactions: Transaction[]

  /**
   * List of unconfirmed transactions (websocket only)
   * @see {Store.Wallet}
   * @var {Transaction[]}
   */
  public unconfirmedTransactions: Transaction[]

  /**
   * List of confirmed transactions (websocket only)
   * @see {Store.Wallet}
   * @var {Transaction[]}
   */
  public partialTransactions: Transaction[]

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService

  /**
   * The current tab
   * @var {string} One of 'confirmed', 'unconfirmed' or 'partial'
   */
  public currentTab: string = 'confirmed'

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
   * Whether the detail modal box is open
   * @var {boolean}
   */
  public isDisplayingDetails: boolean = false

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async created() {
    this.service = new TransactionService(this.$store)

    // if (!this.confirmedTransactions || !this.confirmedTransactions.length) {
    //  await this.refresh()
    // }
  }

/// region property watches
  // @Watch('totalCountItems')
  // onCountItemsChange(totalCount: number) {
  //   this.refresh()
  // }
/// end-region property watches

  /// region computed properties getter/setter
  public get countPages(): number {
    if (!this.confirmedTransactions) return 0
    return Math.ceil([...this.confirmedTransactions].length / 10)
  }

  public get totalCountItems(): number {
    return [...this.confirmedTransactions].length
  }

  public get currentPageTransactions(): {total: number, items: Transaction[]} {
    const start = (this.currentPage - 1) * this.pageSize
    const end = this.currentPage * this.pageSize
    const total = this.totalCountItems

    if (!this.confirmedTransactions || !total) {
      return {total: 0, items: []}
    }

    const items = [...this.confirmedTransactions].reverse().slice(start, end)
    return {
      total,
      items
    }
  }

  public currentPartialTransactions(): {total: number, items: Transaction[]} {
    if (!this.partialTransactions) return {total: 0, items: []}

    const items = [...this.partialTransactions]
    return {
      total: items.length,
      items
    }
  }

  public currentUnconfirmedTransactions(): {total: number, items: Transaction[]} {
    if (!this.unconfirmedTransactions) return {total: 0, items: []}

    const items = [...this.unconfirmedTransactions]
    return {
      total: items.length,
      items
    }
  }

  public get hasDetailModal(): boolean {
    return this.isDisplayingDetails
  }

  public set hasDetailModal(f: boolean) {
    this.isDisplayingDetails = f
  }
  /// end-region computed properties getter/setter

  /**
   * Refresh transaction list
   * @return {void}
   */
  public async refresh(grp?) {
    const group = grp ? grp : this.currentTab

    console.log("refreshing...")
    await this.$store.dispatch('wallet/REST_FETCH_TRANSACTIONS', {
      group: group,
      address: this.currentWallet.objects.address.plain(),
      pageSize: 100,
    })

    const newPage = this.currentPageTransactions
    console.log("transactions: ", newPage)
  }

  /**
   * Hook called when a transaction is clicked
   * @param {Transaction} transaction 
   */
  public onClickTransaction(transaction: Transaction) {
    this.activeTransaction = transaction
    this.hasDetailModal = true
  }

  public onCloseDetailModal() {
    this.hasDetailModal = false
    this.activeTransaction = undefined
  }

  /**
   * Hook called at each tab change
   */
  onTabChange(tab: string): void {
    this.currentTab = tab
  }

  /**
   * Hook called at each page change
   */
  onPageChange(page: number): void {
    if (page > this.countPages) page = this.countPages
    else if (page < 1) page = 1

    this.currentPage = page
  }
}
