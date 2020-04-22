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
// internal dependencies
import {NotificationType} from '@/core/utils/NotificationType'
// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ExplorerUrlSetter from '@/components/ExplorerUrlSetter/ExplorerUrlSetter.vue'
// @ts-ignore
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
// @ts-ignore
import WalletSelectorField from '@/components/WalletSelectorField/WalletSelectorField.vue'
// @ts-ignore
import ModalFormAccountUnlock from '@/views/modals/ModalFormAccountUnlock/ModalFormAccountUnlock.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'
import {SettingsModel} from '@/core/database/entities/SettingsModel'
import {WalletModel} from '@/core/database/entities/WalletModel'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ExplorerUrlSetter,
    LanguageSelector,
    MaxFeeSelector,
    WalletSelectorField,
    ModalFormAccountUnlock,
    FormLabel,
  },
  computed: {
    ...mapGetters({
      settings: 'app/settings',
      knownWallets: 'wallet/knownWallets',
    }),
  },
})
export class FormGeneralSettingsTs extends Vue {

  /**
   * The current stored settings.
   */
  public settings: SettingsModel


  /**
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: WalletModel[]

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
    defaultFee: 0,
    language: '',
    explorerUrl: '',
    defaultWallet: '',
  }

  public created() {
    this.resetForm()
  }

  public resetForm() {
    this.formItems = {...this.settings}
    if (!this.settings.defaultWallet && this.knownWallets.length) {
      this.formItems.defaultWallet = this.knownWallets[0].id
    }
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
  }

  /**
   * When account is unlocked, the sub wallet can be created
   */
  public async onAccountUnlocked() {

    try {
      await this.$store.dispatch('app/SET_SETTINGS', this.formItems)
      // - add notification and emit
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.SUCCESS_SETTINGS_UPDATED)
      this.$emit('submit', this.formItems)
    } catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }
}