/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
import { ProfileModel } from '@/core/database/entities/ProfileModel'

import { NotificationType } from '@/core/utils/NotificationType'
import { Password, Crypto } from 'symbol-sdk'
// @ts-ignore
import MnemonicInput from '@/components/MnemonicInput/MnemonicInput.vue'
import { ProfileService } from '@/services/ProfileService'

@Component({
  components: { MnemonicInput },
  computed: {
    ...mapGetters({
      currentProfile: 'profile/currentProfile',
      currentPassword: 'temporary/password',
    }),
  },
})
export default class ImportMnemonicTs extends Vue {
  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {string}
   */
  public currentProfile: ProfileModel

  /**
   * Previous step's password
   * @see {Store.Temporary}
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Profile service
   * @var {ProfileService}
   */
  public profileService: ProfileService = new ProfileService()

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    seed: '',
  }
  /**
   * @description: Receive the Input words
   * @type: Array<string>
   */
  public wordsArray: Array<string> = []

  /**
   * Delete profile and go back
   * @return {void}
   */
  public deleteProfileAndBack() {
    // - delete the temporary profile from storage
    this.profileService.deleteProfile(this.currentProfile.profileName)
    this.$store.dispatch('profile/RESET_STATE')

    // - back to previous page
    this.$router.push({ name: 'profiles.importProfile.info' })
  }

  /**
   * @description: receive input words and control the ui
   * @return: void
   */
  public setSeed(wordsArray) {
    this.wordsArray = wordsArray
    if (wordsArray.length > 0) {
      this.formItems.seed = wordsArray.join(' ')
    }
  }

  /**
   * Process to mnemonic pass phrase verification
   * @return {void}
   */
  public processVerification() {
    if (!this.formItems.seed || !this.formItems.seed.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.INPUT_EMPTY_ERROR)
    }

    try {
      // - verify validity of mnemonic
      const mnemonic = new MnemonicPassPhrase(this.formItems.seed)

      if (!mnemonic.isValid()) {
        throw new Error('Invalid mnemonic pass phrase')
      }

      // encrypt seed for storage
      const encSeed = Crypto.encrypt(mnemonic.plain, this.currentPassword.value)

      this.profileService.updateSeed(this.currentProfile, encSeed)

      // update state
      this.$store.dispatch('notification/ADD_SUCCESS', this.$t('Generate_entropy_increase_success'))
      this.$store.dispatch('temporary/SET_MNEMONIC', mnemonic.plain)

      // redirect
      return this.$router.push({
        name: 'profiles.importProfile.walletSelection',
      })
    } catch (e) {
      console.log('An error happened while importing Mnenomic:', e)
      return this.$store.dispatch('notification/ADD_ERROR', this.$t('invalid_mnemonic_input'))
    }
  }
}
