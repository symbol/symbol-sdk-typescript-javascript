import {Component, Vue, Watch} from 'vue-property-decorator'
import {standardFields} from '@/core/validation'
import {mapState} from "vuex"
import {localRead, getObjectLength, getTopValueInObject} from "@/core/utils/utils"
import {Message} from "@/config"
import {AppInfo, StoreAccount} from "@/core/model"

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
    passwordFieldValidation = standardFields.previousPassword.validation
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
        this.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets[0])
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
                // have wallet and seed ,init wallet
                that.$store.commit('SET_HAS_WALLET', true)
                that.$store.commit('SET_WALLET_LIST', accountMap[currentAccountName].wallets)
                that.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets[0])
                that.jumpToDashBoard()
            })
    }


    @Watch('formItems.currentAccountName')
    onWalletChange(newVal, oldVal) {
        if (newVal === oldVal) return
        const {currentAccountName} = this.formItems
        this.$store.commit('SET_ACCOUNT_NAME', currentAccountName)
        const {accountMap} = this
        if (!accountMap[currentAccountName]) return
        this.cipher = accountMap[currentAccountName].password
        this.cipherHint = accountMap[currentAccountName].hint
    }


    mounted() {
        const {accountMap} = this
        const accountName = getTopValueInObject(accountMap)['accountName']
        this.formItems.currentAccountName = accountName
        if (accountName) this.$store.commit('SET_ACCOUNT_NAME', accountName)
    }
}
