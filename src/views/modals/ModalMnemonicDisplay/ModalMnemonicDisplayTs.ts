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
import {Account, Password} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'

// internal dependencies
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
// @ts-ignore
import FormAccountUnlock from '@/views/forms/FormAccountUnlock/FormAccountUnlock.vue'
// @ts-ignore
import MnemonicDisplay from '@/components/MnemonicDisplay/MnemonicDisplay.vue'

@Component({
  components: {
    FormAccountUnlock,
    MnemonicDisplay,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
  })},
})
export class ModalMnemonicDisplayTs extends Vue {
  @Prop({
    default: false,
  }) visible: boolean

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel
  
  public hasMnemonicInfo: boolean = false
  public mnemonic: MnemonicPassPhrase

  /**
   * Visibility state
   * @type {boolean}
   */
  get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  get words(): string[] {
    if (!this.mnemonic) return []
    return this.mnemonic.plain.split(' ')
  }

  /**
   * Hook called when the account has been unlocked
   * @param {Account} account 
   * @return {boolean}
   */
  public onAccountUnlocked(payload: {account: Account, password: Password}): boolean {

    // decrypt seed + create QR
    const encSeed = this.currentAccount.values.get('seed')
    const plnSeed = AESEncryptionService.decrypt(encSeed, payload.password)

    try {
      this.mnemonic = new MnemonicPassPhrase(plnSeed)

      // display mnemonic
      this.hasMnemonicInfo = true
      return true
    }
    catch (e) {
      console.error('error mnemonic: ', e)
    }

    return false
  }

  /**
   * Hook called when child component FormAccountUnlock or
   * HardwareConfirmationButton emit the 'error' event.
   * @param {string} message
   * @return {void}
   */
  public onError(error: string) {
    this.$emit('error', error)
  }
}
