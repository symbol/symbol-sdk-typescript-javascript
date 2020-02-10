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
import {
  MosaicId, 
  Mosaic,
  MultisigAccountInfo,
  TransferTransaction,
  Transaction,
  TransactionType,
  MosaicInfo,
  Address,
  Message,
  PublicAccount,
  RawUInt64,
  NamespaceId,
  UInt64,
} from 'nem2-sdk'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {Formatters} from '@/core/utils/Formatters'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {ViewTransferTransaction} from '@/core/transactions/ViewTransferTransaction'
import {NotificationType} from '@/core/utils/NotificationType'

@Component({
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    currentMultisigInfo: 'wallet/currentMultisigInfo',
    networkMosaic: 'mosaic/networkMosaic',
    stagedTransactions: 'wallet/stagedTransactions',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
    mosaicsNames: 'mosaic/mosaicsNames',
    namespacesNames: 'namespace/namespacesNames',
  })}
})
export class FormTransactionBase extends Vue {
/// region store getters
    /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public currentWalletMosaics: Mosaic[]

  /**
   * Currently active wallet's multisig info
   * @var {MultisigAccountInfo}
   */
  public currentMultisigInfo: MultisigAccountInfo

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Currently staged transactions
   * @var {Transaction[]}
   */
  public stagedTransactions: Transaction[]

  /**
   * List of known mosaics
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /**
   * List of known mosaics names
   * @var {any}
   */
  public mosaicsNames: any

  /**
   * List of known namespaces names
   * @var {any}
   */
  public namespacesNames: any
/// end-region store getters

/// region property watches
  @Watch('transactions')
  onTransactionsChange(transactions: Transaction[]) {
    this.$emit('onTransactionsChange', transactions)
  }
/// end-region property watches

  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory

  /**
   * Whether the form is currently awaiting a signature
   * @var {boolean}
   */
  public isAwaitingSignature: boolean = false

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    if (this.currentWallet) {
      const address = this.currentWallet.objects.address.plain()
      try { this.$store.dispatch('wallet/REST_FETCH_MULTISIG', address) } catch(e) {}
      try { this.$store.dispatch('wallet/REST_FETCH_OWNED_NAMESPACES', address) } catch(e) {}
    }
  }

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created() {
    this.factory = new TransactionFactory(this.$store)
    this.resetForm()
  }

  /**
   * Reset the form with properties
   * @throws {Error} If not overloaded in derivate component
   */
  protected resetForm() {
    throw new Error('Method \'resetForm()\' must be overloaded in derivate components.')
  }

  /**
   * Getter for transactions that will be staged
   * @throws {Error} If not overloaded in derivate component
   */
  protected get transactions(): Transaction[] {
    throw new Error('Getter method \'get transactions()\' must be overloaded in derivate components.')
  }

  /**
   * Setter for transactions that will be staged
   * @param {Transaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected set transactions(transactions: Transaction[]) {
    throw new Error('Setter method \'set transactions()\' must be overloaded in derivate components.')
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'success'
   * @return {void}
   */
  public onConfirmationSuccess() {
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'error'
   * @return {void}
   */
  public onConfirmationError(error: string) {
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')
    this.$store.dispatch('notification/ADD_ERROR', error)
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {
    // - add transactions to stage (to be signed)
    await this.transactions.map(
      async (transaction) => await this.$store.dispatch(
        'wallet/ADD_STAGED_TRANSACTION',
        transaction
      )
    )

    // - open signature modal
    this.isAwaitingSignature = true
  }

  /**
   * internal helper for mosaic names
   * @param {Mosaic} mosaic 
   * @return {string}
   */
  protected getMosaicName(mosaicId: MosaicId | NamespaceId): string {
    if (this.mosaicsNames.hasOwnProperty(mosaicId.toHex())) {
      return this.mosaicsNames[mosaicId.toHex()]
    }
    else if (this.namespacesNames.hasOwnProperty(mosaicId.toHex())) {
      return this.namespacesNames[mosaicId.toHex()]
    }

    return mosaicId.toHex()
  }

  /**
   * internal helper for mosaic divisibility
   * @param {Mosaic} mosaic 
   * @return {string}
   */
  protected getDivisibility(mosaicId: MosaicId): number {
    const info = this.mosaicsInfo.find(i => i.id.equals(mosaicId))
    if (undefined === info) {
      return 6 // XXX default divisibility?
    }

    return info.divisibility
  }

  /**
   * internal helper for absolute fee amount
   * @param {number} fee 
   * @return {number}
   */
  protected getAbsoluteFee(fee: number): number {
    const divisibility = this.getDivisibility(this.networkMosaic)
    return fee * Math.pow(10, divisibility)
  }
}
