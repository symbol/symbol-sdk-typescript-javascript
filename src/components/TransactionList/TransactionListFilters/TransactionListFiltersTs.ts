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
import {mapGetters} from 'vuex'
import {Component, Prop, Vue} from 'vue-property-decorator'
import {NetworkType} from 'symbol-sdk'
// child components
// @ts-ignore
import TransactionAddressFilter from '@/components/TransactionList/TransactionListFilters/TransactionAddressFilter/TransactionAddressFilter.vue'
// @ts-ignore
import TransactionStatusFilter from '@/components/TransactionList/TransactionListFilters/TransactionStatusFilter/TransactionStatusFilter.vue'
import {Signer} from '@/store/Account'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {TransactionGroup} from '@/store/Transaction'


@Component({
  components: {TransactionAddressFilter, TransactionStatusFilter},
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      networkType: 'network/networkType',
      signers: 'account/signers',
    }),
  },
})

export class TransactionListFiltersTs extends Vue {
  @Prop({default: TransactionGroup.confirmed}) currentTab: TransactionGroup
  /**
   * Currently active account
   * @var {AccountModel}
   */
  protected currentAccount: AccountModel

  /**
   * Network type
   * @var {NetworkType}
   */
  protected networkType: NetworkType

  /**
   * current signers
   */
  public signers: Signer[]

  /**
   * set the default to select all
   */
  protected selectedOption = TransactionGroup.all

  /**
   * Hook called when the signer selector has changed
   * @protected
   */
  protected onSignerSelectorChange(publicKey: string): void {
    // clear previous account transactions
    if (publicKey)
    {this.$store.dispatch('account/SET_CURRENT_SIGNER', {publicKey})}
  }

  protected onStatusSelectorChange(filter: TransactionGroup) {
    this.$emit('option-change', filter)
  }

  /**
   * Hook called before the component is destroyed
   */
  beforeDestroy(): void {
    // reset the selected signer if it is not the current account
    if (this.currentAccount) {
      this.onSignerSelectorChange(this.currentAccount.publicKey)
    }
  }
}
