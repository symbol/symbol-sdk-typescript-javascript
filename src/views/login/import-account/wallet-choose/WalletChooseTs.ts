import {Vue, Component} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppInfo, AppWallet, StoreAccount, HdWallet} from '@/core/model'
import {getRelativeMosaicAmount, localSave, miniAddress} from '@/core/utils'
import {NetworkType, Password, AccountHttp, Address} from 'nem2-sdk'
import {Message, APP_PARAMS} from '@/config'
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
  components: {NumberFormatting},
})
export default class WalletChooseTs extends Vue {
  app: AppInfo
  activeAccount: StoreAccount
  selectedAccountMap = {}
  addressMosaicMap = {}
  miniAddress = miniAddress
  addressList: Address[] = []

  get accountName() {
    return this.activeAccount.currentAccount.name
  }

  get seed(): string {
    return this.activeAccount.temporaryLoginInfo.mnemonic
  }

  get password() {
    return this.activeAccount.temporaryLoginInfo.password
  }

  get node() {
    return this.activeAccount.node
  }


  get networkType() {
    return this.activeAccount.currentAccount.networkType
  }

  get networkName() {
    return NetworkType[this.networkType]
  }

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  mounted() {
    Vue.nextTick().then(() => {
      setTimeout(() => {
        this.setAddressListAndBalances()
      }, 200)
    })
  }

  setAddressListAndBalances() {
    this.addressList = HdWallet.getAddressesFromMnemonic(
      this.seed,
      APP_PARAMS.MAX_SEED_WALLETS_NUMBER,
      this.networkType,
    )
    this.setAddressesBalances()
  }

  async setAddressesBalances() {
    try {
      const {node, networkCurrency, addressList} = this

      const accountsInfo = await new AccountHttp(node)
        .getAccountsInfo(addressList).toPromise()
            
            
      this.addressMosaicMap = accountsInfo
        .map(({mosaics, address}) => {
          const defaultMosaic = mosaics.find(
            mosaic => mosaic.id.toHex() === networkCurrency.hex,
          )
          return defaultMosaic !== undefined
            ? {
              address: address.plain(),
              balance: getRelativeMosaicAmount(
                defaultMosaic.amount.compact(),
                networkCurrency.divisibility,
              ),
            }
            : null
        })
        .filter(x => x)
        .reduce((acc, {address, balance}) => ({...acc, [address]: balance}), {})
    } catch (error) {
      // do nothing
    }
  }

  addAccount(index, account) {
    Vue.set(this.selectedAccountMap, index, account)
  }

  removeAccount(index) {
    const newSelectedAccountMap = {...this.selectedAccountMap} 
    delete newSelectedAccountMap[index]
    this.selectedAccountMap = newSelectedAccountMap
  }

  submit() {
    const {password, accountName, networkType, addressMosaicMap, selectedAccountMap} = this
    const walletList = Object.keys(selectedAccountMap).map(path => {
      return {
        path: path,
        balance: addressMosaicMap[selectedAccountMap[path].address],
      }
    })
    if (!walletList.length) {
      this.$Notice.error({title: `${this.$t(Message.INPUT_EMPTY_ERROR)}`})
      return
    }
    walletList.forEach((item) => {
      new AppWallet().createFromPath(
        `${APP_PARAMS.SEED_WALLET_NAME_PREFIX}${item.path}`,
        new Password(password),
        Number(item.path), networkType,
        this.$store,
      )
    })
    localSave('activeAccountName', accountName)
    this.$store.commit('REMOVE_TEMPORARY_LOGIN_INFO')
    this.$router.push('finishImport')
  }
}
