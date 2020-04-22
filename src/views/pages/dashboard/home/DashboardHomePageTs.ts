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
import {WalletModel} from '@/core/database/entities/WalletModel'
// child components
// @ts-ignore
import TransactionList from '@/components/TransactionList/TransactionList.vue'
import {Address} from 'symbol-sdk'

@Component({
  components: {
    TransactionList,
  },
  computed: {
    ...mapGetters({
      currentWallet: 'wallet/currentWallet',
    }),
  },
})
export class DashboardHomePageTs extends Vue {
  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletModel}
   */
  public currentWallet: WalletModel

  public get walletAddress(): Address {
    return this.currentWallet && WalletModel.getObjects(this.currentWallet).address
  }
}