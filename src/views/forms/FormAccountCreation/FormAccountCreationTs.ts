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
import {Component, Provide, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {NetworkType, Password} from 'nem2-sdk'

// internal dependencies
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'
import {NotificationType} from '@/core/utils/NotificationType'
import {AppAccount} from '@/core/database/models/AppAccount'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

/// region custom types
type NetworkNodeEntry = {value: NetworkType, label: string}
/// end-region custom types

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
  })},
})
export class FormAccountCreationTs extends Vue {
  @Provide() validator: any = this.$validator

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Accounts repository
   * @var {AccountsRepository}
   */
  public accountsRepository = new AccountsRepository()

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    accountName: '',
    password: '',
    passwordAgain: '',
    hint: '',
    networkType: NetworkType.TEST_NET,
  }

  /**
   * Network types
   * @var {NetworkNodeEntry[]}
   */
  public networkTypeList: NetworkNodeEntry[] = [
    {value: NetworkType.MIJIN_TEST, label: 'MIJIN_TEST'},
    {value: NetworkType.MAIN_NET, label: 'MAIN_NET'},
    {value: NetworkType.TEST_NET, label: 'TEST_NET'},
    {value: NetworkType.MIJIN, label: 'MIJIN'},
  ]

/// region computed properties getter/setter
  get nextPage() {
    return this.$route.meta.nextPage
  }
/// end-region computed properties getter/setter

  /**
   * Submit action, validates form and creates account in storage
   * @return {void}
   */
  public submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.persistAccountAndContinue()
      })
  }

  /**
   * Persist created account and redirect to next step
   * @return {void} 
   */
  private persistAccountAndContinue() {
    // persist newly created account
    const account = new AppAccount(
      this.$store,
      this.formItems.accountName,
      [],
      this.formItems.password,
      this.formItems.hint,
      this.networkType,
    )

    // use repository for storage
    this.accountsRepository.create(account.model.values)

    // execute store actions
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
    this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account.model)
    this.$store.dispatch('temporary/SET_PASSWORD', this.formItems.password)

    // flush and continue
    this.$router.push({name: this.nextPage})
  }
}
