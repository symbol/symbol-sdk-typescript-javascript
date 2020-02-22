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
import {
  MosaicDefinitionTransaction,
  MosaicId,
  UInt64,
  MosaicSupplyChangeAction,
  Transaction,
  MosaicInfo,
  MosaicSupplyChangeTransaction,
} from 'nem2-sdk'
import {Component, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {ViewMosaicSupplyChangeTransaction, MosaicSupplyChangeFormFieldsType} from '@/core/transactions/ViewMosaicSupplyChangeTransaction'
import {FormTransactionBase} from '@/views/forms/FormTransactionBase/FormTransactionBase'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import SupplyInput from '@/components/SupplyInput/SupplyInput.vue'
// @ts-ignore
import DivisibilityInput from '@/components/DivisibilityInput/DivisibilityInput.vue'
// @ts-ignore
import DurationInput from '@/components/DurationInput/DurationInput.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    FormWrapper,
    SignerSelector,
    SupplyInput,
    DivisibilityInput,
    DurationInput,
    MaxFeeSelector,
    ModalTransactionConfirmation,
  },
  computed: {...mapGetters({ownedMosaics: 'wallet/ownedMosaics'})},
})
export class FormMosaicSupplyChangeTransactionTs extends FormTransactionBase {
  /**
   * Mosaic hex Id
   * @type {string}
   */
  @Prop({ default: null, required: true }) mosaicHexId: string

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  protected validationRules = ValidationRuleset

  /**
   * Mosaic supply change enum
   * @protected
   */
  protected MosaicSupplyChangeAction = MosaicSupplyChangeAction

  /**
   * Form items
   * @protected
   * @var {Record<string, any>}
   */
  protected formItems = {
    mosaicHexId: null,
    action: null,
    delta: null,
    maxFee: this.defaultFee,
  }

  /**
   * Mosaics owned by the current wallet
   * @protected
   * @type {MosaicInfo[]}
   */
  protected ownedMosaics: MosaicInfo[]

  /**
   * Current mosaic info
   * @readonly
   * @protected
   * @type {MosaicInfo}
   */
  protected get currentMosaicInfo(): MosaicInfo {
    return this.ownedMosaics.find(({id}) => id.toHex() === this.formItems.mosaicHexId)
  }

  /**
   * New absolute supply
   * @readonly
   * @protected
   * @type {(number | null)}
   */
  protected get newMosaicAbsoluteSupply(): number | null {
    const newSupply = this.formItems.action === MosaicSupplyChangeAction.Increase
      ? this.currentMosaicInfo.supply.compact() + Number(this.formItems.delta)
      : this.currentMosaicInfo.supply.compact() - Number(this.formItems.delta)

    return isNaN(newSupply) ? null : newSupply
  }

  /**
   * New relative supply
   * @readonly
   * @protected
   * @type {(number | null)}
   */
  protected get newMosaicRelativeSupply(): number | null {
    if (!this.newMosaicAbsoluteSupply) return null
    return this.newMosaicAbsoluteSupply / Math.pow(10, this.currentMosaicInfo.divisibility)
  }

  /**
   * Reset the form with properties
   * @return {void}
   */
  protected resetForm() {
    // - re-populate form if transaction staged
    if (this.stagedTransactions.length) {
      const definition = this.stagedTransactions.find(
        staged => staged instanceof MosaicDefinitionTransaction
          && staged.mosaicId.toHex() === this.mosaicHexId,
      )
      if (definition === undefined) return
      this.setTransactions([definition as MosaicDefinitionTransaction])
      this.isAwaitingSignature = true
      return
    }

    // - set default form values
    this.formItems.mosaicHexId = this.mosaicHexId
    this.formItems.action = MosaicSupplyChangeAction.Increase
    this.formItems.delta = 1

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee
  }

  /**
   * Getter for SUPPLY CHANGE transactions that will be staged
   * @see {FormTransactionBase}
   * @return {TransferTransaction[]}
   */
  protected getTransactions(): Transaction[] {
    this.factory = new TransactionFactory(this.$store)
    try {
      // - read form for supply change
      const supplyChangeData: MosaicSupplyChangeFormFieldsType = {
        mosaicId: new MosaicId(this.formItems.mosaicHexId),
        action: MosaicSupplyChangeAction.Increase,
        delta: UInt64.fromUint(this.formItems.delta),
        maxFee: UInt64.fromUint(this.formItems.maxFee),
      }

      // - prepare mosaic definition transaction
      let supplyChangeView = new ViewMosaicSupplyChangeTransaction(this.$store)
      supplyChangeView = supplyChangeView.parse(supplyChangeData)

      // - prepare mosaic supply change
      return [this.factory.build(supplyChangeView)]
    } catch (error) {
      console.error('Error happened in FormMosaicSupplyChangeTransaction.getTransactions(): ', error)
    }
  }

  /**
   * Setter for TRANSFER transactions that will be staged
   * @see {FormTransactionBase}
   * @param {TransferTransaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: Transaction[]) {
    // - this form creates 2 transaction
    const supplyChange = transactions.shift() as MosaicSupplyChangeTransaction

    // - populate from definition
    this.formItems.mosaicHexId = supplyChange.mosaicId.toHex()
    this.formItems.action = supplyChange.action
    this.formItems.delta = supplyChange.delta.compact()

    // - populate maxFee
    this.formItems.maxFee = supplyChange.maxFee.compact()
  }
}
