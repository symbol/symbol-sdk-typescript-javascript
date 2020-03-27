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
import {mapGetters} from 'vuex'
import {Vue, Component} from 'vue-property-decorator'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'

@Component({
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    currentMnemonic: 'temporary/mnemonic',
  })},
})
export default class ShowMnemonicTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Temporary Mnemonic pass phrase
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: MnemonicPassPhrase

  /**
   * Whether mnemonic is shown in plain text
   * @var {boolean}
   */
  public showMnemonic: boolean = false

  /// region computed properties getter/setter
  get mnemonicWordsList() {
    return this.currentMnemonic.plain.split(' ')
  }
/// end-region computed properties getter/setter
}
