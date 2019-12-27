import {Vue, Component} from 'vue-property-decorator'
import {mapState} from "vuex"
import {AppInfo, AppWallet, StoreAccount} from "@/core/model"
import {getRelativeMosaicAmount, localSave, getTenAddressesFromMnemonic} from "@/core/utils"
import {NetworkType, Password, AccountHttp} from "nem2-sdk"
import {Message} from "@/config"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export default class WalletChooseTs extends Vue {
    activeAccount: StoreAccount
    selectedAccountMap = {}
    addressMosaicMap = {}
    app: AppInfo

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

    get addressList() {
        const {node, networkCurrency} = this
        const that = this
        const addressList = getTenAddressesFromMnemonic(this.seed, this.networkType)

        new AccountHttp(node).getAccountsInfo(addressList).subscribe(res => {
            res.forEach(item => {
                const defaultMosaic = item.mosaics.find(mosaic => mosaic.id.toHex() == networkCurrency.hex)
                if (defaultMosaic) {
                    that.addressMosaicMap[item.address.plain()] = getRelativeMosaicAmount(defaultMosaic.amount.compact(), networkCurrency.divisibility)
                    that.$forceUpdate()
                }
            })
        })
        return addressList
    }

    addAccount(index, account) {
        this.selectedAccountMap[index] = account
        this.$forceUpdate()
    }

    removeAccount(index) {
        delete this.selectedAccountMap[index]
        this.$forceUpdate()

    }

    miniHash(hash: string): string {
        return `${hash.substring(0, 15).toUpperCase()}***${hash.substring(25).toUpperCase()}`
    }
    submit() {
        const {password, accountName, networkType, addressMosaicMap, selectedAccountMap} = this
        const walletList = Object.keys(selectedAccountMap).map(path => {
            return {
                path: path,
                balance: addressMosaicMap[selectedAccountMap[path].address]
            }
        })
        if (!walletList.length) {
            this.$Notice.error({title: this.$t(Message.INPUT_EMPTY_ERROR) + ''})
            return
        }
        walletList.forEach((item) => {
            new AppWallet().createFromPath('Seed-' + item.path, new Password(password), Number(item.path), networkType, this.$store, item.balance)
        })
        localSave('activeAccountName', accountName)
        this.$store.commit('REMOVE_TEMPORARY_LOGIN_INFO')
        this.$router.push("finishImport")
    }
}
