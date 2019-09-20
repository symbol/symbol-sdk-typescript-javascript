import {Component, Vue, Watch} from 'vue-property-decorator'
import {AppLock, StoredCipher} from '@/core/utils/appLock'
import {standardFields} from '@/core/validation'
import {mapState} from "vuex"
import {localRead, getObjectLength, getTopValueInObject} from "@/core/utils/utils"
import {Message} from "@/config"

@Component({
    computed: {
        ...mapState({
            app: 'app',
            activeAccount: 'account'
        })
    }
})
export class InputLockTs extends Vue {
    app: any
    passwordFieldValidation = standardFields.previousPassword.validation
    cipher: string = ''
    activeAccount: any
    cipherHint: string = ''
    errors: any
    activeError: string = ''
    isShowPrompt: boolean = false
    currentText: string = ''
    isShowClearCache: boolean = false
    walletMap: any = {}
    formItem = {
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
        const {currentAccountName} = this.formItem
        if (getObjectLength(currentAccountName) == 0 || !accountMap[currentAccountName].seed) {
            this.$router.push('initSeed')
            return
        }
        if (!accountMap[currentAccountName].wallets.length) {
            this.$router.push('walletCreate')
            return
        }
        this.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets[0])
        this.$router.push('monitorPanel')
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(text) + ''})
    }

    submit() {
        const {currentAccountName} = this.formItem
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
        this.$store.commit('SET_ACCOUNT_NAME', currentAccountName)
        // no seed
        if (!accountMap[currentAccountName].seed) {
            this.$router.push('initAccount')
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
                // have wallet and seed ,init wallet
                that.$store.commit('SET_HAS_WALLET', true)
                that.$store.commit('SET_WALLET_LIST', accountMap[currentAccountName].wallets)
                that.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets[0])
                that.jumpToDashBoard()
            })
    }


    @Watch('formItem.currentAccountName')
    onWalletChange() {
        const {currentAccountName} = this.formItem
        const {accountMap} = this
        if (!accountMap[currentAccountName]) return
        this.cipher = accountMap[currentAccountName].password
        this.cipherHint = accountMap[currentAccountName].hint
    }


    created() {
        const {accountMap} = this
        this.formItem.currentAccountName = getTopValueInObject(accountMap)['accountName']
    }

    clearCache() {
        // localRead remove
        // localRemove('lock')
        // localRemove('wallets')
        // localRemove('loglevel:webpack-dev-server')
    }
}
