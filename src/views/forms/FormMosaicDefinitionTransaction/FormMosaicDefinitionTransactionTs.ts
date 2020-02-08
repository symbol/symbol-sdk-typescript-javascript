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
import {
  MosaicDefinitionTransaction, MosaicSupplyChangeTransaction, PublicAccount,
  MosaicNonce, MosaicId, MosaicFlags, UInt64, MosaicSupplyChangeAction,
} from 'nem2-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {MosaicDefinitionTransactionParams} from '@/core/transactions/MosaicDefinitionTransactionParams'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {MosaicSupplyChangeTransactionParams} from '@/core/transactions/MosaicSupplyChangeTransactionParams'
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// configuration
import feesConfig from '@/../config/fees.conf.json'

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import SupplyInput from '@/components/SupplyInput/SupplyInput.vue'
// @ts-ignore
import DivisibilityInput from '@/components/DivisibilityInput/DivisibilityInput.vue'
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
    SupplyInput,
    DivisibilityInput,
    DurationInput,
    MaxFeeSelector,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
  })},
})
export class FormMosaicDefinitionTransactionTs extends Vue {
  /**
   * Form items
   * @var {Record<string, any>}
   */
  public formItems = {
    signerPublicKey: '',
    supply: 500000000,
    divisibility: 0,
    supplyMutable: true,
    transferable: true,
    restrictable: true,
    permanent: true,
    duration: 1000,
    maxFee: 0,
  }

  /**
   * Transaction factory
   * @var {TransactionFactory}
   */
  public factory: TransactionFactory = new TransactionFactory(this.$store)

  /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Signer's public account
   * @readonly
   * @type {PublicAccount}
   */
  get publicAccount(): PublicAccount {
    return this.currentWallet.objects.publicAccount
  }

  /**
   * Newly created mosaic nonce and Id
   *
   * @returns {{nonce: MosaicNonce, mosaicId: MosaicId}}
   */
  getNonceAndMosaicId(): {nonce: MosaicNonce, mosaicId: MosaicId} {
    const nonce = MosaicNonce.createRandom()
    const mosaicId = MosaicId.createFromNonce(nonce, this.publicAccount)
    return {nonce, mosaicId}
  }

  /**
   * Mosaic flags
   * @returns {MosaicFlags}
   */
  getMosaicFlags(): MosaicFlags {
    return MosaicFlags.create(
      this.formItems.supplyMutable,
      this.formItems.transferable,
      this.formItems.restrictable,
    )
  }

  /**
   * Mosaic definition transaction
   * @param {MosaicNonce} nonce
   * @param {MosaicId} mosaicId
   * @returns {MosaicDefinitionTransaction}
   */
  getMosaicDefinitionTransaction(nonce: MosaicNonce, mosaicId: MosaicId): MosaicDefinitionTransaction {
    const mosaicFlags = this.getMosaicFlags()
    const {divisibility, permanent, duration, maxFee} = this.formItems
    const params = MosaicDefinitionTransactionParams.create({
      nonce,
      mosaicId,
      mosaicFlags,
      divisibility,
      permanent,
      duration,
      maxFee: UInt64.fromUint(maxFee),
    })

    return this.factory.build('MosaicDefinitionTransaction', params)
  }

  /**
   * Mosaic supply change transaction
   * @param {MosaicId} mosaicId
   * @returns {MosaicSupplyChangeTransaction}
   */
  getMosaicSupplyChangeTransaction(mosaicId: MosaicId): MosaicSupplyChangeTransaction{
    const {supply, maxFee} = this.formItems
    const params = MosaicSupplyChangeTransactionParams.create({
      mosaicId,
      mosaicSupplyChangeAction: MosaicSupplyChangeAction.Increase,
      supply: UInt64.fromUint(supply),
      maxFee: UInt64.fromUint(maxFee),
    })

    return this.factory.build('MosaicSupplyChangeTransaction', params)
  }


  /**
   * Transaction to stage
   */
  getAggregateTransaction() {
    // @TODO
    const {nonce, mosaicId} = this.getNonceAndMosaicId()
    const transactions = [
      this.getMosaicDefinitionTransaction(nonce, mosaicId),
      this.getMosaicSupplyChangeTransaction(mosaicId),
    ]
    console.log("TCL: getAggregateTransaction -> transactions", transactions)
    // @TODO
  }

  /**
   * Process form input
   * @return {void}
   */
  public async onSubmit() {
    const transaction = this.getAggregateTransaction()
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
