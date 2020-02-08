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
// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormLabel,
  },
  computed: {...mapGetters({
    namespacesNames: 'namespace/namespacesNames',
  })}, 
})
export class NamespaceSelectorTs extends Vue {
  /**
   * Value set by the parent component's v-model
   * @type {string}
   */
  @Prop({
    default: null,
  }) value: string

  /**
   * Namespaces names
   * @type {{hex: string, name: string}}
   */
  public namespacesNames: Record<string, string>

  /// region computed properties getter/setter
  /**
   * Value set by the parent component
   * @type {string}
   */
  get chosenValue(): string {
    return this.value
  }

  /**
   * Emit value change
   */
  set chosenValue(newValue: string) {
    this.$emit('input', newValue)
  }
/// end-region computed properties getter/setter
}
