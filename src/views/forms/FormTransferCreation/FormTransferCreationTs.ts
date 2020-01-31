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
import {Component, Vue, Prop} from 'vue-property-decorator'
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
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/components/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import MosaicAttachmentDisplay from '@/components/MosaicAttachmentDisplay/MosaicAttachmentDisplay.vue'
// @ts-ignore
import MosaicAttachmentInput from '@/components/MosaicAttachmentInput/MosaicAttachmentInput.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
// @ts-ignore
import RecipientInput from '@/components/RecipientInput/RecipientInput.vue'
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue'

@Component({
  components: {
    AmountInput,
    MosaicSelector,
    MessageInput,
    ModalTransactionConfirmation,
    SignerSelector,
    MosaicAttachmentDisplay,
    MosaicAttachmentInput,
    MaxFeeSelector,
    RecipientInput,
    ButtonAdd,
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
    recipientRaw: '',
    recipient: null,
    selectedMosaicHex: '',
    relativeAmount: 0,
    attachedMosaics: [],
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
    this.formItems.attachedMosaics = !!this.mosaics && this.mosaics.length ? this.mosaics.map(
      mosaic => ({
        id: mosaic.id,
        mosaicHex: mosaic.id.toHex(),
        name: this.getMosaicName(mosaic.id),
        amount: mosaic.amount.compact()
      })) : []
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
  protected get transaction(): TransferTransaction {
    // - read form
    const data = {
      recipient: this.formItems.recipient,
      mosaics: this.formItems.attachedMosaics.map(
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
  }

  protected set transaction(transaction: TransferTransaction) {
    // - populate recipient
    this.formItems.recipientRaw = transaction.recipientAddress instanceof Address
                                ? transaction.recipientAddress.plain()
                                : (transaction.recipientAddress as NamespaceId).toHex()

    // - populate attached mosaics
    this.formItems.attachedMosaics = transaction.mosaics.map(
      mosaic => {
        const info = this.mosaicsInfo.find(i => i.id.equals(mosaic.id))
        const div = info ? info.divisibility : 0
        // amount will be converted to RELATIVE
        return {
          id: mosaic.id,
          mosaicHex: mosaic.id.toHex(),
          name: this.getMosaicName(mosaic.id),
          amount: mosaic.amount.compact() / Math.pow(10, div)
        }
      })

    // - convert and populate message
    this.formItems.messagePlain = Formatters.hexToUtf8(transaction.message.payload)

    // - populate maxFee
    this.formItems.maxFee = transaction.maxFee.compact()
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
    const index = this.formItems.attachedMosaics.findIndex(attached => attached.mosaicHex === id.toHex())
    if (undefined !== index) {
      delete this.formItems.attachedMosaics[index]
    }
  }

  /**
   * Hook called when the child component ButtonAdd triggers
   * the event 'click'
   * @return {void}
   */
  public onAddMosaic(formItems: any) {
    const id = new MosaicId(RawUInt64.fromHex(formItems.mosaicHex))
    this.formItems.attachedMosaics.push({
      id: id,
      mosaicHex: formItems.mosaicHex,
      name: this.getMosaicName(id),
      amount: formItems.amount, // amount is relative
    })
  }

  public onChangeRecipient(input: string) {
    if ([40, 46].includes(input.length)) {
      return this.formItems.recipient = Address.createFromRawAddress(input)
    }

    return this.formItems.recipient = new NamespaceId(input)
  }

  /**
   * Process form input
   * @return {void}
   */
  public onSubmit() {
    if (this.disableSubmit) {
      return ;
    }

    this.$validator
      .validate()
      .then(async (valid) => {
        if (!valid) return

        // - put transaction on stage
        await this.$store.dispatch('wallet/ADD_STAGED_TRANSACTION', this.transaction)
        this.isAwaitingSignature = true
      })
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

    return  mosaicId.toHex()
  }
}
