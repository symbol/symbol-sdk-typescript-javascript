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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'

@Component({
  components: {
    ErrorTooltip,
    FormLabel,
  },
  computed: {
    ...mapGetters({
      explorerUrl: 'app/explorerUrl',
    }),
  },
})
export class ExplorerUrlSetterTs extends Vue {
  /**
  * Validation rules
  * @var {ValidationRuleset}
  */
  public validationRules = ValidationRuleset

  /**
   * Explorer URL
   * @var {string}
   */
  explorerUrl: string

  /**
   * Chosen explorer URL
   * @var {string}
   */
  chosenExplorerUrl = ''

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
   * Auto-complete filtering method
   * @param {string} value
   * @param {string[]} option
   * @returns 
   */
  explorerLinkFilterMethod(value: string, option: string) {
    return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
  }

  /**
   * Set the new explorer link
   * @return {void}
   */
  setExplorerLink() {
    this.$validator.validate().then((valid) => {
      if (!valid) return
      this.$store.dispatch('app/SET_EXPLORER_URL', this.chosenExplorerUrl)
    })
  }

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  mounted() {
    this.chosenExplorerUrl = this.explorerUrl
  }
}
