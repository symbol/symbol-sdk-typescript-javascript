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
import {NotificationType} from '@/core/utils/NotificationType'
import {AccountService} from '@/services/AccountService'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

/// region custom types
type NetworkNodeEntry = {value: NetworkType, label: string}
/// end-region custom types

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
  },
  computed: {...mapGetters({
    generationHash: 'network/generationHash',
    currentAccount: 'account/currentAccount',
  })},
})
export class FormAccountCreationTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active network type
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

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
    networkType: this.$store.getters['network/networkType'],
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

  /**
   * Type the ValidationObserver refs 
   * @type {{
    *     observer: InstanceType<typeof ValidationObserver>
    *   }}
    */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

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
    // @VEE
    this.persistAccountAndContinue()
    this.resetValidations()
  }

  /**
   *  resets form validation    
   */ 
  public resetValidations(): void{
    this.$refs && this.$refs.observer && this.$refs.observer.reset()
  }

  /**
   * Persist created account and redirect to next step
   * @return {void} 
   */
  private persistAccountAndContinue() {
    // -  password stored as hash (never plain.)
    const service = new AccountService(this.$store)
    const passwordHash = service.getPasswordHash(new Password(this.formItems.password))
    
    // - populate model
    const model = new AccountsModel(new Map<string, any>([
      [ 'accountName', this.formItems.accountName ],
      [ 'wallets', [] ],
      [ 'password', passwordHash ],
      [ 'hint', this.formItems.hint ],
      [ 'networkType', this.formItems.networkType ],
      [ 'seed', '' ],
      [ 'generationHash', this.generationHash ],
    ]))

    // use repository for storage
    this.accountsRepository.create(model.values)

    // execute store actions
    this.$store.dispatch('account/SET_CURRENT_ACCOUNT', model)
    this.$store.dispatch('temporary/SET_PASSWORD', this.formItems.password)
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)

    // flush and continue
    this.$router.push({name: this.nextPage})
  }
}
