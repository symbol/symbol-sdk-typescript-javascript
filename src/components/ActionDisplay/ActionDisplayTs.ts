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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {Address, Transaction, TransactionType, TransferTransaction, NamespaceId, NamespaceName} from 'nem2-sdk'

// internal dependencies
import {TransactionService} from '@/services/TransactionService'

@Component
export class ActionDisplayTs extends Vue {

  @Prop({
    default: null
  }) transaction: Transaction

  /**
   * Action descriptor
   * @var {string}
   */
  public descriptor: string

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.service = new TransactionService(this.$store)

    // - load transaction details
    this.loadDetails()
  }

/// region computed properties getter/setter
  public get details(): string {
    // - overwrite descriptor in case of transaction with address
    if (this.transaction.type === TransactionType.TRANSFER
      && (this.transaction as TransferTransaction).recipientAddress instanceof Address) {
      const transaction = this.transaction as TransferTransaction
      const recipient = transaction.recipientAddress as Address
      this.descriptor = recipient.pretty()
    }

    return this.descriptor
  }
/// end-region computed properties getter/setter

  /**
   * Load transaction details
   * @return {void}
   */
  protected async loadDetails() {
    // - in case of transfer to a namespace id, resolve namespace name
    if (this.transaction.type === TransactionType.TRANSFER
      && (this.transaction as TransferTransaction).recipientAddress instanceof NamespaceId) {
      const id = ((this.transaction as TransferTransaction).recipientAddress as NamespaceId)
      const namespaceNames: NamespaceName[] = await this.$store.dispatch('namespace/REST_FETCH_NAMES', [id])
      this.descriptor = namespaceNames.shift().name
    }
    // - otherwise use *translated* transaction descriptor
    else if (this.transaction.type !== TransactionType.TRANSFER) {
      this.descriptor = this.$t('transaction_descriptor_' + this.transaction.type).toString()
    }
    // - ...
  }
}
