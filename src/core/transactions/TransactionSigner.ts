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
import {
  Account,
  Transaction,
  SignedTransaction,
  AggregateTransaction,
  TransactionType,
  CosignatureSignedTransaction,
  CosignatureTransaction,
} from 'nem2-sdk';

export class TransactionSigner {
  /**
   * Create a transaction signer instance
   *
   * @param {Account}     account 
   * @param {Transaction} transaction 
   * @param {string}      generationHash 
   */
  constructor(
    /**
     * The account used for signing (transaction issuer)
     * @var {Account}
     */
    protected readonly account: Account,
    /**
     * The transaction to sign
     * @var {Transaction}
     **/
    protected readonly transaction: Transaction,
    /**
     * The network generation hash
     * @var {string}
     **/
    protected readonly generationHash: string) {
  }

  /**
   * Sign a transaction
   *
   * @return {SignedTransaction}
   */
  public sign(): SignedTransaction {
    return this.account.sign(this.transaction, this.generationHash)
  }

  /**
   * Sign an aggregate transaction with cosignatory \a account
   *
   * @param {Account} account
   * @return {SignedTransaction}
   */
  public cosign(
    account: Account
  ): CosignatureSignedTransaction
  {
    const aggregateTypes = [
      TransactionType.AGGREGATE_COMPLETE,
      TransactionType.AGGREGATE_BONDED
    ]

    // only aggregate transactions can be co-signed
    if (! aggregateTypes.includes(this.transaction.type)) {
      throw new Error('Expected aggregate transaction to co-sign, got transaction type ' + this.transaction.type + '.')
    }

    const cosignatureTransaction = CosignatureTransaction.create(this.transaction as AggregateTransaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
  }
}