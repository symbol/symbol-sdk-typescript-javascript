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
import {mapGetters} from 'vuex'
import {Mosaic, MosaicId, NetworkType} from 'nem2-sdk'
import {ValidationProvider} from 'vee-validate'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AppWalletType} from '@/core/database/models/AppWallet'
import {WalletService} from '@/services/WalletService'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'
// @ts-ignore
import ModalMnemonicBackupWizard from '@/views/modals/ModalMnemonicBackupWizard/ModalMnemonicBackupWizard.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'
// @ts-ignore
import ModalFormSubWalletCreation from '@/views/modals/ModalFormSubWalletCreation/ModalFormSubWalletCreation.vue'

@Component({
  components: {
    AmountDisplay,
    ModalMnemonicBackupWizard,
    ModalFormSubWalletCreation,
    ErrorTooltip,
    FormLabel,
    ValidationProvider,
  }, 
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    networkMosaic: 'mosaic/networkMosaic',
  })}})
export class WalletSelectorPanelTs extends Vue {
  /**
   * Currently active networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

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
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: string[]

  /**
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public currentWalletMosaics: Mosaic[]

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public service: WalletService

  /**
   * Temporary storage of clicked wallets
   * @var {WalletsModel}
   */
  public clickedWallet: WalletsModel

  /**
   * Whether user is currently adding a wallet (modal)
   * @var {boolean}
   */
  public isAddingWallet: boolean = false

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset


  /**
   * Hook called when the component is created
   * @return {void}
   */
  public created() {
    this.service = new WalletService(this.$store)
  }

/// region computed properties getter/setter
  public get currentWalletIdentifier(): string {
    return !this.currentWallet ? '' : {...this.currentWallet}.identifier
  }

  public set currentWalletIdentifier(identifier: string) {
    if (!identifier || !identifier.length) {
      return ;
    }

    const wallet = this.service.getWallet(identifier)
    if (!wallet) {
      return ;
    }

    this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet)
    this.$emit('change', wallet.getIdentifier())
  }

  public get currentWallets(): {
    identifier: string,
    name: string,
    type: number,
    isMultisig: boolean,
    path: string
  }[] {
    if (!this.knownWallets || !this.knownWallets.length) {
      return []
    }

    // filter wallets to only known wallet names
    const knownWallets = this.service.getWallets(
      (e) => this.knownWallets.includes(e.getIdentifier())
    )
  
    return [...knownWallets].map(
      ({identifier, values}) => ({
        identifier,
        name: values.get('name'),
        type: values.get('type'),
        isMultisig: values.get('isMultisig'),
        path: values.get('path'),
      }),
    )
  }

  public get networkMosaicBalance() {
    if (! this.currentWallet || ! this.currentWalletMosaics.length) {
      return 0
    }

    // search for network mosaic
    const entry = this.currentWalletMosaics.filter(
      mosaic => mosaic.id.equals(this.networkMosaic)
    )

    return entry.length === 1 ? entry.shift().amount.compact() : 0
  }

  public get hasAddWalletModal(): boolean {
    return this.isAddingWallet
  }

  public set hasAddWalletModal(f: boolean) {
    this.isAddingWallet = f
  }
/// end-region computed properties getter/setter

  /**
   * Whether the wallet item is the current wallet
   * @param item
   * @return {boolean}
   */
  public isActiveWallet(item): boolean {
    return item.identifier === this.currentWallet.getIdentifier()
  }

  /**
   * Whether the wallet item is a seed wallet
   * @param item
   * @return {boolean}
   */
  public isSeedWallet(item): boolean {
    return item.type === AppWalletType.SEED
  }
}


/*

  get pathToCreate() {
    const seedPathList = this.walletList.filter(item => item.path).map(item => item.path[item.path.length - 8]).sort()
    const numberOfSeedPath = seedPathList.length
    if (numberOfSeedPath >= APP_PARAMS.MAX_SEED_WALLETS_NUMBER) {
      Notice.trigger(Message.SEED_WALLET_OVERFLOW_ERROR, NoticeType.error, this.$store)
      this.show = false
      return
    }

    if (!numberOfSeedPath) return 0

    const jumpedPath = seedPathList
      .map(a => Number(a))
      .sort()
      .map((element, index) => {
        if (element !== index) return index
      })
      .filter(x => x !== undefined)
    return jumpedPath.length ? jumpedPath[0] : numberOfSeedPath
  }


  passwordValidated(password) {
    if (!password) return
    const {pathToCreate, walletName, currentAccount} = this
    const networkType = currentAccount.networkType
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        try {
          new AppWallet().createFromPath(
            walletName,
            new Password(password),
            pathToCreate,
            networkType,
            this.$store,
          )
          this.show = false
        } catch (error) {
          throw new Error(error)
        }
      })
  }

  mounted() {
    this.walletName = seedWalletTitle + this.pathToCreate
  }

*/
