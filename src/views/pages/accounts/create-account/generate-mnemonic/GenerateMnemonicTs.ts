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
import {Password} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
import CryptoJS from 'crypto-js'
// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {NotificationType} from '@/core/utils/NotificationType'
import {AccountService} from '@/services/AccountService'

@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      currentPassword: 'temporary/password',
    }),
  },
})
export default class GenerateMnemonicTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountModel

  /**
   * Previous step's password
   * @see {Store.Temporary}
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Accounts repository
   * @var {AccountService}
   */
  public accountService: AccountService = new AccountService()

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
  public handleMousemove() {
    if (this.percent < 100) {
      this.entropy += AESEncryptionService.generateRandomBytes(8, /* raw=*/false)
      this.percent ++
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
  private async saveMnemonicAndGoToNextPage() {
    try {
      // act
      const entropy = CryptoJS.SHA256(this.entropy).toString()
      const seed = MnemonicPassPhrase.createFromEntropy(entropy)

      // encrypt seed for storage
      const encSeed = AESEncryptionService.encrypt(
        seed.plain,
        this.currentPassword,
      )

      // update currentAccount instance and storage
      this.accountService.updateSeed(this.currentAccount, encSeed)

      // update state
      await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', this.currentAccount)
      this.$store.dispatch('temporary/SET_MNEMONIC', seed)
      this.$store.dispatch('notification/ADD_SUCCESS', this.$t('Generate_entropy_increase_success'))

      // redirect
      return this.$router.push({name: 'accounts.createAccount.showMnemonic'})
    } catch (error) {
      console.log('An error happened while generating Mnenomic:', error)
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.MNEMONIC_GENERATION_ERROR)
    }
  }
}
