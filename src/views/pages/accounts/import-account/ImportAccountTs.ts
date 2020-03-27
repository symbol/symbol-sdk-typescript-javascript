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
import {Vue, Component} from 'vue-property-decorator'

@Component
export default class ImportAccountTs extends Vue {
  /**
   * List of steps
   * @var {string[]}
   */
  public StepBarTitleList = [
    'Create_Account',
    'Mnemonic_Phrase',
    'Choose_Wallets',
    'Finish',
  ]

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  async mounted() {
    await this.$store.dispatch('temporary/initialize')
  }

  public getCurrentStep(): number {
    switch(this.$route.name) {
      default:
      case 'accounts.importAccount.info': return 0
      case 'accounts.importAccount.importMnemonic': return 1
      case 'accounts.importAccount.walletSelection': return 2
      case 'accounts.importAccount.finalize': return 3
    }
  }

  public getStepClassName(index: number): string {
    return this.getCurrentStep() >= index ? 'white' : 'gray'
  }
}
