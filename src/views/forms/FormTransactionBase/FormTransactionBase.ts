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
  NetworkType,
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
    generationHash: 'network/generationHash',
    networkType: 'network/networkType',
    defaultFee: 'app/defaultFee',
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
   * Network generation hash
   * @var {string}
   */
  public generationHash: string

  /**
   * Network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Default fee setting
   * @var {number}
   */
  public defaultFee: number

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
   * Currently active multisig account's balances
   * @var {Mosaic[]}
   */
  public currentMultisigAccountMosaics: Mosaic[] = []

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
  @Watch('getTransactions')
  onTransactionsChange(transactions: Transaction[]) {
    this.$emit('onTransactionsChange', transactions)
  }
/// end-region property watches

  /**
   * Whether the transaction should be signed by a different
   * account than the active wallet.
   * @var {boolean}
   */
  public currentSigner: string

  /**
   * Whether the form is currently awaiting a signature
   * @var {boolean}
   */
  public isAwaitingSignature: boolean = false

  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    if (this.currentWallet) {
      this.currentSigner = this.currentWallet.objects.publicAccount.publicKey

      const address = this.currentWallet.objects.address.plain()
      try { this.$store.dispatch('wallet/REST_FETCH_MULTISIG', address) } catch(e) {}
      try { this.$store.dispatch('wallet/REST_FETCH_OWNED_NAMESPACES', address) } catch(e) {}
    }
  }

/// region computed properties getter/setter
  public get hasConfirmationModal(): boolean {
    return this.isAwaitingSignature
  }

  public set hasConfirmationModal(f: boolean) {
    this.isAwaitingSignature = f
  }
/// end-region computed properties getter/setter

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
  protected getTransactions(): Transaction[] {
    throw new Error('Getter method \'getTransactions()\' must be overloaded in derivate components.')
  }

  /**
   * Setter for transactions that will be staged
   * @param {Transaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: Transaction[]) {
    throw new Error('Setter method \'setTransactions()\' must be overloaded in derivate components.')
  }

  /**
   * Hook called when the confirmation modal must open
   * @see {FormTransactionBase}
   * @throws {Error} If not overloaded in derivate component
   */
  protected onShowConfirmationModal() {
    this.hasConfirmationModal = true
  }

  /**
   * Hook called when a signer is selected.
   * @param {string} signerPublicKey 
   */
  public onChangeSigner(signerPublicKey: string) {
    this.currentSigner = signerPublicKey
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'success'
   * @return {void}
   */
  public onConfirmationSuccess() {
    this.resetForm()
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS_ACCOUNT_UNLOCKED)
    this.hasConfirmationModal = false
    this.$emit('on-confirmation-success')
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'error'
   * @return {void}
   */
  public onConfirmationError(error: string) {
    this.$store.dispatch('notification/ADD_ERROR', error)
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'close'
   * @return {void}
   */
  public onConfirmationCancel() {
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')
    this.hasConfirmationModal = false
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {

    this.$store.dispatch('diagnostic/ADD_DEBUG', 'Adding transaction(s) to stage (prepared & unsigned): ' + this.getTransactions().length)

    // - add transactions to stage (to be signed)
    await Promise.all(this.getTransactions().map(
      async (transaction) => {
        await this.$store.dispatch(
          'wallet/ADD_STAGED_TRANSACTION',
          transaction
        )
      }))

    // - open signature modal
    this.onShowConfirmationModal()
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
