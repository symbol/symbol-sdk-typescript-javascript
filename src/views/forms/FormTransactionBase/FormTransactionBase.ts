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
  Transaction,
  MosaicInfo,
  PublicAccount,
  NamespaceId,
  NetworkType,
} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {WalletService} from '@/services/WalletService'
import {TransactionService} from '@/services/TransactionService'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {ValidationObserver} from 'vee-validate'

@Component({
  computed: {...mapGetters({
    generationHash: 'network/generationHash',
    networkType: 'network/networkType',
    defaultFee: 'app/defaultFee',
    currentWallet: 'wallet/currentWallet',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    currentWalletMultisigInfo: 'wallet/currentWalletMultisigInfo',
    isCosignatoryMode: 'wallet/isCosignatoryMode',
    networkMosaic: 'mosaic/networkMosaic',
    stagedTransactions: 'wallet/stagedTransactions',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
    mosaicsNames: 'mosaic/mosaicsNames',
    namespacesNames: 'namespace/namespacesNames',
    currentSignerMultisigInfo: 'wallet/currentSignerMultisigInfo',
  })},
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
   * Current wallet multisig info
   * @type {MultisigAccountInfo}
   */
  public currentWalletMultisigInfo: MultisigAccountInfo

  /**
   * Whether the form is in cosignatory mode (cosigner selected)
   * @var {boolean}
   */
  public isCosignatoryMode: boolean

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

  /**
   * Public key of the current signer
   * @var {any}
   */
  public currentSigner: PublicAccount

  /**
   * Current signer multisig info
   * @var {MultisigAccountInfo}
   */
  public currentSignerMultisigInfo: MultisigAccountInfo

  /**
   * Type the ValidationObserver refs 
   * @type {{
   *     observer: InstanceType<typeof ValidationObserver>
   *   }}
   */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

/// end-region store getters

/// region property watches
  @Watch('signers')
  onSignersChange(signers: {publicKey: string, label: string}[] = []) {
    this.resetForm()
  }

  // @Watch('getTransactions')
  // onTransactionsChange(transactions: Transaction[]) {
  //   this.$emit('onTransactionsChange', transactions)
  // }
/// end-region property watches

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
  public async mounted() {
    if (this.currentWallet) {
      this.currentSigner = this.currentWallet.objects.publicAccount
      const address = this.currentWallet.objects.address.plain()
      try { this.$store.dispatch('wallet/REST_FETCH_OWNED_NAMESPACES', address) } catch(e) {}
    }
  }

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async created() {
    this.factory = new TransactionFactory(this.$store)
    this.resetForm()
  }

  /**
   * Hook called when the component is being destroyed (before)
   * @return {void}
   */
  public beforeDestroy() {
    this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {model: this.currentWallet})
  }

/// region computed properties getter/setter
  get signers(): {publicKey: string, label: string}[] {
    return this.getSigners()
  }

  /**
   * Current signer's multisig accounts
   * @readonly
   * @type {{publicKey: string, label: string}[]}
   */
  get multisigAccounts(): {publicKey: string, label: string}[] {
    const signers = this.getSigners()
    if (!signers.length || !this.currentWallet) {
      return []
    }

    // Signers are irrelevant to multisig accounts as they can't initiate transactions
    if (this.currentWalletMultisigInfo && this.currentWalletMultisigInfo.isMultisig()) {
      return []
    }

    // all signers except current wallet
    return [...signers].splice(1)
  }

  get hasConfirmationModal(): boolean {
    return this.isAwaitingSignature
  }

  set hasConfirmationModal(f: boolean) {
    this.isAwaitingSignature = f
  }
/// end-region computed properties getter/setter

  /**
   * Reset the form with properties
   * @throws {Error} If not overloaded in derivate component
   */
  protected resetForm() {
    throw new Error('Method \'resetForm()\' must be overloaded in derivate components.')
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected isAggregateMode(): boolean {
    throw new Error('Method \'isAggregateMode()\' must be overloaded in derivate components.')
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
    this.currentSigner = PublicAccount.createFromPublicKey(signerPublicKey, this.networkType)

    const isCosig = this.currentWallet.values.get('publicKey') !== signerPublicKey
    const payload = !isCosig ? this.currentWallet : {
      networkType: this.networkType,
      publicKey: signerPublicKey
    }

    this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {model: payload})
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {
    const transactions = this.getTransactions()

    this.$store.dispatch('diagnostic/ADD_DEBUG', 'Adding ' + transactions.length + ' transaction(s) to stage (prepared & unsigned)')

    // - check whether transactions must be aggregated
    // - also set isMultisig flag in case of cosignatory mode
    if (this.isAggregateMode()) {
      this.$store.commit('wallet/stageOptions', {
        isAggregate: true,
        isMultisig: this.isCosignatoryMode,
      })
    }

    // - add transactions to stage (to be signed)
    await Promise.all(transactions.map(
      async (transaction) => {
        await this.$store.dispatch(
          'wallet/ADD_STAGED_TRANSACTION',
          transaction
        )
      }))

    // - open signature modal
    this.onShowConfirmationModal()

    // resets form validation
    this.$nextTick(() => {
      this.$refs.observer.reset()
    })
  }

  /**
   * Hook called when the child component ModalTransactionConfirmation triggers
   * the event 'success'
   * @return {void}
   */
  public async onConfirmationSuccess(issuer: PublicAccount) {
    this.resetForm()
    this.hasConfirmationModal = false
    this.$emit('on-confirmation-success')

    //XXX does the user want to broadcast NOW ?

    // - read transaction stage options
    const options = this.$store.getters['wallet/stageOptions']
    const service = new TransactionService(this.$store)
    let results: BroadcastResult[] = []

    // - case 1 "announce partial"
    if (options.isMultisig) {
      results = await service.announcePartialTransactions(issuer)
    }
    // - case 2 "announce complete"
    else {
      results = await service.announceSignedTransactions()
    }

    // - notify about errors and exit
    const errors = results.filter(result => false === result.success)
    if (errors.length) {
      errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
      return ;
    }

    // - notify about broadcast success (_transactions now unconfirmed_)
    const message = options.isMultisig
      ? 'success_transaction_partial_announced'
      : 'success_transactions_announced'
    this.$store.dispatch('notification/ADD_SUCCESS', message)
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

  /**
   * Get a list of known signers given a `currentWallet`
   * @return {{publicKey: string, label:string}[]}
   */
  protected getSigners(): {publicKey: string, label: string}[] {
    if (!this.currentWallet) return []

    const self = [
      {
        publicKey: this.currentWallet.values.get('publicKey'),
        label: this.currentWallet.values.get('name'),
      },
    ]

    const multisigInfo = this.currentWalletMultisigInfo

    if (!multisigInfo) return self

    // in case "self" is a multi-signature account
    if (multisigInfo && multisigInfo.isMultisig()) {
      self[0].label = self[0].label + this.$t('label_postfix_multisig')
    }

    // add multisig accounts of which "self" is a cosignatory
    if (multisigInfo) {
      const service = new WalletService(this.$store)
      return self.concat(...multisigInfo.multisigAccounts.map(
        ({publicKey}) => ({
          publicKey,
          label: service.getWalletLabel(publicKey, this.networkType) + this.$t('label_postfix_multisig'),
        })))
    }

    return self
  }
}
