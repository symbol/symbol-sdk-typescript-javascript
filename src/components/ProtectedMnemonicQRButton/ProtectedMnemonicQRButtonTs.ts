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
import {Account, Password, Convert} from 'nem2-sdk'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {UIHelpers} from '@/core/utils/UIHelpers'
import {AESEncryptionService} from '@/services/AESEncryptionService'

// child components
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'

@Component({
  components: {
    ModalFormAccountUnlock,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
  })}
})
export class ProtectedMnemonicQRButtonTs extends Vue {
  @Prop({
    default: null
  }) wallet: WalletsModel

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * UI Helpers
   * @var {UIHelpers}
   */
  public uiHelpers = UIHelpers

  /**
   * Whether account is currently being unlocked
   * @var {boolean}
   */
  public isUnlockingAccount: boolean = false

/// region computed properties getter/setter
  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }
/// end-region computed properties getter/setter

  /**
   * Hook called when the account unlock modal must open
   * @return {void}
   */
  public onClickDisplay() {
    this.hasAccountUnlockModal = true
  }

  /**
   * Hook called when the account has been unlocked
   * @param {Account} account 
   * @return {boolean}
   */
  public onAccountUnlocked(account: Account, password: Password): boolean {

    // decrypt seed + create QR
    const encSeed = this.currentAccount.values.get('seed')
    const plnSeed = AESEncryptionService.decrypt(encSeed, password)

    this.hasAccountUnlockModal = false
    return true
  }
}
