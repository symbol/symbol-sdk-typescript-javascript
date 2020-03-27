/**
 * 
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
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
import {Store} from 'vuex'
import {Transaction, TransactionInfo} from 'symbol-sdk'

export abstract class TransactionView<FormFieldsType> {

  /**
   * Fields that are common to all transaction types
   * @var {string[]}
   */
  protected readonly common: string[] = [
    'signature',
    'signerPublicKey',
    'networkType',
    'type',
    'deadline',
    'effectiveFee',
    'isIncoming',
    'hasBlockInfo',
  ]

  /**
   * Fields that are specific to extending transaction types
   * @var {string[]}
   */
  protected readonly fields: string[]

  /**
   * Vuex store instance
   * @var {Store<any>}
   */
  protected readonly $store: Store<any>

  /**
   * Values that are specific to extending transaction types
   * @var {Map<string, any>}
   */
  public values: Map<string, any>

  /**
   * The transaction header info
   * @var {TransactionInfo}
   */
  public info: TransactionInfo

  /**
   * The transaction body
   * @var {Transaction}
   */
  public transaction: Transaction

  /**
   * Construct a transaction view around \a store
   * @param {Store<any>} store 
   */
  public constructor(store: Store<any>) {
    this.$store = store
    this.values = new Map<string, any>()
  }

  /// region abstract methods
  /**
   * Parse form items and return a TransactionView
   * @param {FormFieldsType} formItems
   * @return {TransactionView<FormFieldsType>}
   */
  public abstract parse(formItems: FormFieldsType): TransactionView<FormFieldsType>

  /**
   * Use a transaction object and return a TransactionView
   * @param {Transaction} transaction
   * @return {TransactionView<FormFieldsType>}
   */
  public abstract use(transaction: Transaction): TransactionView<FormFieldsType>
  /// end-region abstract methods

  /**
   * Initialize a transaction view around \a transaction
   * @param {Transaction} transaction
   * @return {TransactionView<FormFieldsType>}
   */
  protected initialize(transaction: Transaction): TransactionView<FormFieldsType> {
    if (!!transaction.transactionInfo) {
      this.info = transaction.transactionInfo
    }

    // - signed transaction fields
    this.values.set('signature', transaction.signature)

    if (!!transaction.signer) {
      this.values.set('signerPublicKey', transaction.signer.publicKey)
    }

    // - network related fields
    this.values.set('networkType', transaction.networkType)

    // - populate common fields
    this.values.set('type', transaction.type)
    this.values.set('deadline', transaction.deadline)
    this.values.set('maxFee', transaction.maxFee.compact())

    return this
  }
}
