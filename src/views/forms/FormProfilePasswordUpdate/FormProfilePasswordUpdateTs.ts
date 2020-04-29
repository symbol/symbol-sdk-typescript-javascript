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
import {Password, Crypto} from 'symbol-sdk'
// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {ProfileService} from '@/services/ProfileService'
// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue'
import {NotificationType} from '@/core/utils/NotificationType'
import {ProfileModel} from '@/core/database/entities/ProfileModel'
import {AccountService} from '@/services/AccountService'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ModalFormProfileUnlock,
  },
  computed: {
    ...mapGetters({
      currentProfile: 'profile/currentProfile',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class FormProfilePasswordUpdateTs extends Vue {
  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {ProfileModel}
   */
  public currentProfile: ProfileModel

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
   * When account is unlocked, the sub account can be created
   */
  public async onAccountUnlocked(account: Account, oldPassword: Password) {
    try {
      const profileService = new ProfileService()
      const newPassword = new Password(this.formItems.password)
      const oldSeed = this.currentProfile.seed
      const plainSeed = Crypto.decrypt(oldSeed, oldPassword.value)
      const newSeed = Crypto.encrypt(plainSeed, newPassword.value)

      // // - create new password hash
      const passwordHash = ProfileService.getPasswordHash(newPassword)
      profileService.updatePassword(this.currentProfile, passwordHash, this.formItems.passwordHint,
        newSeed)

      const accountService = new AccountService()
      const accountIdentifiers = this.currentProfile.accounts

      const accounts = accountService.getKnownAccounts(accountIdentifiers)
      for (const model of accounts) {
        const updatedModel = accountService.updateWalletPassword(model, oldPassword, newPassword)
        accountService.saveAccount(updatedModel)
      }


      // - update state and finalize
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS_PASSWORD_CHANGED)
      await this.$store.dispatch('profile/LOG_OUT')
      setTimeout(() => {this.$router.push({name: 'profiles.login'})}, 500)
    } catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }
}
