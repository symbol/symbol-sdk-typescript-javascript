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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Address, PublicAccount, NetworkType} from 'symbol-sdk'

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ButtonRemove from '@/components/ButtonRemove/ButtonRemove.vue'

@Component({
  components: {
    FormRow,
    ButtonRemove,
  },
  computed: {
    ...mapGetters({
      currentPeer: 'network/currentPeer',
      networkType: 'network/networkType',
    }),
  },
})
export class RemoveCosignatoryInputTs extends Vue {
  /**
   * Target account cosignatories
   * @protected
   * @type {PublicAccount[]}
   */
  @Prop({default: []}) 
  protected cosignatories: PublicAccount[]

  /**
   * Current network type
   * @private
   * @type {NetworkType}
   */
  private networkType: NetworkType

  /**
   * Selected cosignatory public key
   * @protected
   * @type {string}
   */
  public cosignatory: string = ''

  /**
   * Handles the form submission
   * @protected
   * @return {void}
   */
  protected onRemoveCosignatory(): void {
    this.$emit('on-remove-cosignatory', this.cosignatory)
  }

  /**
   * Returns a pretty address from a public key
   * @protected
   * @param {string} publicKey
   * @returns {string}
   */
  protected getAddressFromPublicKey(publicKey: string): string {
    return Address.createFromPublicKey(publicKey, this.networkType).pretty()              
  }
}
