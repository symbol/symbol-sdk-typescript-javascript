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

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {NotificationType} from '@/core/utils/NotificationType'
import {Password} from 'nem2-sdk'
import {AESEncryptionService} from '@/services/AESEncryptionService'

@Component({computed: {...mapGetters({
  currentAccount: 'account/currentAccount',
  currentPassword: 'temporary/password',
})}})
export default class ImportMnemonicTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Previous step's password
   * @see {Store.Temporary}
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Account repository
   * @var {AccountsRepository}
   */
  public accounts: AccountsRepository

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    seed: ''
  }

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.accounts = new AccountsRepository()
  }

  /**
   * Delete account and go back
   * @return {void}
   */
  public deleteAccountAndBack() {
    // - delete the temporary account from storage
    const identifier = this.currentAccount.getIdentifier()
    this.accounts.delete(identifier)

    // - back to previous page
    this.$router.push({name: 'accounts.importAccount.info'})
  }

  /**
   * Process to mnemonic pass phrase verification
   * @return {void}
   */
  public processVerification() {
    if (!this.formItems.seed || !this.formItems.seed.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.INPUT_EMPTY_ERROR)
    }

    try {
      // - verify validity of mnemonic
      const mnemonic = new MnemonicPassPhrase(this.formItems.seed)
    
      if (!mnemonic.isValid()) {
        throw new Error('Invalid mnemonic pass phrase')
      }
  
      // encrypt seed for storage
      const encSeed = AESEncryptionService.encrypt(
        mnemonic.toSeed(this.currentPassword.value).toString('hex'),
        this.currentPassword,
      )
      // update currentAccount instance and storage
      this.currentAccount.values.set('seed', encSeed)
      this.accounts.update(this.currentAccount.getIdentifier(), this.currentAccount.values)

      // update state
      this.$store.dispatch('notification/ADD_SUCCESS', this.$t('Generate_entropy_increase_success'))
      this.$store.dispatch('temporary/SET_MNEMONIC', mnemonic.plain)

      // redirect
      return this.$router.push({name: 'accounts.importAccount.walletSelection'})
    }
    catch(e) {
      return this.$store.dispatch('notification/ADD_ERROR', this.$t('invalid_mnemonic_input'))
    }
  }
}
