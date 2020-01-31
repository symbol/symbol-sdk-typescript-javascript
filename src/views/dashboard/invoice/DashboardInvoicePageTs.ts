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
import {Component, Vue, Provide} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {pluck, concatMap} from 'rxjs/operators'
import {of} from 'rxjs'
import {QRCodeGenerator, TransactionQR} from 'nem2-qr-library'
import {MosaicId, Mosaic, UInt64, RawUInt64, NetworkType, PlainMessage, EmptyMessage} from 'nem2-sdk'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'
import {TransactionFactory} from '@/core/transactions/TransactionFactory'
import {TransferTransactionParams} from '@/core/transactions/TransferTransactionParams'

// child components
// @ts-ignore
import FormInvoiceCreation from '@/views/forms/FormInvoiceCreation/FormInvoiceCreation.vue'

// resources
// @ts-ignore
import failureIcon from '@/views/resources/img/monitor/failure.png'

@Component({
  components: {
    FormInvoiceCreation
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    generationHash: 'network/generationHash',
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicName: 'mosaic/networkMosaicName',
    mosaicsNames: 'mosaic/mosaicsNames',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
  })},
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('transactionQR', {immediate: true})
      .pipe(pluck('newValue'),
        concatMap((args) => {
          if (args instanceof TransactionQR) return args.toBase64()
          return of(failureIcon)
        }))
    return {qrCode$}
  },
})
export class DashboardInvoicePageTs extends Vue {
  @Provide() validator: any = this.$validator

  /**
   * Network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Network's generation hash
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

  /**
   * Network's currency mosaic
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Network's currency mosaic name
   * @see {Store.Mosaic}
   * @var {string}
   */
  public networkMosaicName: string

  /**
   * Network's mosaics names
   * @see {Store.Mosaic}
   * @var {any}
   */
  public mosaicsNames: {}

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form items
   * @var {any}
   */
  public formItems: any = {}

/// region computed properties getter/setter
  public get transactionQR(): TransactionQR {
    if (!this.formItems.recipient) {
      return ;
    }

    // - read form
    const data = {
      recipient: this.formItems.recipient || '',
      mosaics: this.formItems.attachedMosaics || [],
      message: this.formItems.messagePlain || ''
    }

    // - prepare transaction parameters
    const params = TransferTransactionParams.create(data)

    // - prepare transfer transaction
    const factory = new TransactionFactory(this.$store)
    const transfer = factory.build('TransferTransaction', params)
    try {
      return QRCodeGenerator.createTransactionRequest(
        transfer,
        this.networkType,
        this.generationHash,
      )
    }
    catch (e) {
      return null
    }
  }
/// end-region computed properties getter/setter

  /**
   * Hook called when the child component FormInvoiceCreation
   * emits the 'change' event with its new values.
   * @param {any} formItems
   */
  public onFormChange(formItems: any) {
    this.formItems = formItems
  }

  /**
   * Hook called when the download QR button is pressed
   * @return {void}
   */
  public onDownloadQR() {
    if (!this.formItems.recipient) {
      return ;
    }

    // - read QR code base64
    const QRCode: any = document.querySelector('#qrImg')
    const url = QRCode.src

    // - create link (<a>)
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = 'qr_receive_' + this.formItems.recipient
    a.href = url

    // - start download
    a.dispatchEvent(event)
  }
}
