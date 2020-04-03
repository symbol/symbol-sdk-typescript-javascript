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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Account, Password, NetworkType} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
import {QRCodeGenerator, MnemonicQR} from 'symbol-qr-library'

// internal dependencies
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {AccountsModel} from '@/core/database/entities/AccountsModel'

// child components
// @ts-ignore
import FormAccountUnlock from '@/views/forms/FormAccountUnlock/FormAccountUnlock.vue'

// resources
// @ts-ignore
import failureIcon from '@/views/resources/img/monitor/failure.png'

@Component({
  components: {FormAccountUnlock},
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    networkType: 'network/networkType',
    generationHash: 'network/generationHash',
  })},
})
export class ModalMnemonicExportTs extends Vue {
  @Prop({
    default: false,
  }) visible: boolean

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Current networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Current generationHash
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string
  
  public qrBase64: string = failureIcon
  public hasMnemonicInfo: boolean = false
  public exportMnemonicQR: MnemonicQR

  public created() {
    this.$eventToObservable('onAccountUnlocked').subscribe(
      async () => {
        this.qrBase64 = await this.exportMnemonicQR.toBase64().toPromise()
      },
    )
  }

  /**
   * Visibility state
   * @type {boolean}
   */
  get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  /**
   * Hook called when the account has been unlocked
   * @param {Account} account 
   * @return {boolean}
   */
  public onAccountUnlocked(payload: {account: Account, password: Password}): boolean {

    // decrypt seed + create QR
    const encSeed = this.currentAccount.values.get('seed')
    const plnSeed = AESEncryptionService.decrypt(encSeed, payload.password)

    try {
      this.exportMnemonicQR = QRCodeGenerator.createExportMnemonic(
        new MnemonicPassPhrase(plnSeed),
        payload.password.value,
        this.networkType,
        this.generationHash,
      )

      this.$emit('onAccountUnlocked', this.exportMnemonicQR)

      // display mnemonic
      this.hasMnemonicInfo = true
      return true
    }
    catch (e) {
      console.error('error mnemonic: ', e)
    }

    return false
  }

  /**
   * Hook called when child component FormAccountUnlock or
   * HardwareConfirmationButton emit the 'error' event.
   * @param {string} message
   * @return {void}
   */
  public onError(error: string) {
    this.$emit('error', error)
  }

  /**
   * Hook called when the download QR button is pressed
   * @return {void}
   */
  public onDownloadQR() {
    if (!this.exportMnemonicQR) return

    // - read QR code base64
    const QRCode: any = document.querySelector('#qrImg')
    if (!QRCode) return
    const url = QRCode.src

    // - create link (<a>)
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    const accountName = this.currentAccount.values.get('accountName')
    a.download = `qr_account_mnemonic_${accountName}`
    a.href = url

    // - start download
    a.dispatchEvent(event)
  }
}
