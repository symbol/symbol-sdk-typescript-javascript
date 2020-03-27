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
// external dependencies
import {TransactionType, MultisigAccountModificationTransaction, PublicAccount, MultisigAccountInfo} from 'symbol-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'

// internal dependencies
import {FormTransactionBase} from '@/views/forms/FormTransactionBase/FormTransactionBase'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {
  MultisigAccountModificationFormFieldsType, CosignatoryModification, 
  ViewMultisigAccountModificationTransaction, CosignatoryModifications,
} from '@/core/transactions/ViewMultisigAccountModificationTransaction'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue'
// @ts-ignore
import RemoveCosignatoryInput from '@/components/RemoveCosignatoryInput/RemoveCosignatoryInput.vue'
// @ts-ignore
import CosignatoryModificationsDisplay from '@/components/CosignatoryModificationsDisplay/CosignatoryModificationsDisplay.vue'
// @ts-ignore
import ApprovalAndRemovalInput from '@/components/ApprovalAndRemovalInput/ApprovalAndRemovalInput.vue'
// @ts-ignore
import MultisigCosignatoriesDisplay from '@/components/MultisigCosignatoriesDisplay/MultisigCosignatoriesDisplay.vue'

@Component({
  components: {
    FormWrapper,
    ValidationObserver,
    ValidationProvider,
    FormRow,
    SignerSelector,
    AddCosignatoryInput,
    RemoveCosignatoryInput,
    CosignatoryModificationsDisplay,
    MaxFeeAndSubmit,
    ModalTransactionConfirmation,
    ApprovalAndRemovalInput,
    MultisigCosignatoriesDisplay,
  },
})
export class FormMultisigAccountModificationTransactionTs extends FormTransactionBase {
  /// region component properties
  @Prop({
    default: '',
  }) signer: string

  @Prop({
    default: null,
  }) minApprovalDelta: number

  @Prop({
    default: null,
  }) minRemovalDelta: number

  @Prop({
    default: false,
  }) disableSubmit: boolean
  /// end-region component properties

  /**
    * Form items
    * @var {any}
    */
  public formItems: MultisigAccountModificationFormFieldsType = {
    signerPublicKey: '',
    minApprovalDelta: 0,
    minRemovalDelta: 0,
    cosignatoryModifications: {},
    maxFee: 0,
  }

  /**
   * Max number of cosignatories per account
   * @private
   * @type {number}
   */
  private maxCosignatoriesPerAccount: number = this.$store.getters['network/properties'].maxCosignatoriesPerAccount

  public get multisigOperationType(): 'conversion' | 'modification' {
    if (this.isCosignatoryMode) {
      return 'modification'
    }

    return 'conversion'
  }

  public get currentMultisigInfo(): MultisigAccountInfo {
    if (this.isCosignatoryMode) {
      return this.currentSignerMultisigInfo
    }

    return this.currentWalletMultisigInfo  
  }

  /**
    * Reset the form with properties
    * @see {FormTransactionBase}
    * @return {void}
    */
  protected resetForm() {
    // - re-populate form if transaction staged
    if (this.stagedTransactions.length) {
      const transaction = this.stagedTransactions.find(
        staged => staged.type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
      )
      if (transaction === undefined) return
      this.setTransactions([transaction as MultisigAccountModificationTransaction])
      this.isAwaitingSignature = true
      return
    }

    // - set default deltas values
    const defaultMinApprovalDelta = this.multisigOperationType === 'conversion' ? 1 : 0
    const defaultMinRemovalDelta = this.multisigOperationType === 'conversion' ? 1 : 0

    // - set default form values
    this.formItems.minApprovalDelta = !!this.minApprovalDelta ? this.minApprovalDelta : defaultMinApprovalDelta
    this.formItems.minRemovalDelta = !!this.minRemovalDelta ? this.minRemovalDelta : defaultMinRemovalDelta
    this.formItems.cosignatoryModifications = {}
    this.formItems.signerPublicKey = this.currentWallet.values.get('publicKey')

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @see {FormTransactionBase}
   * @return {boolean} Always true
   */
  protected isAggregateMode(): boolean {
    return true
  }

  /**
   * Getter for whether forms should aggregate transactions in BONDED
   * @see {FormTransactionBase}
   * @return {boolean} Always true
   */
  protected isMultisigMode(): boolean {
    return true
  }

  /**
    * Getter for TRANSFER transactions that will be staged
    * @see {FormTransactionBase}
    * @return {MultisigAccountModificationTransaction[]}
    */
  protected getTransactions(): MultisigAccountModificationTransaction[] {
    this.factory = new TransactionFactory(this.$store)
    try {
      // - prepare transaction parameters
      let view = new ViewMultisigAccountModificationTransaction(this.$store)
      view = view.parse(this.formItems)
      // - prepare transaction
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
  protected setTransactions(transactions: MultisigAccountModificationTransaction[]) {
    // this form creates only 1 transaction
    const transaction = transactions.shift()
    this.formItems.minApprovalDelta = transaction.minApprovalDelta
    this.formItems.minRemovalDelta = transaction.minRemovalDelta
    this.formItems.cosignatoryModifications = this.getCosignatoryModificationsFromTransaction(transaction)
    this.formItems.maxFee = transaction.maxFee ? transaction.maxFee.compact() : this.defaultFee
  }

  private getCosignatoryModificationsFromTransaction(
    transaction: MultisigAccountModificationTransaction,
  ): CosignatoryModifications {
    const additions: CosignatoryModification[] = transaction.publicKeyAdditions.map(
      publicAccount => ({addOrRemove: 'add', cosignatory: publicAccount}),
    )

    const deletions: CosignatoryModification[] = transaction.publicKeyDeletions.map(
      publicAccount => ({addOrRemove: 'remove', cosignatory: publicAccount}),
    )

    return [ ...additions, ...deletions ].reduce((acc, modification) => ({
      ...acc, [modification.cosignatory.publicKey]: modification,
    }), {})
  }

  /**
   * Hook called when a signer is selected.
   *
   * This override is needed in order to fetch the multi-signature
   * information for the currently selected signer. This fixes a
   * reactivity problem with SignerSelector selected value in case
   * of long-loading (e.g. fetch of multisig data).
   *
   * @override
   * @param {string} signerPublicKey 
   */
  public async onChangeSigner(signerPublicKey: string) {
    // whether the new signer is a multisig account
    const signerIsMultisigAccount = this.currentWallet.values.get('publicKey') !== signerPublicKey

    // force update form fields
    this.formItems.minApprovalDelta = signerIsMultisigAccount ? 0 : 1
    this.formItems.minRemovalDelta = signerIsMultisigAccount ? 0 : 1
    this.formItems.signerPublicKey = signerPublicKey
    this.formItems.cosignatoryModifications = {}

    /// region super.onChangeSigner
    this.currentSigner = PublicAccount.createFromPublicKey(signerPublicKey, this.networkType)

    const payload = !signerIsMultisigAccount ? this.currentWallet : {
      networkType: this.networkType,
      publicKey: signerPublicKey,
    }

    await this.$store.dispatch('wallet/SET_CURRENT_SIGNER', {model: payload})
    /// end-region super.onChangeSigner

    // force fetch of multisig info for current signer
    const address = this.currentSigner.address
    this.$store.dispatch('wallet/REST_FETCH_MULTISIG', address.plain())
  }

  /**
   * Hook called when the subcomponent MultisigCosignatoriesDisplay
   * emits the event `remove`.
   *
   * @param {string} publicKey 
   */
  public onClickRemove(publicKey: string) {
    const modifications = this.formItems.cosignatoryModifications

    // - in case public key is part of "modifications"
    if (modifications && modifications[publicKey]) {
      Vue.delete(this.formItems.cosignatoryModifications, publicKey)
      return
    }
    // - in case public key is part of "cosignatories", register modification
    else {
      const publicAccount = PublicAccount.createFromPublicKey(publicKey, this.networkType)
      Vue.set(
        this.formItems.cosignatoryModifications,
        publicKey,
        {cosignatory: publicAccount, addOrRemove: 'remove'},
      )
    }
  }

  /**
   * Hook called when the subcomponent MultisigCosignatoriesDisplay
   * emits the event `add`.
   *
   * @param {PublicAccount} publicAccount 
   */
  public onClickAdd(publicAccount: PublicAccount) {
    Vue.set(
      this.formItems.cosignatoryModifications,
      publicAccount.publicKey,
      {cosignatory: publicAccount, addOrRemove: 'add'},
    )
  }

  public onClickUndo(publicKey: string) {
    Vue.delete(this.formItems.cosignatoryModifications, publicKey)
  }

  /// region validation handling
  /**
   * Calculation of the new multisig properties
   * For input validation purposes
   * @readonly
   * @private
   * @type {{
   *     minApproval: number,
   *     minRemoval: number,
   *     cosignatoryNumber: number,
   *   }}
   */
  private get newMultisigProperties(): {
    minApproval: number
    minRemoval: number
    cosignatoryNumber: number
  } {
    // calculate new min approval
    const newMinApproval = this.currentMultisigInfo
      ? this.currentMultisigInfo.minApproval + this.formItems.minApprovalDelta
      : this.formItems.minApprovalDelta 

    // calculate new min approval
    const newMinRemoval = this.currentMultisigInfo
      ? this.currentMultisigInfo.minRemoval + this.formItems.minRemovalDelta
      : this.formItems.minRemovalDelta

    // calculate the delta of added cosigners
    const modificationNumber = Object.keys(this.formItems.cosignatoryModifications).length
    const removalsNumber = Object.values(this.formItems.cosignatoryModifications).filter(({addOrRemove}) => addOrRemove === 'remove').length
    const numberOfAddedCosigners = modificationNumber - removalsNumber

    const newCosignatoryNumber = this.currentMultisigInfo
      ? this.currentMultisigInfo.cosignatories.length + numberOfAddedCosigners
      : numberOfAddedCosigners
    
    return {
      minApproval: newMinApproval,
      minRemoval: newMinRemoval,
      cosignatoryNumber: newCosignatoryNumber,
    }
  }

  /**
   * Whether the new multisig configuration is correct
   * @readonly
   * @protected
   * @return {'OK' | false}
   */
  protected get areInputsValid(): 'OK' | false {
    const {minApproval, minRemoval, cosignatoryNumber} = this.newMultisigProperties
    
    return cosignatoryNumber >= minApproval
      && cosignatoryNumber >= minRemoval 
      && cosignatoryNumber <= this.maxCosignatoriesPerAccount
      ? 'OK' : false
  }

  protected showErrorNotification(): void {
    // no message if inputs are OK
    if (this.areInputsValid === 'OK') return

    this.$store.dispatch('notification/ADD_ERROR', this.errorMessage)
  }

  /**
   * Error message shown in the notice
   * @readonly
   * @protected
   * @return {string}
   */
  protected get errorMessage(): string {
    const {minApproval, minRemoval, cosignatoryNumber} = this.newMultisigProperties
    const {maxCosignatoriesPerAccount} = this

    // no message if inputs are OK
    if (this.areInputsValid === 'OK') return

    if(cosignatoryNumber < minApproval) {
      return `${this.$t('approval_greater_than_cosignatories', {delta: minApproval - cosignatoryNumber})}`
    }

    if(cosignatoryNumber < minRemoval) {
      return `${this.$t('removal_greater_than_cosignatories', {delta: minRemoval - cosignatoryNumber})}`
    }
    
    if(cosignatoryNumber > maxCosignatoriesPerAccount) {
      return `${this.$t('too_many_cosignatories'), {
        maxCosignatoriesPerAccount, delta: cosignatoryNumber - maxCosignatoriesPerAccount,
      }}`
    }
  }
  /// end-region validation handling
}
