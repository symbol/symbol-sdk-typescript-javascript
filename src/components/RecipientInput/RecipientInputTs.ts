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
import {Address, NamespaceId, NetworkType} from 'nem2-sdk'

// internal dependencies
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
  })}
})
export class RecipientInputTs extends Vue {

  @Prop({
    default: null
  }) value: Address | NamespaceId

  @Prop({
    default: ''
  }) rawInput: string

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
    return this.rawInput
  }

  public set rawValue(input: string) {
    this.rawInput = input

    if (this.rawInput.length === 40 || this.rawInput.length === 46) {
      this.value = Address.createFromRawAddress(this.rawInput)
    }
    else {
      this.value = new NamespaceId(this.rawInput)
    }
  }
/// end-region computed properties getter/setter
}
