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
// external dependencies
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// child components
// @ts-ignore
import AccountNameDisplay from '@/components/AccountNameDisplay/AccountNameDisplay.vue'
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue'
// @ts-ignore
import ImportanceScoreDisplay from '@/components/ImportanceScoreDisplay/ImportanceScoreDisplay.vue'
// @ts-ignore
import AccountContactQR from '@/components/AccountContactQR/AccountContactQR.vue'
// @ts-ignore
import AccountAddressDisplay from '@/components/AccountAddressDisplay/AccountAddressDisplay.vue'
// @ts-ignore
import AccountPublicKeyDisplay from '@/components/AccountPublicKeyDisplay/AccountPublicKeyDisplay.vue'
// @ts-ignore
import AccountActions from '@/components/AccountActions/AccountActions.vue'
// @ts-ignore
import AccountLinks from '@/components/AccountLinks/AccountLinks.vue'
// @ts-ignore
import AccountAliasDisplay from '@/components/AccountAliasDisplay/AccountAliasDisplay.vue'
import { AccountModel } from '@/core/database/entities/AccountModel'

@Component({
  components: {
    AccountNameDisplay,
    ProtectedPrivateKeyDisplay,
    ImportanceScoreDisplay,
    AccountContactQR,
    AccountActions,
    AccountLinks,
    AccountAddressDisplay,
    AccountPublicKeyDisplay,
    AccountAliasDisplay,
  },
  computed: {
    ...mapGetters({
      defaultAccount: 'app/defaultAccount',
      currentAccount: 'account/currentAccount',
    }),
  },
})
export class AccountDetailsPageTs extends Vue {
  /**
   * Default account
   * @see {Store.Account}
   * @var {string}
   */
  public defaultAccount: string

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountModel}
   */
  public currentAccount: AccountModel
}
