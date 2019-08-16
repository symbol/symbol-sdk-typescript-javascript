import {NetworkType} from 'nem2-sdk'
import {saveLocalWallet} from '@/core/utils/wallet'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {localRead, localSave, formatXEMamount} from '@/core/utils/utils'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'

@Component({
    components: {
        DeleteWalletCheck
    }
})
export class WalletSwitchTs extends Vue {
    walletList = []
    currentNetType = {}
    showCheckPWDialog = false
    deleteIndex = -1
    deletecurrent = -1
    netType = [
        {
            value: NetworkType.MIJIN_TEST,
            label: 'MIJIN_TEST'
        }, {
            value: NetworkType.MAIN_NET,
            label: 'MAIN_NET'
        }, {
            value: NetworkType.TEST_NET,
            label: 'TEST_NET'
        }, {
            value: NetworkType.MIJIN,
            label: 'MIJIN'
        },
    ]


    get getWalletList() {
        return this.$store.state.app.walletList
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    toShowCheckPWDialog(index, current) {
        this.showCheckPWDialog = true
        this.deleteIndex = index
        this.deletecurrent = current
    }

    checkEnd() {
        const {deleteIndex, deletecurrent} = this
        this.delWallet(deleteIndex, deletecurrent)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    chooseWallet(walletIndex) {
        let localData = JSON.parse(localRead('wallets'))
        let list = this.getWalletList
        const storeWallet = this.walletList[walletIndex]
        const localWallet = localData[walletIndex]
        list.splice(walletIndex, 1)
        localData.splice(walletIndex, 1)
        list.unshift(storeWallet)
        localData.unshift(localWallet)
        list.map((item, index) => {
            if (index === 0) {
                item.active = true
            } else {
                item.active = false
            }
        })
        const account = saveLocalWallet(storeWallet, null, walletIndex)
        this.$store.commit('SET_WALLET', account)
        this.walletList = list
        this.$store.commit('SET_WALLET_LIST', list)
        localSave('wallets', JSON.stringify(localData))
    }


    delWallet(index, current) {
        let list = this.walletList;
        let localData = JSON.parse(localRead('wallets'))
        list.splice(index, 1)
        localData.splice(index, 1)
        if (list.length < 1) {
            this.$store.state.app.isInLoginPage = true
            this.$emit('noHasWallet')
        }
        this.$store.commit('SET_WALLET_LIST', list)
        this.$store.commit('SET_WALLET', this.walletList[0])
        localSave('wallets', JSON.stringify(localData))
        this.$Notice.success({
            title: this['$t']('Delete_wallet_successfully') + '',
        });
        document.body.click()
        this.initWalletList()

    }

    formatXEMamount(text) {
        return formatXEMamount(text)
    }

    initWalletList() {
        const list = this.getWalletList
        list.map((item, index) => {
            if (index === 0) {
                item.active = true
            } else {
                item.active = false
            }
        })
        for (let i in list) {
            this.$set(this.walletList, i, list[i])
        }
        if (this.walletList.length > 0) {
            this.$emit('hasWallet')
            this.$store.commit('SET_HAS_WALLET', true)
        } else {
            this.$store.commit('SET_HAS_WALLET', false)
        }
    }

    initData() {
        this.currentNetType = this.netType[0].value
    }

    toImport() {
        this.$emit('toImport')
    }

    toCreate() {
        this.$emit('toCreate')
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.initWalletList()
    }

    created() {
        this.initData()
        this.$store.commit('SET_WALLET', this.getWalletList[0])
        this.initWalletList()
    }
}
