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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Transaction} from 'symbol-sdk'

// child components
// @ts-ignore
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue'

@Component({
  components: {
    TransactionDetails,
  },
})
export class ModalTransactionDetailsTs extends Vue {
  @Prop({
    default: false,
  }) visible: boolean

  @Prop({
    default: null,
  }) transaction: Transaction

  /// region computed properties
  
  /**
   * Visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }
/// end-region computed properties
}
