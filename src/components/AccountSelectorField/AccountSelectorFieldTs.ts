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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel'
import { AccountService } from '@/services/AccountService'

@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      knownAccounts: 'account/knownAccounts',
    }),
  },
})
export class AccountSelectorFieldTs extends Vue {
  @Prop({
    default: null,
  })
  value: string

  @Prop({
    default: false,
  })
  defaultFormStyle: boolean

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountModel}
   */
  public currentAccount: AccountModel

  /**
   * Known accounts
   */
  public knownAccounts: AccountModel[]

  /**
   * Accounts repository
   * @var {AccountService}
   */
  public readonly accountService: AccountService = new AccountService()

  /// region computed properties getter/setter
  public get currentAccountIdentifier(): string {
    if (this.value) return this.value

    if (this.currentAccount) {
      return this.currentAccount.id
    }

    // fallback value
    return ''
  }

  public set currentAccountIdentifier(id: string) {
    if (!id || !id.length) return

    this.$emit('input', id)

    const account = this.accountService.getAccount(id)
    if (!account) return
  }

  public get currentAccounts(): AccountModel[] {
    return this.knownAccounts
  }

  /**
   * Truncates the account name if it is too long
   * @protected
   * @param {string} str
   * @returns {string}
   */
  protected truncate(str: string): string {
    const maxStringLength = 15
    if (str.length <= maxStringLength) return str
    return `${str.substring(0, 9)}...${str.substring(str.length - 3)}`
  }

  /// end-region computed properties getter/setter
}
