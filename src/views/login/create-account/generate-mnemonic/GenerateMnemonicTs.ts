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
import {mapGetters} from 'vuex'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import CryptoJS from 'crypto-js'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {NotificationType} from '@/core/utils/NotificationType'

@Component({
  computed: {...mapGetters({currentAccount: 'account/currentAccount'})},
})
export default class GenerateMnemonicTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Whether component should track mouse move
   * @var {boolean}
   */
  public shouldTrackMouse: boolean = true

  /**
   * Entropy storage
   * @var {string}
   */
  private entropy = ''

  /**
   * Percentage of entropy generation process
   * @var {number}
   */
  private percent: number = 0

  /**
   * Track and handle mouse move event
   * @param {Vue.Event} event
   * @return {void} 
   */
  public handleMousemove({x, y}) {
    if (this.percent < 100) {
      this.entropy += AESEncryptionService.generateRandomBytes(8, /*raw=*/false)
      this.percent++
      return
    }

    // stop tracking
    this.shouldTrackMouse = false
    return this.saveMnemonicAndGoToNextPage()
  }

  /**
   * Save mnemonic and redirect to next page
   * return {void}
   */
  private saveMnemonicAndGoToNextPage() {
    try {
      // act
      const entropy = CryptoJS.SHA256(this.entropy).toString()
      const seed = MnemonicPassPhrase.createFromEntropy(entropy)

      // update state
      this.$store.dispatch('notification/ADD_SUCCESS', 'Generate_entropy_increase_success')
      this.$store.dispatch('temporary/SET_MNEMONIC', seed)

      // redirect
      return this.$router.push({name: 'login.createAccount.showMnemonic'})
    }
    catch (error) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.MNEMONIC_GENERATION_ERROR)
    }
  }
}
