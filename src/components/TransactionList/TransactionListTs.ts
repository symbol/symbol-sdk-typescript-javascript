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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Transaction, TransactionType, NamespaceId, Address, TransferTransaction, MosaicId} from 'nem2-sdk'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {TransactionService} from '@/services/TransactionService'

// child components
// @ts-ignore
import ModalTransactionDetails from '@/views/modals/ModalTransactionDetails/ModalTransactionDetails.vue'
// @ts-ignore
import TransactionRows from '@/components/TransactionList/TransactionRows/TransactionRows.vue'
// @ts-ignore
import PageTitle from '@/components/PageTitle/PageTitle.vue'

@Component({
  components: {
    ModalTransactionDetails,
    TransactionRows,
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
    partialTransactions: 'wallet/partialTransactions',
    unconfirmedTransactions: 'wallet/unconfirmedTransactions',
  })},
})
export class TransactionListTs extends Vue {

  @Prop({
    default: ''
  }) address: string

  @Prop({
    default: 10
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
   * @see {Store.Wallet}
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
   * Hook called when the component is mounted
   * @return {void}
   */
  public async created() {
    this.service = new TransactionService(this.$store)
    this.refresh()
  }

/// region computed properties getter/setter
  public get countPages(): number {
    return Math.ceil(this.confirmedTransactions.length / 10)
  }

  public get currentPageTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize
    const end = this.currentPage * this.pageSize

    return !this.confirmedTransactions || !this.confirmedTransactions.length 
        ? [] 
        : this.confirmedTransactions.slice(start, end)
  }

  public set currentPageTransactions(transactions: Transaction[]) {
    this.confirmedTransactions = transactions
  }
/// end-region computed properties getter/setter

  /**
   * Refresh transaction list
   * @return {void}
   */
  public async refresh(grp?) {
    const group = grp ? grp : this.currentTab
    const transactions = await this.$store.dispatch('wallet/REST_FETCH_TRANSACTIONS', {
      group: group,
      address: this.currentWallet.objects.address.plain(),
      pageSize: 100
    })

    // "confirmTransactions" is the only with setter! (others are one-way from store.)
    if ('confirmed' === group) {
      this.currentPageTransactions = transactions || []
    }
  }

  /**
   * Hook called when a transaction is clicked
   * @param {Transaction} transaction 
   */
  public onClickTransaction(transaction: Transaction) {
    this.activeTransaction = transaction
  }

  /**
   * 
   */
  onTabChange(tab: string) {
    this.currentTab = tab
  }

  /**
   * 
   */
  onPageChange(page: number) {
    if (page > this.countPages) page = this.countPages
    else if (page < 1) page = 1

    this.currentPage = page
  }

  /*
  get wallet() {
    return this.activeAccount.wallet
  }

  get transactionsLoading() {
    return (this.mode && this.mode === TransactionCategories.TO_COSIGN) ? false : this.app.transactionsLoading
  }

  get transactionList() {
    if (this.mode && this.mode === TransactionCategories.TO_COSIGN) {
      return this.activeAccount.transactionsToCosign || []
    }

    const {transactionsToCosign, transactionList} = this.activeAccount
    return [ ...transactionsToCosign, ...transactionList ]
  }

  get mosaicList() {
    return this.activeAccount.mosaics
  }

  get slicedTransactionList() {
    const start = (this.page - 1) * this.pageSize
    const end = this.page * this.pageSize
    return [...this.transactionList].slice(start, end)
  }

  get currentHeight() {
    return this.app.networkProperties.height
  }

  get namespaces() {
    return this.activeAccount.namespaces
  }


  get pageTitle() {
    return this.mode === TransactionCategories.TO_COSIGN
      ? 'Transactions_to_cosign'
      : 'transaction_record'
  }

  get explorerBasePath() {
    return this.app.explorerBasePath
  }

  getName(namespaceId: NamespaceId) {
    const hexId = namespaceId.toHex()
    const namespace = this.namespaces.find(({hex}) => hexId === hex)
    if (namespace === undefined) return hexId
    return namespace.name
  }

  renderHeightAndConfirmation(transactionHeight: number): string {
    if (transactionHeight === 0) return null
    const {currentHeight} = this
    if (!currentHeight) return `${transactionHeight}`

    const confirmations = currentHeight - transactionHeight + 1
    /** Prevents a reactivity glitch /
    if (confirmations < 0) return `${transactionHeight}`

    const {networkConfirmations} = defaultNetworkConfig
    if (confirmations > networkConfirmations) return `${transactionHeight}`
    return `(${confirmations}/${networkConfirmations}) - ${transactionHeight.toLocaleString()}`
  }

  // @TODO: move out from there
  miniHash(hash: string): string {
    return `${hash.substring(0, 18).toLowerCase()}***${hash.substring(42).toLowerCase()}`
  }

  // @TODO: Changing tab should reset the newly selected tab's pagination to 1
  async changePage(page) {
    this.page = page
    this.scrollTop()
  }

  divScroll(div) {
    this.scroll = div
  }

  scrollTop() {
    this.scroll.target.scrollTop = 0
  }

  confirmViaTransactionConfirmation() {
    try {
      signAndAnnounce({
        transaction: this.activeTransaction.rawTx,
        store: this.$store,
      })
    } catch (error) {
      console.error('TransactionListTs -> confirmViaTransactionConfirmation -> error', error)
    }
  }

  transactionClicked(transaction: FormattedTransaction) {
    this.activeTransaction = transaction

    if (this.activeTransaction.toCosign) {
      if (transaction instanceof FormattedAggregateBonded
                && transaction.alreadyCosignedBy(Address.createFromRawAddress(this.wallet.address))) {
        this.showDialog = true
        return
      }
      return this.confirmViaTransactionConfirmation()
    }
    this.showDialog = true
  }

  openExplorer(transactionHash) {
    const {explorerBasePath} = this
    return explorerBasePath + transactionHash
  }
  */
}
