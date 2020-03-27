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
import {mapGetters} from 'vuex'
import {NetworkType} from 'symbol-sdk'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormRow,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
  })},
})
export class RecipientInputTs extends Vue {

  @Prop({
    default: null,
  }) value: string

  /**
   * Current network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /// region computed properties getter/setter
  public get rawValue(): string {
    return this.value
  }

  public set rawValue(input: string) {
    this.$emit('input', input)
  }
/// end-region computed properties getter/setter
}
