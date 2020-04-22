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
// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {AccountService} from '@/services/AccountService'
// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'
import {NotificationType} from '@/core/utils/NotificationType'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {WalletService} from '@/services/WalletService'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ModalFormAccountUnlock,
  },
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class FormAccountPasswordUpdateTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountModel

  private networkConfiguration: NetworkConfigurationModel
  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Whether account is currently being unlocked
   * @var {boolean}
   */
  public isUnlockingAccount: boolean = false

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    password: '',
    passwordConfirm: '',
    passwordHint: '',
  }

  /**
   * Type the ValidationObserver refs
   * @type {{
   *     observer: InstanceType<typeof ValidationObserver>
   *   }}
   */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  /// region computed properties getter/setter
  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }

  /// end-region computed properties getter/setter

  /**
   * Submit action asks for account unlock
   * @return {void}
   */
  public onSubmit() {
    this.hasAccountUnlockModal = true

    // resets form validation
    this.$nextTick(() => {
      this.$refs.observer.reset()
    })
  }

  /**
   * When account is unlocked, the sub wallet can be created
   */
  public async onAccountUnlocked(account: Account, oldPassword: Password) {
    try {
      const accountService = new AccountService()
      const newPassword = new Password(this.formItems.password)
      const oldSeed = this.currentAccount.seed
      const plainSeed = AESEncryptionService.decrypt(oldSeed, oldPassword)
      const newSeed = AESEncryptionService.encrypt(plainSeed, newPassword)

      // // - create new password hash
      const passwordHash = AccountService.getPasswordHash(newPassword)
      accountService.updatePassword(this.currentAccount, passwordHash, this.formItems.passwordHint,
        newSeed)

      const walletService = new WalletService()
      const walletIdentifiers = this.currentAccount.wallets

      const wallets = walletService.getKnownWallets(walletIdentifiers)
      for (const model of wallets) {
        const updatedModel = walletService.updateWalletPassword(model, oldPassword, newPassword)
        walletService.saveWallet(updatedModel)
      }


      // - update state and finalize
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS_PASSWORD_CHANGED)
      await this.$store.dispatch('account/LOG_OUT')
      setTimeout(() => {this.$router.push({name: 'accounts.login'})}, 500)
    } catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }
}
