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
import {Component, Prop, Vue} from 'vue-property-decorator'

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({
  components: {FormRow},
})
export class SignerSelectorTs extends Vue {
  /**
   * Value set by the parent component's v-model
   * @type {string}
   */
  @Prop({
    default: '',
  }) value: string

  @Prop({
    default: () => [],
  }) signers: {publicKey: string, label: string}[]

  @Prop({
    default: 'sender',
  }) label: string

  @Prop({
    default: false,
  }) noLabel: boolean

  /// region computed properties getter/setter
  /**
   * Value set by the parent component
   * @type {string}
   */
  get chosenSigner(): string {
    return this.value
  }

  /**
   * Emit value change
   */
  set chosenSigner(newValue: string) {
    this.$emit('input', newValue)
  }
/// end-region computed properties getter/setter
}
