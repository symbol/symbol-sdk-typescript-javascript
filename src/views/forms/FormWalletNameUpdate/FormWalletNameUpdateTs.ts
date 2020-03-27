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
import {NetworkType, Password} from 'symbol-sdk'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {NotificationType} from '@/core/utils/NotificationType'
import {WalletService} from '@/services/WalletService'

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

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ModalFormAccountUnlock,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
  })},
})
export class FormWalletNameUpdateTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: string[]

  /**
   * Currently active network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public wallets: WalletService

  /**
   * Wallets repository
   * @var {WalletsRepository}
   */
  public walletsRepository: WalletsRepository

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
   * Current unlocked password
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    name: '',
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
 
  public created() {
    this.wallets = new WalletService(this.$store)
    this.walletsRepository = new WalletsRepository()
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
  public onAccountUnlocked() {
    // - interpret form items
    const values = this.formItems

    try {
      // - update model values
      this.currentWallet.values.set('name', values.name)

      // - use repositories for storage
      this.walletsRepository.update(
        this.currentWallet.getIdentifier(),
        this.currentWallet.values,
      )

      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$emit('submit', this.formItems)
    }
    catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }
}
