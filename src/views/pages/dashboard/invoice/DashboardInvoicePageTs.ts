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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {pluck, concatMap} from 'rxjs/operators'
import {of, Observable} from 'rxjs'
import {QRCodeGenerator, TransactionQR} from 'symbol-qr-library'
import {NetworkType, TransferTransaction, Address} from 'symbol-sdk'
import {MosaicAttachment} from '@/views/forms/FormTransferTransaction/FormTransferTransactionTs.ts'

// child components
// @ts-ignore
import FormTransferTransaction from '@/views/forms/FormTransferTransaction/FormTransferTransaction.vue'

// resources
// @ts-ignore
import failureIcon from '@/views/resources/img/monitor/failure.png'

export interface ITransactionEntry {
  transaction: TransferTransaction
  attachments: MosaicAttachment[]
}

@Component({
  components: {
    FormTransferTransaction,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    generationHash: 'network/generationHash',
    currentWalletAddress: 'wallet/currentWalletAddress',
  })},
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('transactionQR', {immediate: true})
      .pipe(
        pluck('newValue'),
        concatMap((args) => {
          if (args instanceof TransactionQR) return args.toBase64()
          return of(failureIcon)
        }))
    return {qrCode$}
  },
})
export class DashboardInvoicePageTs extends Vue {
  /**
   * Network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Transaction QR code
   * @type {Observable<string>}
   */
  public qrCode$: Observable<string>

  /**
   * Network's generation hash
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

  /**
   * The transaction to be translated to a QR code
   * @type {ITransactionEntry[]}
   */
  public transactions: ITransactionEntry[] = []

/// region computed properties getter/setter
  /**
   * Recipient to be shown in the view
   * @readonly
   * @type {string}
   */
  public get recipient(): string {

    // if (!this.transactions.length) return ''
    
    if (!this.currentTransaction) return ''

    // - read TransferTransaction instance
    // const transfer = this.transactions.shift() as TransferTransaction
    const transfer = this.currentTransaction
    const recipient = transfer.recipientAddress
    return recipient instanceof Address ? recipient.pretty() : recipient.toHex()
  }

  /**
   * Transaction QR code arguments
   * @readonly
   * @type {TransactionQR}
   */
  public get transactionQR(): TransactionQR {
    // if (!this.transactions.length) return null
    if (!this.currentTransaction) return null

    // this.currentTransaction = this.transactions.shift() as TransferTransaction
    // - read TransferTransaction instance
    const transfer = this.currentTransaction

    try {
      return QRCodeGenerator.createTransactionRequest(
        // @ts-ignore // @TODO SDK upgrade
        transfer,
        this.networkType,
        this.generationHash,
      )
    }
    catch (e) {
      return null
    }
  }

  /**
   * The transaction object
   * @type {TransferTransaction | undefined}
   */
  get currentTransaction(): TransferTransaction | undefined {
    if (this.transactionEntry) {
      return this.transactionEntry.transaction as TransferTransaction
    }
  }

  /**
   * The first transaction in the list stack
   * @type {ITransactionEntry}
   */
  get transactionEntry(): ITransactionEntry {
    if (this.transactions.length) {
      return this.transactions[0]
    }
  }

  /**
   * The transaction's mosaics to be displayed
   * @type {MosaicAttachment[]}
   */
  get balanceEntries(): MosaicAttachment[] {
    if (!this.transactionEntry) return []
    return this.transactionEntry.attachments
  }

/// end-region computed properties getter/setter

  /**
   * Hook called when the child component FormTransferTransaction
   * emits the 'onTransactionsChange' event with its new transactions.
   * @param {ITransactionEntry} transactions
   */
  public onInvoiceChange(transactions: ITransactionEntry[]) {
    
    Vue.set(this, 'transactions', transactions)
  }

  /**
   * Hook called when the download QR button is pressed
   * @return {void}
   */
  public onDownloadQR() {
    if (!this.transactionQR) return

    // - read QR code base64
    const QRCode: any = document.querySelector('#qrImg')
    if (!QRCode) return
    const url = QRCode.src

    // - create link (<a>)
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = `qr_receive_${this.recipient}`
    a.href = url

    // - start download
    a.dispatchEvent(event)
  }
}
