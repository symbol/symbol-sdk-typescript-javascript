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
import {Address, Transaction, TransactionType, TransferTransaction, NamespaceId, NamespaceName} from 'symbol-sdk'

@Component
export class ActionDisplayTs extends Vue {
  /**
   * Transaction
   * @type {Transaction}
   */
  @Prop({ default: null }) transaction: Transaction

  /**
   * Action descriptor
   * @var {string}
   */
  public descriptor: string = ''

  /**
   * Transaction type from SDK
   * @type {TransactionType}
   */
  private transactionType = TransactionType

  /**
   * Whether the transaction needs a cosignature
   * // @TODO
   * @protected
   * @type {boolean}
   */
  protected needsCosignature: boolean = false

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public created() {
    // - load transaction details
    this.loadDetails()
  }

  /// region computed properties getter/setter
  /// end-region computed properties getter/setter

  /**
   * Load transaction details
   * @return {Promise<void>}
   */
  protected async loadDetails(): Promise<void> {
    // in case of normal transfer, display pretty address
    if (this.transaction.type === this.transactionType.TRANSFER
      && (this.transaction as TransferTransaction).recipientAddress instanceof Address) {
      const transaction = this.transaction as TransferTransaction
      const recipient = transaction.recipientAddress as Address
      this.descriptor = recipient.pretty()
    }
    // - in case of transfer to a namespace id, resolve namespace name
    else if (this.transaction.type === this.transactionType.TRANSFER
      && (this.transaction as TransferTransaction).recipientAddress instanceof NamespaceId) {
      const id = ((this.transaction as TransferTransaction).recipientAddress as NamespaceId)
      const namespaceNames: NamespaceName[] = await this.$store.dispatch('namespace/REST_FETCH_NAMES', [id])
      this.descriptor = namespaceNames.shift().name
    }
    // - otherwise use *translated* transaction descriptor
    else {
      this.descriptor = this.$t(`transaction_descriptor_${this.transaction.type}`).toString()
    }
  }
}
