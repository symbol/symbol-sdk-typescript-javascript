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
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { Transaction, SignedTransaction, CosignatureTransaction, CosignatureSignedTransaction } from 'symbol-sdk'

// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel'
import TrezorConnect from '@/core/utils/TrezorConnect'
import { TransactionSigner } from '@/services/TransactionAnnouncerService'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
    }),
  },
})
export class HardwareConfirmationButtonTs extends Vue implements TransactionSigner {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountModel}
   */
  public currentAccount: AccountModel

  /**
   * Process with hardware confirmation (currently trezor only)
   * @return {void}
   */
  public async processHardware() {
    return this.$emit('success', this)
  }

  signCosignatureTransaction(t: CosignatureTransaction): Observable<CosignatureSignedTransaction> {
    throw new Error('Not Implemented!!!')
  }

  signTransaction(stagedTx: Transaction): Observable<SignedTransaction> {
    // - sign each transaction with TrezorConnect
    const promise: Promise<any> = TrezorConnect.nemSignTransaction({
      path: this.currentAccount.path,
      transaction: stagedTx,
    })
    return from(promise).pipe(
      map((result) => {
        if (!result.success) {
          throw new Error(result.payload.error)
        }
        return new SignedTransaction(
          result.payload.data,
          stagedTx.transactionInfo.hash,
          stagedTx.signer.publicKey,
          stagedTx.type,
          stagedTx.networkType,
        )
      }),
    )
  }
}
