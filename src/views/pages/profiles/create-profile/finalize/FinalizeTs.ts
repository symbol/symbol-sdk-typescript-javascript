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
import { NetworkType, Password } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
import { AccountService } from '@/services/AccountService'
import { NotificationType } from '@/core/utils/NotificationType'
import { ProfileModel } from '@/core/database/entities/ProfileModel'

@Component({
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      currentProfile: 'profile/currentProfile',
      currentPassword: 'temporary/password',
      currentMnemonic: 'temporary/mnemonic',
    }),
  },
})
export default class FinalizeTs extends Vue {
  /**
   * Currently active networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {ProfileModel}
   */
  public currentProfile: ProfileModel

  /**
   * Temporary stored password
   * @see {Store.Temporary}
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Temporary stored password
   * @see {Store.Temporary}
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: MnemonicPassPhrase

  /**
   * Account Service
   * @var {AccountService}
   */
  public accountService: AccountService = new AccountService()

  /**
   * Finalize the profile creation process by adding
   * the account created from mnemonic pass phrase.
   * @return {void}
   */
  public async submit() {
    // create profile by mnemonic
    const account = this.accountService.getDefaultAccount(
      this.currentProfile,
      this.currentMnemonic,
      this.currentPassword,
      this.networkType,
    )
    // use repository for storage
    this.accountService.saveAccount(account)

    // execute store actions
    await this.$store.dispatch('profile/ADD_ACCOUNT', account)
    await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account)
    await this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', [account.id])
    await this.$store.dispatch('temporary/RESET_STATE')
    await this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)

    // flush and continue
    return this.$router.push({ name: 'dashboard' })
  }
}
