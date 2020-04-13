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
  AliasTransaction, NamespaceId, MosaicId, Address, AliasAction, AliasType,
  AddressAliasTransaction, MosaicAliasTransaction, MosaicInfo, NamespaceInfo,
  UInt64, Mosaic,
} from 'symbol-sdk'
import {Component, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {FormTransactionBase} from '../FormTransactionBase/FormTransactionBase'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {ViewAliasTransaction} from '@/core/transactions/ViewAliasTransaction'

// child components
import {ValidationProvider, ValidationObserver} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import NamespaceSelector from '@/components/NamespaceSelector/NamespaceSelector.vue'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import AddressInput from '@/components/AddressInput/AddressInput.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue'

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWrapper,
    FormRow,
    ErrorTooltip,
    NamespaceSelector,
    MosaicSelector,
    AddressInput,
    MaxFeeSelector,
    ModalTransactionConfirmation,
    MaxFeeAndSubmit,
  },
  computed: {...mapGetters({
    ownedNamespaces: 'wallet/currentWalletOwnedNamespaces', 
    ownedMosaics: 'wallet/currentWalletOwnedMosaics',
    mosaicsNamesByHex: 'mosaic/mosaicsNames',
    currentHeight: 'network/currentHeight',
  })},
})
export class FormAliasTransactionTs extends FormTransactionBase {
  @Prop({ default: null }) namespaceId: NamespaceId
  @Prop({ default: null }) aliasTarget: MosaicId | Address
  @Prop({ default: null, required: true }) aliasAction: AliasAction
  @Prop({ default: false }) disableSubmit: boolean
  /**
   * Type of assets shown in the form alias
   * @type {string}
   */
  @Prop({default: 'namespace'}) assetType: string

  /**
   * Alias action
   * @type {AliasAction[]}
   * @protected
   */
  protected AliasAction = AliasAction

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  protected validationRules = ValidationRuleset

  /**
   * Form items
   * @var {any}
   */
  protected formItems = {
    namespaceFullName: null,
    aliasTarget: null,
    aliasAction: null,
    maxFee: 0,
  }

  /**
   * Alias target type
   * @protected
   * @type {('mosaic' | 'address')}
   */
  protected aliasTargetType: 'mosaic' | 'address' = this.aliasTarget instanceof Address ? 'address' : 'mosaic'

  /**
   * Current wallet owned namespaces
   * @private
   * @type {NamespaceInfo[]}
   */
  private ownedNamespaces: NamespaceInfo[]

  /**
   * Current wallet owned mosaics
   * @private
   * @type {MosaicInfo[]}
   */
  private ownedMosaics: MosaicInfo[]

  /**
   * Mosaics names by hex
   * @private
   * @type {Record<string, string>}
   */
  private mosaicsNamesByHex: Record<string, string>

  /**
   * Current network height
   * @private
   * @type {number}
   */
  private currentHeight: number

  /**
   * Current wallet namespace hex Ids that can be linked
   * @readonly
   * @protected
   * @type {string []}
   */
  protected get linkableNamespaces(): NamespaceInfo[] {
    return this.ownedNamespaces.filter(
      ({alias}) => alias && alias.type === AliasType.None,
    )
  }
  
  /**
   * Current wallet mosaics hex Ids that can be linked
   * @readonly  
   * @protected
   * @type {Mosaic}
   */
  protected get linkableMosaics(): Mosaic[] {
    return this.ownedMosaics
      .filter((mosaicInfo) => {
        // no mosaics with names
        const mosaicName = this.mosaicsNamesByHex[mosaicInfo.id.toHex()]
        if (mosaicName && mosaicName.length) return false

        // mosaics must not be expired
        if (mosaicInfo.duration.compact() == 0) return true
        return mosaicInfo.height.compact() + mosaicInfo.duration.compact() > this.currentHeight
      })
      .map(({id}) => new Mosaic(id, UInt64.fromUint(0)))
  }

  /**
   * Reset the form with properties
   * @return {void}
   */
  protected resetForm() {
    // - re-populate form if transaction staged
    // if (this.stagedTransactions.length) {
    //   const transaction = this.stagedTransactions.find(
    //     staged => staged.type === TransactionType.MOSAIC_ALIAS || staged.type === TransactionType.ADDRESS_ALIAS,
    //   )
    //   this.setTransactions([transaction as AliasTransaction])
    //   this.isAwaitingSignature = true
    //   return
    // }

    /**
     * Helper function to get the alias target as a string
     * @param {(MosaicId | Address)} aliasTarget
     * @returns {string}
     */
    const getAliasTarget = (aliasTarget: MosaicId | Address): string => {
      if (!aliasTarget) return null
      if (aliasTarget instanceof Address) return aliasTarget.plain()
      return aliasTarget.id.toHex()
    }

    // - set default form values
    this.formItems.namespaceFullName = this.namespaceId ? this.namespaceId.fullName : null
    this.formItems.aliasTarget = getAliasTarget(this.aliasTarget)
    this.formItems.aliasAction = this.aliasAction

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @see {FormTransactionBase}
   * @return {boolean} True if creating alias for multisig
   */
  protected isAggregateMode(): boolean {
    return this.isCosignatoryMode
  }

  /**
   * Getter for ALIAS transactions that will be staged
   * @see {FormTransactionBase}
   * @return {AliasTransaction[]}
   */
  protected getTransactions(): AliasTransaction[] {
    this.factory = new TransactionFactory(this.$store)
    try {
      // - prepare transaction parameters
      let view = new ViewAliasTransaction(this.$store)

      // instantiate the alias target
      const instantiatedAliasTarget = this.aliasTargetType === 'address'
        ? Address.createFromRawAddress(this.formItems.aliasTarget)
        : new MosaicId(this.formItems.aliasTarget)

      view = view.parse({
        namespaceId: new NamespaceId(this.formItems.namespaceFullName),
        aliasTarget: instantiatedAliasTarget,
        aliasAction: this.formItems.aliasAction,
        maxFee: UInt64.fromUint(this.formItems.maxFee),
      })
      
      // - prepare transaction
      return [this.factory.build(view)]
    } catch (error) {
      console.error('Error happened in FormAliasTransactionTs.transactions(): ', error)
    }
  }

  /**
   * Setter for Alias transactions that will be staged
   * @see {FormTransactionBase}
   * @param {AliasTransaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: AliasTransaction[]) {
    // - this form creates only 1 transaction
    const transaction = transactions.shift()
    if (!transaction) return

    // - populate for items if transaction is an address alias
    if (transaction instanceof AddressAliasTransaction) {
      this.formItems.namespaceFullName = transaction.namespaceId.fullName
      this.formItems.aliasTarget = transaction.address.plain()
      this.formItems.aliasAction = transaction.aliasAction
    }

    // - populate for items if transaction is an mosaic alias
    if (transaction instanceof MosaicAliasTransaction) {
      this.formItems.namespaceFullName = transaction.namespaceId.fullName
      this.formItems.aliasTarget = transaction.namespaceId.toHex()
      this.formItems.aliasAction = transaction.aliasAction
    }
    
    // - populate maxFee
    this.formItems.maxFee = transaction.maxFee.compact()
  }
}
