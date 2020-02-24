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
// external dependencies
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Address, AccountHttp, PublicAccount, NetworkType} from 'nem2-sdk'
import {timeout, finalize} from 'rxjs/operators'

// internal dependencies
import {AddressValidator} from '@/core/validation/validators'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {NotificationType} from '@/core/utils/NotificationType'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormRow,
    ButtonAdd,
  },
  computed: {
    ...mapGetters({
      currentPeer: 'network/currentPeer',
      networkType: 'network/networkType',
    }),
  },
})
export class AddCosignatoryInputTs extends Vue {
  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Current peer
   * @private
   * @type {string}
   */
  private currentPeer: any

  /**
   * Current network type
   * @private
   * @type {NetworkType}
   */
  private networkType: NetworkType

  /**
   * Cosignatory input (address or public key)
   * @protected
   * @type {string}
   */
  public cosignatory: string = ''

  /**
   * Handles the form submission
   * @protected
   * @return {void}
   */
  protected onAddCosignatory(): void {
    if (AddressValidator.validate(this.cosignatory)) {
      this.addCosignerFromAddress()
      return
    }

    this.addCosignerFromPublicKey()
  }

  /**
   * Emits onAddCosignatory event when cosignatory is input as a public key
   * @private
   * @return {void}
   */
  private addCosignerFromPublicKey(): void {
    if (!this.cosignatory) return
    const publicAccount = PublicAccount.createFromPublicKey(this.cosignatory, this.networkType)
    this.$emit('on-add-cosignatory', publicAccount)
  }

  /**
   * Emits onAddCosignatory event when cosignatory is input as a public key
   * @private
   * @return {void}
   */
  private async addCosignerFromAddress() {
    const address = Address.createFromRawAddress(this.cosignatory)
    this.$store.dispatch('app/SET_LOADING_OVERLAY', {
      show: true,
      message: `${this.$t('resolving_address', {address: address.pretty()})}`,
    })

    new AccountHttp(this.currentPeer.url)
      .getAccountInfo(address)
      .pipe(
        timeout(6000),
        finalize(() => {
          // @ts-ignore
          this.$Spin.hide()
          this.$store.dispatch('app/SET_LOADING_OVERLAY', {
            show: false,
            message: '',
          })
        }))
      .subscribe(
        (accountInfo) => {
          if (accountInfo.publicKey === '0000000000000000000000000000000000000000000000000000000000000000') {
            this.$store.dispatch('notification/ADD_WARNING', `${this.$t(NotificationType.ADDRESS_UNKNOWN)}`)
            return
          }
          this.$emit('on-add-cosignatory', accountInfo.publicAccount)
        },
        () => {
          this.$store.dispatch('notification/ADD_WARNING', `${this.$t(NotificationType.ADDRESS_UNKNOWN)}`)
        })
  }
}
