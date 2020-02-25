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
import {TransactionType, MultisigAccountModificationTransaction, PublicAccount, MultisigAccountInfo} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {FormTransactionBase} from '@/views/forms/FormTransactionBase/FormTransactionBase'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {
  MultisigAccountModificationFormFieldsType, CosignatoryModification, 
  ViewMultisigAccountModificationTransaction, CosignatoryModifications,
} from '@/core/transactions/ViewMultisigAccountModificationTransaction'

// child components
import {ValidationObserver} from 'vee-validate'
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
import ApprovalAndRemovalInput from '@/components/ApprovalAndRemovalInput/ApprovalAndRemovalInput.vue'
// @ts-ignore
import AddCosignatoryInput from '@/components/AddCosignatoryInput/AddCosignatoryInput.vue'
// @ts-ignore
import RemoveCosignatoryInput from '@/components/RemoveCosignatoryInput/RemoveCosignatoryInput.vue'
// @ts-ignore
import CosignatoryModificationsDisplay from '@/components/CosignatoryModificationsDisplay/CosignatoryModificationsDisplay.vue'
// @ts-ignore
import ApprovalAndRemovalInputDisplay from '@/components/ApprovalAndRemovalInputDisplay/ApprovalAndRemovalInputDisplay.vue'

@Component({
  components: {
    FormWrapper,
    ValidationObserver,
    FormRow,
    SignerSelector,
    ApprovalAndRemovalInput,
    AddCosignatoryInput,
    RemoveCosignatoryInput,
    CosignatoryModificationsDisplay,
    MaxFeeAndSubmit,
    ModalTransactionConfirmation,
    ApprovalAndRemovalInputDisplay,
  },
  computed: {...mapGetters({
    currentSignerMultisigInfo: 'wallet/currentSignerMultisigInfo',
 })}
})
export class FormMultisigAccountModificationTransactionTs extends FormTransactionBase {
  /// region component properties
  @Prop({
    default: '',
  }) signer: string

  @Prop({
    default: 'conversion',
  }) multisigOperationType: 'conversion' | 'modification'

  @Prop({
    default: null,
  }) minApprovalDelta: number

  @Prop({
    default: null,
  }) minRemovalDelta: number

  @Prop({
    default: null,
  }) cosignatoryModifications: CosignatoryModifications

  @Prop({
    default: false,
  }) disableSubmit: boolean
  /// end-region component properties

  /**
   * Current signer multisig info
   * @protected
   * @type {MultisigAccountInfo}
   */
  protected currentSignerMultisigInfo: MultisigAccountInfo

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
   * New number of cosignatories
   * @readonly
   * @protected
   * @type {number}
   */
  protected get newNumberOfCosignatories(): number {
    const currentNumberOfCosignatories = this.currentSignerMultisigInfo
      ? this.currentSignerMultisigInfo.cosignatories.length : 0

    const newModifications = Object.values(this.formItems.cosignatoryModifications)
    if (!newModifications.length) return currentNumberOfCosignatories
    const numberOfModifications = newModifications.length
    const numberOfRemovals = [...newModifications]
      .filter(({addOrRemove}) => addOrRemove === 'remove')
      .length

    const cosignatoriesDelta = numberOfModifications - numberOfRemovals
    return currentNumberOfCosignatories + cosignatoriesDelta
  }

  /**
   * New min approval value
   * @readonly
   * @protected
   * @type {number}
   */
  protected get newMinApproval(): number {
    const {minApprovalDelta} = this.formItems 
    if(!this.currentSignerMultisigInfo) return minApprovalDelta
    return this.currentSignerMultisigInfo.minApproval + minApprovalDelta
  }

  /**
   * New min removal value
   * @readonly
   * @protected
   * @type {number}
   */
  protected get newMinRemoval(): number {
    const {minRemovalDelta} = this.formItems 
    if(!this.currentSignerMultisigInfo) return minRemovalDelta
    return this.currentSignerMultisigInfo.minRemoval + minRemovalDelta
  }

  /**
    * Reset the form with properties
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
    this.formItems.cosignatoryModifications = !!this.cosignatoryModifications ? this.cosignatoryModifications : {}
    this.formItems.signerPublicKey = this.multisigs && this.multisigs.length ? this.multisigs[0].publicKey : ''

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
   * Hook called by AddCosignatoryInput button
   * @param {PublicAccount} publicAccount
   * @return {void}
   */
  protected onAddCosignatory(publicAccount: PublicAccount): void {
    const modification = {cosignatory: publicAccount, addOrRemove: 'add'}
    Vue.set(this.formItems.cosignatoryModifications, publicAccount.publicKey, modification)
  }

  /**
   * Hook called by RemoveCosignatoryInput button
   * @protected
   * @param {string} publicKey
   * @return {void}
   */
  protected onRemoveCosignatory(publicKey: string): void {
    if (!publicKey) return 
    const publicAccount = PublicAccount.createFromPublicKey(publicKey, this.networkType)
    const modification = {cosignatory: publicAccount, addOrRemove: 'remove'}
    Vue.set(this.formItems.cosignatoryModifications, publicAccount.publicKey, modification)
  }

  /**
   * Hook called from CosignatoryModificationsDisplay delete button
   * @param {string} publicKey to remove
   * @return {void}
   */
  protected onRemoveCosignatoryModification(publicKey: string): void {
    if (!publicKey) return 
    const newCosignatoryModifications = {...this.formItems.cosignatoryModifications}
    delete newCosignatoryModifications[publicKey]
    Vue.set(this.formItems, 'cosignatoryModifications', newCosignatoryModifications)
  }
}
