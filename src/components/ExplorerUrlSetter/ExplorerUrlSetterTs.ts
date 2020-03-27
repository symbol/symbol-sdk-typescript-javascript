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

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
import {ValidationProvider, ValidationObserver} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    ErrorTooltip,
    FormRow,
  },
  computed: {
    ...mapGetters({
      explorerUrl: 'app/explorerUrl',
    }),
  },
})
export class ExplorerUrlSetterTs extends Vue {
  @Prop({
    default: '',
  }) value: string

  @Prop({
    default: true,
  }) autoSubmit: boolean

  /**
  * Validation rules
  * @var {ValidationRuleset}
  */
  public validationRules = ValidationRuleset

  /**
   * Explorer URL
   * @var {string}
   */
  public explorerUrl: string

  /**
   * Default explorer link list
   * @readonly
   * @type {string[]}
   */
  get defaultExplorerLinkList(): string[] {
    // @TODO
    return [networkConfig.explorerUrl]
  }

  /**
   * Currently explorer url
   */
  get chosenExplorerUrl() {
    return this.value && this.value.length ? this.value : this.explorerUrl
  }

  /**
   * Sets the new language
   */
  set chosenExplorerUrl(url: string) {
    if (this.autoSubmit) {
      this.$store.dispatch('app/SET_EXPLORER_URL', url)
    }

    this.$emit('input', url)
  }
}
