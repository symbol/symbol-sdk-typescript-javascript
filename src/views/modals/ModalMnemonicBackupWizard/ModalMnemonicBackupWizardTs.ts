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
import {Component, Vue} from 'vue-property-decorator'

@Component({
  components: {},
})
export class ModalMnemonicBackupWizardTs extends Vue {
}


/*

import {MnemonicQR} from 'symbol-qr-library'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {of} from 'rxjs'
import {pluck, concatMap} from 'rxjs/operators'
import {AppAccounts, StoreAccount, AppInfo} from '@/core/model'
import {copyTxt} from '@/core/utils'
import {Message, fourStepsPictureList} from '@/config'
import failureIcon from '@/common/img/monitor/failure.png'
import {validation} from '@/core/validation'
import MnemonicVerification from '@/components/mnemonic-verification/MnemonicVerification.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
  components: {
    MnemonicVerification,
    ErrorTooltip,
  },
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('qrCodeArgs', {immediate: true})
      .pipe(pluck('newValue'),
        concatMap((args) => {
          if (args instanceof MnemonicQR) return args.toBase64()
          return of(failureIcon)
        }))
    return {qrCode$}
  },
})
export class ModalMnemonicBackupWizardTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  app: AppInfo
  MnemonicQR = MnemonicQR
  validation = validation
  copyTxt = copyTxt
  stepIndex = 0
  mnemonic = ''
  password = ''
  QRCode = ''
  fourStepsPictureList = fourStepsPictureList
  stringOfSteps = [ 'input_password', 'backup_prompt', 'backup_mnemonic', 'confirm_backup' ]
  @Prop()
  showMnemonicDialog: boolean

  get show() {
    return this.showMnemonicDialog
  }

  set show(val) {
    if (!val) {
      this.$emit('closeMnemonicDialog')
    }
  }

  get cipher() {
    return this.activeAccount.currentAccount.password
  }

  get qrCodeArgs(): MnemonicQR {
    const {mnemonic, password} = this
    const {wallet} = this.activeAccount
    const {generationHash} = this.app.networkProperties
    const {networkType} = wallet
    if (password.length < 8) return null
    try {
      return new this.MnemonicQR(
        new MnemonicPassPhrase(mnemonic),
        password,
        networkType,
        generationHash,
      )
    } catch (error) {
      console.error('MnemonicDialogTs -> qrCodeArgs -> error', error)
      return null
    }
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.mnemonic = AppAccounts().decryptString(
          this.activeAccount.wallet.encryptedMnemonic,
          this.password,
        )
        this.stepIndex = 1
      })
  }

  async copyMnemonic() {
    await this.copyTxt(this.mnemonic)
    this.$Notice.success({
      title: `${this.$t(Message.COPY_SUCCESS)}`,
    })
  }
}
*/
