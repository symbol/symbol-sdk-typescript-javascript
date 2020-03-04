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
import {SignedTransaction, CosignatureSignedTransaction} from 'symbol-sdk'

export class BroadcastResult {
  /**
   * Create a transaction broadcast result instance
   *
   * @param {SignedTransaction} transaction
   * @param {boolean} success
   * @param {string} error
   */
  constructor(
    /**
     * The transaction that was announced
     * @var {SignedTransaction}
     */
    public readonly transaction: SignedTransaction | CosignatureSignedTransaction,
    /**
     * Whether broadcasting was successfull
     * @var {boolean}
     **/
    public readonly success: boolean,
    /**
     * Error message (optional)
     * @var {string}
     **/
    public readonly error?: string) {
  }
}
