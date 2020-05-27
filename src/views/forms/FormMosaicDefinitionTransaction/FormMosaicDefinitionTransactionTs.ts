/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import {
  Deadline,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicNonce,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  PublicAccount,
  Transaction,
  UInt64,
} from 'symbol-sdk'
import { Component } from 'vue-property-decorator'
// internal dependencies
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase'
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate'
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
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    FormWrapper,
    SignerSelector,
    SupplyInput,
    DivisibilityInput,
    DurationInput,
    ModalTransactionConfirmation,
    MaxFeeAndSubmit,
    FormRow,
  },
})
export class FormMosaicDefinitionTransactionTs extends FormTransactionBase {
  /**
   * Form items
   * @var {Record<string, any>}
   */
  public formItems = {
    signerPublicKey: '',
    supply: 500000000,
    divisibility: 0,
    supplyMutable: true,
    transferable: true,
    restrictable: true,
    permanent: true,
    duration: 10000,
    maxFee: 0,
  }

  /**
   * Reset the form with properties
   * @return {void}
   */
  protected resetForm() {
    // - re-populate form if transaction staged
    // if (this.stagedTransactions.length) {
    //   const definition = this.stagedTransactions.find(staged => staged.type === TransactionType.MOSAIC_DEFINITION)
    //   const supply = this.stagedTransactions.find(staged => staged.type === TransactionType.MOSAIC_SUPPLY_CHANGE)
    //   if (definition === undefined || supply === undefined) return
    //   this.setTransactions([
    //     definition as MosaicDefinitionTransaction,
    //     supply as MosaicSupplyChangeTransaction
    //   ])
    //   this.isAwaitingSignature = true
    //   return ;
    // }

    // - set default form values
    this.formItems.signerPublicKey = this.currentAccount.publicKey
    this.formItems.supplyMutable = false
    this.formItems.restrictable = false
    this.formItems.permanent = false
    this.formItems.duration = 10000

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee
  }

  /// region computed properties getter/setter
  /**
   * Getter for MOSAIC DEFINITION and SUPPLY CHANGE transactions that will be staged
   * @see {FormTransactionBase}
   * @return {TransferTransaction[]}
   */
  protected getTransactions(): Transaction[] {
    const maxFee = UInt64.fromUint(this.formItems.maxFee)
    const publicAccount = PublicAccount.createFromPublicKey(this.selectedSigner.publicKey, this.networkType)
    const randomNonce = MosaicNonce.createRandom()
    // - read form for definition
    const mosaicId = MosaicId.createFromNonce(randomNonce, publicAccount)
    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
      Deadline.create(),
      randomNonce,
      mosaicId,
      MosaicFlags.create(this.formItems.supplyMutable, this.formItems.transferable, this.formItems.restrictable),
      this.formItems.divisibility,
      UInt64.fromUint(this.formItems.duration),
      this.networkType,
      maxFee,
    )
    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
      Deadline.create(),
      mosaicId,
      MosaicSupplyChangeAction.Increase,
      UInt64.fromUint(this.formItems.supply),
      this.networkType,
      maxFee,
    )
    return [mosaicDefinitionTransaction, mosaicSupplyChangeTransaction]
  }

  /**
   * Setter for TRANSFER transactions that will be staged
   * @see {FormTransactionBase}
   * @param {TransferTransaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: Transaction[]) {
    // - this form creates 2 transaction
    const definition = transactions.shift() as MosaicDefinitionTransaction
    const supplyChange = transactions.shift() as MosaicSupplyChangeTransaction

    // - populate from definition
    this.formItems.divisibility = definition.divisibility
    this.formItems.supplyMutable = definition.flags.supplyMutable
    this.formItems.transferable = definition.flags.transferable
    this.formItems.restrictable = definition.flags.restrictable
    this.formItems.permanent = definition.duration.compact() === 0
    this.formItems.duration = definition.duration.compact()

    // - populate from supply change
    this.formItems.supply = supplyChange.delta.compact()

    // - populate maxFee
    this.formItems.maxFee = definition.maxFee.compact()
  }
}
