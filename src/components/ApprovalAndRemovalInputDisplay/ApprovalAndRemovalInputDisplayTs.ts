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

// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

@Component({ components: {FormRow, ValidationProvider} })
export class ApprovalAndRemovalInputDisplayTs extends Vue {
  /**
   * New min approval
   * @type {number}
   */
  @Prop({ default: 0 })
  newMinApproval: number

  /**
   * New min removal
   * @type {number}
   */
  @Prop({ default: 0 })
  newMinRemoval: number

  /**
   * New number of cosignatories
   * @type {number}
   */
  @Prop({ default: null })
  newNumberOfCosignatories: number

  /**
   * Max number of cosignatories per account
   * @private
   * @type {number}
   */
  private maxCosignatoriesPerAccount: number = currentNetworkConfig.properties.maxCosignatoriesPerAccount

  /**
   * Whether the new multisig configuration is correct
   * @readonly
   * @protected
   * @type {number}
   */
  protected get areInputsValid(): 'OK' | false {
    return this.newNumberOfCosignatories >= this.newMinApproval
      && this.newNumberOfCosignatories >= this.newMinRemoval 
      && this.newNumberOfCosignatories <= this.maxCosignatoriesPerAccount
      ? 'OK' : false
  }

  protected get message(): string {
    const {newMinApproval, newMinRemoval, newNumberOfCosignatories, maxCosignatoriesPerAccount} = this
    if (this.areInputsValid === 'OK') {
      return `${this.$t('approval_removal_new_status', {newMinApproval, newMinRemoval, newNumberOfCosignatories})}`
    }

    if(newNumberOfCosignatories < newMinApproval) {
      return `${this.$t('approval_greater_than_cosignatories', {delta: newMinApproval - newNumberOfCosignatories})}`
    }

    if(newNumberOfCosignatories < newMinRemoval) {
      return `${this.$t('removal_greater_than_cosignatories', {delta: newMinRemoval - newNumberOfCosignatories})}`
    }
    
    if(newNumberOfCosignatories > maxCosignatoriesPerAccount) {
      return `${this.$t('too_many_cosignatories'), {
        maxCosignatoriesPerAccount, delta: newNumberOfCosignatories - maxCosignatoriesPerAccount,
      }}`
    }
  }
}
