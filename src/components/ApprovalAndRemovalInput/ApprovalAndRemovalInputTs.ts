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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {MultisigAccountInfo} from 'nem2-sdk'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormRow,
  },
})
export class ApprovalAndRemovalInputTs extends Vue {
  /**
   * Value bound to the form v-model
   * @type {number}
   */
  @Prop({
    default: '',
  }) value: number

  /**
   * Type of multisig account modification operation
   * @type {('conversion' | 'modification')}
   */
  @Prop({
    default: null,
  }) multisigOperationType: 'conversion' | 'modification'

  /**
   * Type of field
   * @type {('approval' | 'removal')}
   */
  @Prop({
    default: null,
  }) approvalOrRemoval: 'approval' | 'removal'

  /**
   * Current min approval or mun removal value of the target account
   * @type {number}
   */
  @Prop({
    default: {},
  }) currentMultisigInfo: MultisigAccountInfo

  /**
   * Current min approval or mun removal value of the target account
   * @type {number}
   */
  @Prop({
    default: null,
  }) newNumberOfCosignatories: number

  /// region computed properties getter/setter
  /**
   * Gets the input value from the value prop
   * @protected
   * @type {number}
   */
  protected get chosenValue(): number {
    return this.value
  }

  /**
   * Emits input value change to the parent
   * @protected
   */
  protected set chosenValue(amount: number) {
    this.$emit('input', amount)
  }

  /**
   * Form label
   * @readonly
   * @protected
   * @type {string}
   */
  protected get label(): string {
    return this.approvalOrRemoval === 'approval'
      ? 'form_label_new_min_approval'
      : 'form_label_new_min_removal'
  }

  protected get description(): string {
    return this.approvalOrRemoval === 'approval'
      ? 'form_label_description_min_approval'
      : 'form_label_description_min_removal'
  }
  /**
   * Current minApproval or minRemoval of the target account
   * @readonly
   * @protected
   * @type {number}
   */
  protected get currentValue(): number {
    if (!this.currentMultisigInfo) return 0
    if (this.approvalOrRemoval === 'approval') return this.currentMultisigInfo.minApproval
    return this.currentMultisigInfo.minRemoval
  }

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  protected validationRules = ValidationRuleset

  /**
   * Available input choices
   * @readonly
   * @protected
   * @type {{label: string, value: number}}
   */
  protected get deltaOptions(): {value: number, newDelta: number}[] {
    // For an account conversion, the minimum delta is 1
    const isConversion = this.multisigOperationType === 'conversion'

    // minimum possible delta
    const {maxCosignatoriesPerAccount} = currentNetworkConfig.properties
    const minDelta = isConversion ? 1 : 0 - this.currentValue
    const maxDelta = isConversion ? maxCosignatoriesPerAccount : maxCosignatoriesPerAccount + 1

    // array with a number of items equal to the new number of cosigners
    return [...Array(maxDelta).keys()].map(
      (index: number) => {
        // populate the array with all possibilities starting with the minimum delta
        const delta = minDelta + index
        const newDelta = this.currentValue + delta
        return {value: delta, newDelta}
      },
    )
  }
  /// end-region computed properties getter/setter
}
