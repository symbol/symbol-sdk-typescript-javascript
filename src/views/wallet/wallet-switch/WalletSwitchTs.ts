import {saveLocalWallet} from '@/core/utils/wallet.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {localRead, localSave, formatXEMamount} from '@/core/utils/utils.ts'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'
import {mapState} from 'vuex';

@Component({
    components: { DeleteWalletCheck },
    computed: { ...mapState({
      activeAccount: 'account',
      app: 'app',
    }) }
})
export class WalletSwitchTs extends Vue {
    app: any
    activeAccount: any
    showCheckPWDialog = false
    deleteIndex = -1
    deletecurrent = -1
    
    get walletList() { return this.app.walletList }
    get wallet() { return this.activeAccount.wallet }
    
    toShowCheckPWDialog(index, current) {
        this.showCheckPWDialog = true
        this.deleteIndex = index
        this.deletecurrent = current
    }

    checkEnd() {
        const {deleteIndex} = this
        this.delWallet(deleteIndex)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    chooseWallet(walletIndex) {
        let localData = JSON.parse(localRead('wallets'))
        // @TODO: review
        let list = this.walletList
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
        this.$store.commit('SET_WALLET_LIST', list)
        localSave('wallets', JSON.stringify(localData))
    }


    delWallet(index) {
        let list = this.walletList;
        let localData = JSON.parse(localRead('wallets'))
        list.splice(index, 1)
        localData.splice(index, 1)
        if (list.length < 1) {
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

    // @TODO: Probably not necessary after app.vue review
    getWalletBalance(index) { 
      const { balance } = this.walletList[index]
      if (!balance || balance === 0) return 0
      return this.formatXEMamount(balance)
    }

    initWalletList() {
        const list = this.walletList
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

    toImport() {
        this.$emit('toImport')
    }

    toCreate() {
        this.$emit('toCreate')
    }

    @Watch('wallet.address')
    onGetWalletChange() {
        this.initWalletList()
    }
}
