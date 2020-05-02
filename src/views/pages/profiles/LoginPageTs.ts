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
import { mapGetters } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'
import { NetworkType, Password } from 'symbol-sdk'
// internal dependencies
import { $eventBus } from '@/events'
import { NotificationType } from '@/core/utils/NotificationType'
import { ValidationRuleset } from '@/core/validation/ValidationRuleset'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountModel } from '@/core/database/entities/AccountModel'
import { ProfileService } from '@/services/ProfileService'
// child components
// @ts-ignore
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue'
// configuration
import { SettingService } from '@/services/SettingService'
import { SettingsModel } from '@/core/database/entities/SettingsModel'
import { AccountService } from '@/services/AccountService'
import { NetworkTypeHelper } from '@/core/utils/NetworkTypeHelper'

@Component({
  computed: {
    ...mapGetters({
      currentProfile: 'profile/currentProfile',
      isAuthenticated: 'profile/isAuthenticated',
    }),
  },
  components: {
    ErrorTooltip,
    ValidationProvider,
    ValidationObserver,
    LanguageSelector,
  },
})
export default class LoginPageTs extends Vue {
  /**
   * All known profiles
   */
  private profiles: ProfileModel[]

  /**
   * Profiles indexed by network type
   */
  private profilesClassifiedByNetworkType: {
    networkType: NetworkType
    profiles: ProfileModel[]
  }[]
  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {string}
   */
  public currentProfile: ProfileModel

  /**
   * Profiles repository
   * @var {ProfileService}
   */
  public profileService = new ProfileService()

  public accountService = new AccountService()

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form items
   */
  public formItems: any = {
    currentProfileName: '',
    password: '',
    hasHint: false,
  }

  /// end-region computed properties getter/setter

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  public created() {
    this.profiles = this.profileService.getProfiles()

    const reducer = (
      accumulator: { networkType: NetworkType; profiles: ProfileModel[] }[],
      currentValue: ProfileModel,
    ) => {
      const currentAccumulator = accumulator.find((a) => a.networkType == currentValue.networkType)
      if (currentAccumulator) {
        currentAccumulator.profiles.push(currentValue)
        return accumulator
      } else {
        return [...accumulator, { networkType: currentValue.networkType, profiles: [currentValue] }]
      }
    }

    this.profilesClassifiedByNetworkType = this.profiles.reduce(reducer, [])
    if (!this.profiles.length) {
      return
    }
    // accounts available, iterate to first profiles
    this.formItems.currentProfileName = this.profiles[0].profileName
  }

  /**
   * Getter for network type label
   * @param {NetworkType} networkType
   * @return {string}
   */
  public getNetworkTypeLabel(networkType: NetworkType): string {
    return NetworkTypeHelper.getNetworkTypeLabel(networkType)
  }

  /**
   * Get profile password hint
   * XXX should be encrypted with accessSalt.
   * @return {string}
   */
  public getPasswordHint(): string {
    const profileName = this.formItems.currentProfileName
    const profile = this.profileService.getProfileByName(profileName)
    return (profile && profile.hint) || ''
  }

  /**
   * Submit action, validates form and logs in user if valid
   * @return {void}
   */
  public async submit() {
    if (!this.formItems.currentProfileName.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.PROFILE_NAME_INPUT_ERROR)
    }

    if (!this.formItems.password.length || this.formItems.password.length < 8) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
    }

    // now compare password hashes
    return this.processLogin()
  }

  /**
   * Process login request.
   * @return {void}
   */
  private async processLogin() {
    const currentProfileName = this.formItems.currentProfileName
    const profile = this.profileService.getProfileByName(currentProfileName)
    const settingService = new SettingService()

    // if profile doesn't exist, authentication is not valid
    if (!profile) {
      return this.$store.dispatch('notification/ADD_ERROR', 'Invalid login attempt')
    }

    // profile exists, fetch data
    const settings: SettingsModel = settingService.getProfileSettings(currentProfileName)

    const knownAccounts: AccountModel[] = this.accountService.getKnownAccounts(profile.accounts)
    if (knownAccounts.length == 0) {
      throw new Error('knownAccounts is empty')
    }

    // use service to generate password hash
    const passwordHash = ProfileService.getPasswordHash(new Password(this.formItems.password))

    // read profile's password hash and compare
    if (profile.password !== passwordHash) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
    }

    // if profile setup was not finalized, redirect
    if (!profile.seed) {
      this.$store.dispatch('profile/SET_CURRENT_PROFILE', profile)
      this.$store.dispatch('temporary/SET_PASSWORD', this.formItems.password)
      this.$store.dispatch(
        'diagnostic/ADD_WARNING',
        'Profile has not setup mnemonic pass phrase, redirecting: ' + currentProfileName,
      )
      return this.$router.push({
        name: 'profiles.createProfile.generateMnemonic',
      })
    }

    // read default account from settings
    const defaultAccountId = settings.defaultAccount ? settings.defaultAccount : knownAccounts[0].id
    if (!defaultAccountId) {
      throw new Error('defaultAccountId could not be resolved')
    }
    const defaultAccount = knownAccounts.find((w) => w.id == defaultAccountId)
    if (!defaultAccount) {
      throw new Error(`defaultAccount could not be resolved from id ${defaultAccountId}`)
    }

    // LOGIN SUCCESS: update app state
    await this.$store.dispatch('profile/SET_CURRENT_PROFILE', profile)
    await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', defaultAccount)
    this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', profile.accounts)
    this.$store.dispatch(
      'diagnostic/ADD_DEBUG',
      'Profile login successful with currentProfileName: ' + currentProfileName,
    )

    $eventBus.$emit('onLogin', currentProfileName)
    return this.$router.push({ name: 'dashboard' })
  }
}
