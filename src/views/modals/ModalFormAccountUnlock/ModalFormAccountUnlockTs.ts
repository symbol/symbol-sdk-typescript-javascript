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

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
// @ts-ignore
import FormAccountUnlock from '@/views/forms/FormAccountUnlock/FormAccountUnlock.vue'

@Component({
  components: {
    FormAccountUnlock,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
  })},
})
export class ModalFormAccountUnlockTs extends Vue {
  @Prop({
    default: false,
  }) visible: boolean

  @Prop({
    default: () => true,
  }) onSuccess: (a: Account, p: Password) => boolean

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

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Hook called when child component FormAccountUnlock emits
   * the 'success' event.
   * @param {Password} password 
   * @return {void}
   */
  public onAccountUnlocked(payload: {account: Account, password: Password}) {
    // - log about unlock success
    this.$store.dispatch('diagnostic/ADD_INFO', `Account ${payload.account.address.plain()} unlocked successfully.`)

    // - emit success
    this.$emit('success', payload.account.publicAccount)

    // - dispatch callback
    this.show = false
    return this.onSuccess(payload.account, payload.password)
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
