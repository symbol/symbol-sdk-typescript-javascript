import {Component, Vue, Watch} from 'vue-property-decorator'
import {validation} from '@/core/validation'
import {mapState} from "vuex"
import {localRead, getObjectLength, getTopValueInObject} from "@/core/utils/utils"
import {Message} from "@/config"
import {AppInfo, StoreAccount, AppAccount, CurrentAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            app: 'app',
            activeAccount: 'account'
        })
    }
})
export class InputLockTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    validation = validation
    cipher: string = ''
    cipherHint: string = ''
    errors: any
    activeError: string = ''
    isShowPrompt: boolean = false
    currentText: string = ''
    isShowClearCache: boolean = false
    walletMap: any = {}
    formItems = {
        currentAccountName: '',
        password: ''
    }

    showPrompt() {
        this.isShowPrompt = true
    }

    showIndexView() {
        this.$emit('showIndexView', 1)
    }

    get accountMap() {
        return localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
    }

    get accountList() {
        const walletMap = this.accountMap
        let walletList = []
        for (let key in walletMap) {
            walletList.push({
                value: key,
                label: key
            })
        }
        return walletList
    }


    jumpToDashBoard() {
        const {accountMap} = this
        const {currentAccountName} = this.formItems
        if (getObjectLength(currentAccountName) == 0 || !accountMap[currentAccountName].seed) {
            this.$router.push('initSeed')
            return
        }
        if (!accountMap[currentAccountName].wallets.length) {
            this.$router.push('walletCreate')
            return
        }
        const activeWalletAddress = accountMap[currentAccountName].activeWalletAddress
        this.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets.find(item => item.address == activeWalletAddress) || accountMap[currentAccountName].wallets[0])
        this.$router.push('monitorPanel')
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(text) + ''})
    }

    submit() {
        const {currentAccountName} = this.formItems
        const {accountMap} = this
        const that = this

        if (this.errors.items.length > 0) {
            this.showErrorNotice(this.errors.items[0].msg)
            return
        }
        if (!currentAccountName) {
            this.showErrorNotice(Message.ACCOUNT_NAME_INPUT_ERROR)
            return
        }

        // no seed
        if (!accountMap[currentAccountName].seed) {
            this.$router.push({
                name: 'initSeed',
                params: {
                    initType: '1'
                }
            })
            return
        }

        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                // no wallet
                if (!accountMap[currentAccountName].wallets.length) {
                    that.$router.push('walletCreate')
                    return
                }
                that.jumpToDashBoard()
            })
    }


    @Watch('formItems.currentAccountName')
    onAccountNameChange(newVal, oldVal) {
        if (newVal === oldVal) return
        const {currentAccountName} = this.formItems
        const {accountMap} = this
        if (!accountMap[currentAccountName]) return
        const {password, hint, networkType} = accountMap[currentAccountName]
        this.cipher = password
        this.cipherHint = hint

        const currentAccount: CurrentAccount = {
            name: currentAccountName,
            password,
            networkType,
        }
        this.$store.commit('SET_ACCOUNT_DATA', currentAccount)
    }


    mounted() {
        const {accountMap} = this
        const accountData: AppAccount = getTopValueInObject(accountMap)
        if (!accountData) return
        const {accountName, wallets, password, networkType} = getTopValueInObject(accountMap)
        this.formItems.currentAccountName = accountName

        const currentAccount: CurrentAccount = {
            name: accountName,
            password,
            networkType,
        }

        this.$store.commit('SET_ACCOUNT_DATA', currentAccount)
        if (accountName) this.$store.commit('SET_ACCOUNT_DATA', currentAccount)
        if (!wallets.length) return
        this.$store.commit('SET_WALLET_LIST', wallets)
        this.$store.commit('SET_WALLET', wallets[0])
    }
}
