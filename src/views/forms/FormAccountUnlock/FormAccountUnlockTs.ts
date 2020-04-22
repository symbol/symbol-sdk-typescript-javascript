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
import {Account, EncryptedPrivateKey, NetworkType, Password} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
import {WalletModel} from '@/core/database/entities/WalletModel'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ValidationProvider,
    FormWrapper,
    FormRow,
    ErrorTooltip,
  },
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      currentWallet: 'wallet/currentWallet',
    }),
  },
})
export class FormAccountUnlockTs extends Vue {
  /**
   * Current network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Currently active wallet
   * @var {WalletModel}
   */
  public currentWallet: WalletModel

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    password: '',
  }

  /// region computed properties getter/setter
  /// end-region computed properties getter/setter

  /**
   * Attempt decryption of private key to unlock
   * account.
   * @return {void}
   */
  public processVerification() {
    // - create encrypted payload for active wallet
    const encrypted = new EncryptedPrivateKey(
      this.currentWallet.encPrivate,
      this.currentWallet.encIv,
    )

    try {
      // - attempt decryption
      const password = new Password(this.formItems.password)
      const privateKey: string = encrypted.decrypt(password)

      if (privateKey.length === 64) {
        const unlockedAccount = Account.createFromPrivateKey(privateKey, this.networkType)
        return this.$emit('success', {account: unlockedAccount, password})
      }

      return this.$emit('error', this.$t('error_invalid_password'))
    } catch (e) {
      this.$emit('error', e)
    }
  }
}
