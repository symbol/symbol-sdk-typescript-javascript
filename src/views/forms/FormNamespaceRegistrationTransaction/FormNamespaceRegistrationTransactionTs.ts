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
import {UInt64, NamespaceRegistrationTransaction, NamespaceRegistrationType} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {NamespaceRegistrationTransactionParams} from '@/core/transactions/NamespaceRegistrationTransactionParams'

// configuration
import feesConfig from '@/../config/fees.conf.json'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import NamespaceSelector from '@/components/NamespaceSelector/NamespaceSelector.vue'
// @ts-ignore
import NamespaceNameInput from '@/components/NamespaceNameInput/NamespaceNameInput.vue'
// @ts-ignore
import DurationInput from '@/components/DurationInput/DurationInput.vue'
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    FormWrapper,
    SignerSelector,
    NamespaceNameInput,
    NamespaceSelector,
    DurationInput,
    MaxFeeSelector,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
  })},
})
export class FormNamespaceRegistrationTransactionTs extends Vue {
  @Prop({ default: NamespaceRegistrationType.RootNamespace }) namespaceRegistrationType

  /**
   * Form items
   * @var {Record<string, any>}
   */
  public formItems = {
    signerPublicKey: '',
    newNamespaceName: null,
    parentNamespaceName: '',
    duration: 17_2800,
    maxFee: 0,
  }
  /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel
  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory = new TransactionFactory(this.$store)

  /**
   * Namespace Registration Types
   */
  public NamespaceRegistrationType = NamespaceRegistrationType
  /**
   * Namespace registration transaction
   * @returns {NamespaceRegistrationTransaction}
   */
  getNamespaceRegistrationTransaction(): NamespaceRegistrationTransaction {
    const params = this.namespaceRegistrationType === NamespaceRegistrationType.RootNamespace
      ? this.getRootNamespaceParams() : this.getSubNamespaceParams()

    return this.factory.build('NamespaceRegistrationTransaction', params)
  }

  /**
   * Root namespace params
   * @returns {NamespaceRegistrationTransactionParams}
   */
  getRootNamespaceParams(): NamespaceRegistrationTransactionParams {
    return NamespaceRegistrationTransactionParams.create({
      namespaceRegistrationType: this.namespaceRegistrationType,
      rootNamespaceName: this.formItems.newNamespaceName,
      duration: UInt64.fromUint(this.formItems.duration),
      maxFee: UInt64.fromUint(this.formItems.maxFee),
    })
  }

  /**
   * Sub namespace params
   * @returns {NamespaceRegistrationTransactionParams}
   */
  getSubNamespaceParams(): NamespaceRegistrationTransactionParams {
    return NamespaceRegistrationTransactionParams.create({
      namespaceRegistrationType: this.namespaceRegistrationType,
      rootNamespaceName: this.formItems.parentNamespaceName,
      subNamespaceName: this.formItems.newNamespaceName,
      maxFee: UInt64.fromUint(this.formItems.maxFee),
    })
  }

  /**
   * Transaction to stage
   */
  getTransaction() {
    // @TODO: multisig
    const transaction = this.getNamespaceRegistrationTransaction()
    console.log("TCL: getAggregateTransaction -> transactions", transaction)
    return transaction
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {
    const transaction = this.getTransaction()
    await this.$store.dispatch('wallet/ADD_STAGED_TRANSACTION', transaction)
  }

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  created() {
    this.formItems.signerPublicKey = this.currentWallet.values.get('publicKey')
    this.formItems.maxFee = feesConfig['single'].find(s => s.speed === 'NORMAL').value * Math.pow(10, 6)
  }
}
