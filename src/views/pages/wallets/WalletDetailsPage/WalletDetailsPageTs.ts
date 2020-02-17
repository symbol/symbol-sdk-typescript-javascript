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

// internal dependencies
import {AppWalletType} from '@/core/database/models/AppWallet'
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import WalletNameDisplay from '@/components/WalletNameDisplay/WalletNameDisplay.vue'
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue'
// @ts-ignore
import ImportanceScoreDisplay from '@/components/ImportanceScoreDisplay/ImportanceScoreDisplay.vue'
// @ts-ignore
import WalletContactQR from '@/components/WalletContactQR/WalletContactQR.vue'
// @ts-ignore
import WalletAddressDisplay from '@/components/WalletAddressDisplay/WalletAddressDisplay.vue'
// @ts-ignore
import WalletPublicKeyDisplay from '@/components/WalletPublicKeyDisplay/WalletPublicKeyDisplay.vue'
// @ts-ignore
import WalletActions from '@/components/WalletActions/WalletActions.vue'
// @ts-ignore
import WalletLinks from '@/components/WalletLinks/WalletLinks.vue'
// @ts-ignore
import WalletFlagsDisplay from '@/components/WalletFlagsDisplay/WalletFlagsDisplay.vue'

@Component({
  components: {
    WalletNameDisplay,
    ProtectedPrivateKeyDisplay,
    ImportanceScoreDisplay,
    WalletContactQR,
    WalletActions,
    WalletLinks,
    WalletAddressDisplay,
    WalletPublicKeyDisplay,
    WalletFlagsDisplay,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
  })},
})
export class WalletDetailsPageTs extends Vue {
  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Name form visibility
   * @type {boolean}
   */
  hasNameForm: boolean = false
/// region computed properties getter/setter
/// end-region computed properties getter/setter

  /**
   * Whether the wallet item is a seed wallet
   * @param item
   * @return {boolean}
   */
  public isSeedWallet(wallet: WalletsModel): boolean {
    return wallet.values.get('seed') && wallet.values.get('seed').length
  }
}


/**
 * import {copyTxt} from '@/core/utils'
import {ContactQR} from 'nem2-qr-library'
import {AliasType, MultisigAccountInfo, PublicAccount} from 'nem2-sdk'
import {Component, Vue} from 'vue-property-decorator'
import KeystoreDialog from '@/views/wallet/wallet-details/keystore-dialog/KeystoreDialog.vue'
import PrivatekeyDialog from '@/views/wallet/wallet-details/privatekey-dialog/PrivatekeyDialog.vue'
import WalletHarvesting from '@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvesting.vue'
import {mapState} from 'vuex'
import {AppWallet, AppInfo, StoreAccount, AppNamespace} from '@/core/model'
import failureIcon from '@/common/img/monitor/failure.png'
import Alias from '@/components/forms/alias/Alias.vue'
import {of} from 'rxjs'
import {pluck, concatMap} from 'rxjs/operators'
import TheWalletUpdate from '@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdate.vue'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'

@Component({
  components: {
    Alias,
    PrivatekeyDialog,
    KeystoreDialog,
    WalletHarvesting,
    TheWalletUpdate,
    TheWalletDelete,
  },
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('qrCodeArgs', {immediate: true})
      .pipe(pluck('newValue'),
        concatMap((args) => {
          if (args instanceof ContactQR) return args.toBase64()
          return of(failureIcon)
        }))
    return {qrCode$}
  },
})
export class WalletDetailsPageTs extends Vue {
  activeAccount: StoreAccount
  app: AppInfo
  aliasList = []
  showMnemonicDialog = false
  showKeystoreDialog = false
  showPrivatekeyDialog = false
  functionShowList = [ false, true ]
  showBindDialog = false
  bind = true
  fromNamespace = false
  activeNamespace: AppNamespace = null
  showUpdateDialog = false
  showDeleteDialog = false

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  get isMultisig(): boolean {
    const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[this.wallet.address]
    if (!multisigAccountInfo) return false
    return multisigAccountInfo.cosignatories.length > 0
  }
  get isCosignatory(){
    const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[this.wallet.address]
    if (!multisigAccountInfo) return false
    return multisigAccountInfo.multisigAccounts.length > 0
  }

  // @TODO: false should not be an option, if false occurs, then it is a reactivity bug
  get getAddress(): string | false {
    return this.activeAccount.wallet ? this.activeAccount.wallet.address : false
  }

  get NamespaceList() {
    return this.activeAccount.namespaces
  }

  get importance(): string {
    return this.activeAccount.wallet.importance ? `${this.activeAccount.wallet.importance}0` : '0'
  }

  get selfAliases(): AppNamespace[] {
    return this.NamespaceList
      .filter(({alias}) =>
        alias
                && alias.type === AliasType.Address
                && alias.address.plain() === this.getAddress,
      )
  }

  get qrCodeArgs(): ContactQR {
    try {
      const publicAccount: any = PublicAccount
        .createFromPublicKey(this.wallet.publicKey, this.wallet.networkType)

      return new ContactQR(
        this.wallet.name,
        publicAccount,
        this.wallet.networkType,
        this.app.networkProperties.generationHash,
      )
    } catch (error) {
      return null
    }
  }

  showFunctionIndex(index) {
    this.functionShowList = [ false, false, false ]
    this.functionShowList[index] = true
  }

  closeMnemonicDialog() {
    this.showMnemonicDialog = false
  }

  changePrivatekeyDialog() {
    this.showPrivatekeyDialog = true
  }

  closePrivatekeyDialog() {
    this.showPrivatekeyDialog = false
  }

  changeKeystoreDialog() {
    this.showKeystoreDialog = true
  }

  bindNamespace() {
    this.bind = true
    this.fromNamespace = false
    this.activeNamespace = null
    this.showBindDialog = true
  }

  unbindNamespace(namespace: AppNamespace) {
    this.bind = false
    this.fromNamespace = true
    this.activeNamespace = namespace
    this.showBindDialog = true
  }

  copy(txt) {
    copyTxt(txt).then(() => {
      this.$Notice.success({
        title: `${this['$t']('successful_copy')}`,
      })
    })
  }
}

 */
