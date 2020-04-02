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
  TransferTransaction,
  Address,
  Message,
  PublicAccount,
  NamespaceId,
  UInt64,
} from 'symbol-sdk'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {Formatters} from '@/core/utils/Formatters'
import {ViewTransferTransaction, TransferFormFieldsType} from '@/core/transactions/ViewTransferTransaction'
import {FormTransactionBase} from '@/views/forms/FormTransactionBase/FormTransactionBase'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {AddressValidator, AliasValidator} from '@/core/validation/validators'
import {MosaicInputsManager} from './MosaicInputsManager'
import {MosaicService} from '@/services/MosaicService'
import {ITransactionEntry} from '@/views/pages/dashboard/invoice/DashboardInvoicePageTs'

// child components
import {ValidationObserver} from 'vee-validate'
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import MosaicAttachmentInput from '@/components/MosaicAttachmentInput/MosaicAttachmentInput.vue'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

export interface MosaicAttachment {
  mosaicHex: string
  amount: number // Relative amount
  id?: MosaicId
  name?: string
  uid?: number
}

@Component({
  components: {
    AmountInput,
    FormWrapper,
    MessageInput,
    ModalTransactionConfirmation,
    MosaicAttachmentInput,
    MosaicSelector,
    RecipientInput,
    SignerSelector,
    ValidationObserver,
    MaxFeeAndSubmit,
    FormRow,
  },
  computed: {...mapGetters({currentSignerMosaics: 'wallet/currentSignerMosaics'})},
})
export class FormTransferTransactionTs extends FormTransactionBase {
  /// region component properties
  @Prop({
    default: null,
  }) signer: PublicAccount

  @Prop({
    default: null,
  }) recipient: Address

  @Prop({
    default: null,
  }) mosaics: Mosaic[]

  @Prop({
    default: null,
  }) message: Message

  @Prop({
    default: false,
  }) disableSubmit: boolean

  @Prop({
    default: false,
  }) hideSigner: boolean
  /// end-region component properties

  /**
   * Formatters helpers
   * @var {Formatters}
   */
  public formatters = Formatters

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
    maxFee: 0,
  }

  protected mosaicInputsManager = MosaicInputsManager.initialize([])

  /**
   * Current signer mosaics
   * @protected
   * @type {Mosaic[]}
   */
  protected currentSignerMosaics: Mosaic[]

  /**
   * Reset the form with properties
   * @return {void}
   */
  protected resetForm() {
    // - reset attached mosaics
    this.formItems.attachedMosaics = []

    // - set default form values
    this.formItems.signerPublicKey = !!this.signer ? this.signer.publicKey : this.currentWallet.values.get('publicKey')
    this.formItems.selectedMosaicHex = this.networkMosaic.toHex()
    // default currentWallet Address to recipientRaw
    if(this.$route.path.indexOf('invoice') > -1){
      this.formItems.recipientRaw = this.currentWallet.objects.address.plain() || ''
    }else{
      this.formItems.recipientRaw = !!this.recipient ? this.recipient.plain() : ''
    }
    this.formItems.recipient = !!this.recipient ? this.recipient : null

    const attachedMosaics = !!this.mosaics && this.mosaics.length
      ? this.mosaicsToAttachments(this.mosaics)
      : [{mosaicHex: this.networkMosaic.id.toHex(), amount: 0, uid: 1}]

    this.formItems.messagePlain = !!this.message ? Formatters.hexToUtf8(this.message.payload) : ''

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee

    // - initialize mosaics input manager
    this.mosaicInputsManager = MosaicInputsManager.initialize(this.currentMosaicList())

    // - set attachedMosaics and allocate slots
    Vue.nextTick(() => {
      attachedMosaics.forEach(
        (attachedMosaic, index) => {
          this.mosaicInputsManager.setSlot(attachedMosaic.mosaicHex, attachedMosaic.uid)
          Vue.set(this.formItems.attachedMosaics, index, attachedMosaic)
        },
      )
    })
    this.triggerChange()
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @see {FormTransactionBase}
   * @return {boolean} True if creating transfer for multisig
   */
  protected isAggregateMode(): boolean {
    return this.isCosignatoryMode
  }

  /**
   * Returns the mosaic list of the current wallet or current signer  
   * depending on the multisig situation
   * @protected
   * @returns 
   */
  protected currentMosaicList(): Mosaic[] {
    if (!this.networkMosaic) return [] // @TODO: quickfix    

    // get mosaic list according to the multisig status
    const mosaics = this.isCosignatoryMode ? this.currentSignerMosaics : this.currentWalletMosaics
    const defaultedMosaicList = mosaics && mosaics.length 
      ? mosaics
      : [new Mosaic(this.networkMosaic, UInt64.fromUint(0))]

    // get mosaicService
    const mosaicService = new MosaicService(this.$store)

    // filter out expired mosaics
    const currentMosaicList = defaultedMosaicList.filter(mosaic => {
      // get mosaic info
      const mosaicInfo = this.mosaicsInfoByHex[mosaic.id.toHex()]
      // skip if mosaic info is not available
      if (!mosaicInfo) return false

      // calculate expiration
      const expiration = mosaicService.getExpiration(mosaicInfo)
      // skip if mosaic is expired
      if (expiration === 'expired') return false

      return true
    })

    // add eventual new mosaics in the mosaic inputs manager
    if (this.mosaicInputsManager) this.mosaicInputsManager.addMosaics(currentMosaicList)
    return currentMosaicList
  }

  /**
   * Getter for TRANSFER transactions that will be staged
   * @see {FormTransactionBase}
   * @return {TransferTransaction[]}
   */
  protected getTransactions(): TransferTransaction[] {
    this.factory = new TransactionFactory(this.$store)
    try {
      // - read form
      const data: TransferFormFieldsType = {
        recipient: this.instantiatedRecipient,
        mosaics: this.formItems.attachedMosaics
          .filter(({uid}) => uid) // filter out null values
          .map((spec: MosaicAttachment): MosaicAttachment => ({
            mosaicHex: spec.mosaicHex,
            amount: spec.amount, // amount is relative
          })),
        message: this.formItems.messagePlain,
        maxFee: UInt64.fromUint(this.formItems.maxFee),
      }

      // - prepare transaction parameters
      let view = new ViewTransferTransaction(this.$store)
      view = view.parse(data)

      // - prepare transfer transaction
      return [this.factory.build(view)]
    } catch (error) {
      console.error('Error happened in FormTransferTransaction.transactions(): ', error)
    }
  }

  /**
   * Setter for TRANSFER transactions that will be staged
   * @see {FormTransactionBase}
   * @param {TransferTransaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: TransferTransaction[]) {
    // - this form creates only 1 transaction
    const transaction = transactions.shift()

    // - populate recipient
    this.formItems.recipientRaw = transaction.recipientAddress instanceof Address
      ? transaction.recipientAddress.plain()
      : (transaction.recipientAddress as NamespaceId).fullName

    // - populate attached mosaics
    this.formItems.attachedMosaics = this.mosaicsToAttachments(transaction.mosaics)

    // - convert and populate message
    this.formItems.messagePlain = Formatters.hexToUtf8(transaction.message.payload)

    // - populate maxFee
    this.formItems.maxFee = transaction.maxFee.compact()
  }

  /// region computed properties getter/setter
  /**
   * Recipient used in the transaction
   * @readonly
   * @protected
   * @type {(Address | NamespaceId)}
   */
  protected get instantiatedRecipient(): Address | NamespaceId {
    const {recipientRaw} = this.formItems
    if (AddressValidator.validate(recipientRaw)) {
      return Address.createFromRawAddress(recipientRaw)
    } else if (AliasValidator.validate(recipientRaw)) {
      return new NamespaceId(recipientRaw)
    } else {
      return null
    }
  }
  /// end-region computed properties getter/setter

  /**
   * Hook called when the child component MosaicAttachmentDisplay triggers
   * the event 'delete'
   * @return {void}
   */
  public onDeleteMosaic(id: MosaicId) {
    const updatedAttachedMosaics = [...this.formItems.attachedMosaics]
      .filter(({mosaicHex}) => mosaicHex !== id.toHex())

    // fixes reactivity on attachedMosaics (observer resolution)
    Vue.set(this.formItems, 'attachedMosaics', updatedAttachedMosaics)
  }

  /**
   * Hook called when the child component ButtonAdd triggers
   * the event 'click'
   * @return {void}
   */
  protected onMosaicInputChange(payload: {
    mosaicAttachment: MosaicAttachment
    inputIndex: number
  }): void {
    const {mosaicAttachment, inputIndex} = payload

    // set slot
    this.mosaicInputsManager.setSlot(mosaicAttachment.mosaicHex, inputIndex)

    // update formItems
    const newAttachedMosaics = [...this.formItems.attachedMosaics]
    const indexToUpdate = newAttachedMosaics.findIndex(({uid}) => uid == inputIndex)
    newAttachedMosaics[indexToUpdate] = mosaicAttachment
    Vue.set(this.formItems, 'attachedMosaics', newAttachedMosaics)
    this.triggerChange()
  }

  /**
   * Handle deletion of a mosaic input
   * @protected
   * @param {number} inputIndex
   */
  protected onDeleteMosaicInput(index: number): void {
    // unset mosaic input slot
    this.mosaicInputsManager.unsetSlot(index)

    // update formItems, set input uid to null
    const indexToUpdate = this.formItems.attachedMosaics.findIndex(({uid}) => uid == index)
    Vue.set(this.formItems.attachedMosaics, indexToUpdate, {uid: null})
    // delete the last one in order to re-render the list 
    this.formItems.attachedMosaics.pop()
    this.triggerChange()
  }

  /**
   * Internal helper to format a {Mosaic} entry into
   * an array of MosaicAttachment used in this form.
   * @internal
   * @param {Mosaic[]} mosaics 
   * @return {MosaicAttachment[]}
   */
  protected mosaicsToAttachments(mosaics: Mosaic[]): MosaicAttachment[] {
    return mosaics.map(
      mosaic => {
        const info = this.mosaicsInfo.find(i => i.id.equals(mosaic.id))
        const div = info ? info.divisibility : 0
        // amount will be converted to RELATIVE
        return {
          id: mosaic.id as MosaicId, // XXX resolve mosaicId from namespaceId
          mosaicHex: mosaic.id.toHex(), // XXX resolve mosaicId from namespaceId
          name: this.getMosaicName(mosaic.id),
          amount: mosaic.amount.compact() / Math.pow(10, div),
          uid: Math.floor(Math.random() * 10e6), // used to index dynamic inputs
        }
      })
  }

  /** 
   *  Hook called when adding a new mosaic attachment input
   * @protected
   */
  protected addMosaicAttachmentInput(): void {
    if (!this.mosaicInputsManager.hasFreeSlots()) return
    const uid = Math.floor(Math.random() * 10e6)
    const [mosaicToAffectToNewInput] = this.mosaicInputsManager.getMosaicsBySlot(uid)
    this.mosaicInputsManager.setSlot(mosaicToAffectToNewInput, uid)
    this.formItems.attachedMosaics.push({
      mosaicHex: mosaicToAffectToNewInput,
      amount: 0,
      uid,
    })
  }

  /**
   * Handler when changing message
   */
  onChangeMessage() {
    this.triggerChange()
  }

  /**
   * Handler when changing recipient
   */
  onChangeRecipient() {
    this.triggerChange()
  }

  /**
   * Handler when changing max fee
   */
  onChangeMaxFee() {
    if (this.formItems.recipientRaw && this.formItems.recipientRaw !== '') {
      this.triggerChange()
    }
  }

  triggerChange() {
    if (this.formItems.recipientRaw && this.formItems.recipientRaw !== '') {
      const transactions = this.getTransactions()
      // avoid error
      if(transactions){
        const data: ITransactionEntry[] = []
        transactions.map((item: TransferTransaction) => {
          data.push({
            transaction: item,
            attachments: this.mosaicsToAttachments(item.mosaics),
          })
        })
  
        this.$emit('onTransactionsChange', data)
      }
    }
  }

  /**
   * Resetting the form when choosing a multisig signer and changing multisig signer
   * Is necessary to make the mosaic inputs reactive
   */
  @Watch('selectedSigner')
  onSelectedSignerChange() {
    if (this.isMultisigMode) this.resetForm()
  }
}
