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
} from 'nem2-sdk'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {Formatters} from '@/core/utils/Formatters'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {TransferTransactionParams} from '@/core/transactions/TransferTransactionParams'
import {NotificationType} from '@/core/utils/NotificationType'

// configuration
import feesConfig from '@/../config/fees.conf.json'

// child components
import {ValidationObserver} from 'vee-validate'
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import MosaicAttachmentDisplay from '@/components/MosaicAttachmentDisplay/MosaicAttachmentDisplay.vue'
// @ts-ignore
import MosaicAttachmentInput from '@/components/MosaicAttachmentInput/MosaicAttachmentInput.vue'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'


type MosaicAttachmentType = {id: MosaicId, mosaicHex: string, name: string, amount: number}

@Component({
  components: {
    AmountInput,
    ButtonAdd,
    FormWrapper,
    MaxFeeSelector,
    MessageInput,
    ModalTransactionConfirmation,
    MosaicAttachmentDisplay,
    MosaicAttachmentInput,
    MosaicSelector,
    RecipientInput,
    SignerSelector,
    ValidationObserver,
  },
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
export class FormTransferCreationTs extends Vue {
  // @TODO: check if props needed
  @Prop({
    default: null
  }) signer: PublicAccount

  @Prop({
    default: null
  }) recipient: Address

  @Prop({
    default: null
  }) mosaics: Mosaic[]

  @Prop({
    default: null
  }) message: Message

  @Prop({
    default: false
  }) disableSubmit: boolean

  @Prop({
    default: false
  }) hideSigner: boolean
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

  /**
   * Formatters helpers
   * @var {Formatters}
   */
  public formatters = Formatters

  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    signerPublicKey: '',
    attachedMosaics: [],
    recipientRaw: '',
    recipient: null,
    selectedMosaicHex: '',
    relativeAmount: 0,
    messagePlain: '',
    maxFee: 0
  }

  /**
   * Whether the component is awaiting signature
   * @var {boolean}
   */
  public isAwaitingSignature: boolean = false

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async created() {
    this.factory = new TransactionFactory(this.$store)

    // - set default form values
    this.formItems.signerPublicKey = !!this.signer ? this.signer.publicKey : this.currentWallet.values.get('publicKey')
    this.formItems.selectedMosaicHex = this.networkMosaic.toHex()
    this.formItems.recipientRaw = !!this.recipient ? this.recipient.plain() : ''
    this.formItems.recipient = !!this.recipient ? this.recipient : null
    this.formItems.attachedMosaics = !!this.mosaics && this.mosaics.length ? this.mosaicsToAttachments(this.mosaics) : []
    this.formItems.messagePlain = !!this.message ? Formatters.hexToUtf8(this.message.payload) : ''

    // - maxFee must be absolute
    const info = this.mosaicsInfo.find(i => i.id.toHex() === this.formItems.selectedMosaicHex)
    const div = info ? info.divisibility : 0
    this.formItems.maxFee = feesConfig['single'].find(s => s.speed === 'NORMAL').value * Math.pow(10, div)

    // - re-populate form if transaction staged
    if (this.stagedTransactions.length) {
      const transfer = this.stagedTransactions.find(staged => staged.type === TransactionType.TRANSFER)
      this.transaction = transfer as TransferTransaction
    }
  }

/// region computed properties getter/setter
  public get attachedMosaics(): MosaicAttachmentType[] {
    if (this.mosaics && this.mosaics.length) {
      return this.mosaicsToAttachments(this.mosaics)
    }

    return this.formItems.attachedMosaics || []
  }

  public set attachedMosaics(attachments: MosaicAttachmentType[]) {
    this.formItems.attachedMosaics = attachments
  }

  protected get transaction(): TransferTransaction {
    try {
      // - read form
      const data = {
        recipient: this.instantiatedRecipient,
        mosaics: this.attachedMosaics.map(
          (spec: {mosaicHex: string, amount: number}): {mosaicHex: string, amount: number} => ({
            mosaicHex: spec.mosaicHex,
            amount: spec.amount // amount is relative
          })),
        message: this.formItems.messagePlain,
      }

      // - prepare transaction parameters
      const params = TransferTransactionParams.create(data, this.mosaicsInfo)

      // - prepare transfer transaction
      return this.factory.build('TransferTransaction', params)
    } catch (error) {
      return null
    }

  }

  protected set transaction(transaction: TransferTransaction) {
    // - populate recipient
    this.formItems.recipientRaw = transaction.recipientAddress instanceof Address
                                ? transaction.recipientAddress.plain()
                                : (transaction.recipientAddress as NamespaceId).toHex()

    // - populate attached mosaics
    this.attachedMosaics = this.mosaicsToAttachments(transaction.mosaics)

    // - convert and populate message
    this.formItems.messagePlain = Formatters.hexToUtf8(transaction.message.payload)

    // - populate maxFee
    this.formItems.maxFee = transaction.maxFee.compact()
  }

  /**
   * Recipient used in the transaction
   * @readonly
   * @protected
   * @type {(Address | NamespaceId)}
   */
  protected get instantiatedRecipient(): Address | NamespaceId {
    const {recipientRaw} = this.formItems
    if (!recipientRaw) return null
    if ([ 40, 46 ].includes(recipientRaw.length)) {
      return Address.createFromRawAddress(recipientRaw)
    }

    return new NamespaceId(recipientRaw)
  }
/// end-region computed properties getter/setter

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
   * Hook called when the child component MosaicAttachmentDisplay triggers
   * the event 'delete'
   * @return {void}
   */
  public onDeleteMosaic(id: MosaicId) {
    const updatedAttachedMosaics = [...this.formItems.attachedMosaics]
      .filter(({mosaicHex}) => mosaicHex !== id.toHex())
    Vue.set(this.formItems, 'attachedMosaics', updatedAttachedMosaics)
  }

  /**
   * Hook called when the child component ButtonAdd triggers
   * the event 'click'
   * @return {void}
   */
  public async onAddMosaic(formItems: {mosaicHex: string, amount: number}) {
    // - update form data
    const attachments = [].concat(...this.formItems.attachedMosaics)
    const id = new MosaicId(RawUInt64.fromHex(formItems.mosaicHex))
    const exists = attachments.findIndex(m => m.id.equals(id))
    if (-1 !== exists) {
      // - mosaic was already added, only increment amount
      attachments[exists].amount += formItems.amount // amount is relative
    }
    else {
      // - mosaic newly added
      attachments.push({
        id: id,
        mosaicHex: formItems.mosaicHex,
        name: this.getMosaicName(id),
        amount: formItems.amount, // amount is relative
      })
    }

    this.attachedMosaics = attachments
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {
    await this.$store.dispatch('wallet/ADD_STAGED_TRANSACTION', this.transaction)
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

  protected mosaicsToAttachments(mosaics: Mosaic[]): MosaicAttachmentType[] {
    return mosaics.map(
      mosaic => {
        const info = this.mosaicsInfo.find(i => i.id.equals(mosaic.id))
        const div = info ? info.divisibility : 0
        // amount will be converted to RELATIVE
        return {
          id: mosaic.id as MosaicId, //XXX resolve mosaicId from namespaceId
          mosaicHex: mosaic.id.toHex(),
          name: this.getMosaicName(mosaic.id),
          amount: mosaic.amount.compact() / Math.pow(10, div)
        }
      })
  }

  @Watch('transaction')
  onTransactionChange(newTransaction: TransferTransaction) {
    this.$emit('onTransactionChange', {
      transaction: newTransaction,
      balanceEntries: this.attachedMosaics,
    })
  }
}
