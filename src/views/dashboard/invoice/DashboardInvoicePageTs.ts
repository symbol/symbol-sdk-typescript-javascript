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
import {QRCodeGenerator, TransactionQR} from 'nem2-qr-library'
import {MosaicId, TransferTransaction, Deadline, Address, Mosaic, UInt64, PlainMessage, NamespaceId} from 'nem2-sdk'
import {pluck, concatMap} from 'rxjs/operators'
import {of} from 'rxjs'

// internal dependencies
import {AccountsModel} from '@/core/database/models/AppAccount'
import {WalletsModel} from '@/core/database/models/AppWallet'
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'

// resources
// @ts-ignore
import failureIcon from '@/../public/img/monitor/failure.png'

@Component({
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
  })},
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('qrCodeArgs', {immediate: true})
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
}
/*

  activeAccount: StoreAccount
  app: AppInfo
  validation = validation
  TransferType = TransferType
  transferTypeList = monitorReceiptTransferTypeConfig
  selectedMosaicHex = ''
  formItems = {
    mosaicAmount: 0,
    message: '',
  }

  QRCode: string = failureIcon

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  get activeMosaic(): {
    name: string
    hex: string
    id: MosaicId | NamespaceId
  } {
    const {selectedMosaicHex} = this

    if (!selectedMosaicHex) {return {
      name: null, hex: selectedMosaicHex, id: null,
    }}

    try {
      const selectedFromList = Object.values(this.mosaics)
        .find(({name, hex}) => name === selectedMosaicHex || hex === selectedMosaicHex)

      if (selectedFromList !== undefined) {
        const {name, hex} = selectedFromList
        const id = name ? new NamespaceId(name) : new MosaicId(hex)
        return {name, hex, id}
      }

      const name = null
      const hex = selectedMosaicHex
      const id = validateMosaicId(hex).valid
        ? new MosaicId(hex) : new NamespaceId(hex.toLowerCase())

      return {name, hex, id}
    } catch (error) {
      console.error('DashboardInvoicePageTs -> error', error)
      return {
        name: null, hex: selectedMosaicHex, id: null,
      }
    }
  }

  get transferTransaction(): TransferTransaction {
    if (this.$validator.errors.any()) {
      return null
    }

    try {
      const {activeMosaic} = this
      const {networkType, address} = this.wallet

      if (!activeMosaic.id) return null
      const walletAddress = Address.createFromRawAddress(address)
      const {mosaicAmount, message} = this.formItems

      return TransferTransaction.create(
        Deadline.create(),
        walletAddress,
        [new Mosaic(activeMosaic.id, UInt64.fromUint(mosaicAmount))],
        PlainMessage.create(message),
        networkType,
      )
    } catch (error) {
      console.error('DashboardInvoicePageTs -> error', error)
      return null
    }
  }

  get qrCodeArgs(): TransactionQR {
    const {transferTransaction} = this
    if (!transferTransaction || !(transferTransaction instanceof TransferTransaction)) return null
    try {
      return QRCodeGenerator.createTransactionRequest(
        transferTransaction,
        this.wallet.networkType,
        this.app.networkProperties.generationHash,
      )
    } catch (e) {
      return null
    }
  }

  get accountAddress() {
    return this.activeAccount.wallet.address
  }

  get wallet() {
    return this.activeAccount.wallet
  }

  get mosaics() {
    return this.activeAccount.mosaics
  }

  get mosaicList() {
    // @TODO: should be an AppMosaic method
    // @TODO: would be better to return a loading indicator
    // instead of an empty array ([] = "no matching data" in the select dropdown)
    const {mosaics} = this
    const currentHeight = this.app.networkProperties.height
    if (this.app.mosaicsLoading || !mosaics) return []

    const mosaicList: any = Object.values(mosaics)

    return [...mosaicList]
      .filter(({expirationHeight}) => {
        return expirationHeight === MosaicNamespaceStatusType.FOREVER
                    || currentHeight < expirationHeight
      })
      .map(({hex, name}) => ({value: name || hex}))
  }

  filterMethod() {
    return 1
  }

  showErrorMessage(message) {
    this.$Notice.destroy()
    this.$Notice.error({
      title: message,
    })
  }

  downloadQR() {
    const {address} = this.wallet
    const QRCode: any = document.querySelector('#qrImg')
    const url = QRCode.src
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = `qr_receive_${address}`
    a.href = url
    a.dispatchEvent(event)
  }

  copyAddress() {
    const {$Notice} = this
    copyTxt(this.accountAddress).then(() => {
      $Notice.success(
        {
          title: `${this.$t(Message.COPY_SUCCESS)}`,
        },
      )
    })
  }

  mounted() {
    this.selectedMosaicHex = this.mosaicList[0] ? this.mosaicList[0].value : ''
  }

}
*/
