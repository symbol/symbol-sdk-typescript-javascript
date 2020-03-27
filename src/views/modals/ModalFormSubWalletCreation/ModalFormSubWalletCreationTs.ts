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

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
// @ts-ignore
import FormSubWalletCreation from '@/views/forms/FormSubWalletCreation/FormSubWalletCreation.vue'

@Component({
  components: {
    FormSubWalletCreation,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
  })},
})
export class ModalFormSubWalletCreationTs extends Vue {
  @Prop({
    default: false,
  }) visible: boolean

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
   * Hook called when child component FormSubWalletCreation emits
   * the 'submit' event.
   * @param {Password} password 
   * @return {void}
   */
  public onSubmit() {
    this.show = false
  }
}
