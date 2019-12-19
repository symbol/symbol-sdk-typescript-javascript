import {languageConfig, Message} from "@/config"
import {AppAccount, AppAccounts, AppInfo, AppWallet, CurrentAccount, StoreAccount} from "@/core/model"
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import {localRead, getTopValueInObject, localSave} from '@/core/utils/utils'
import {validation} from "@/core/validation"
import {mapState} from "vuex"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue';
import {onLogin} from '@/core/services'

@Component({
    computed: {
        ...mapState({activeAccount: 'account', app: 'app'}),
    },
    components: {
        ErrorTooltip
    }
})
export default class LoginAccountTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    languageList = languageConfig
    validation = validation
    cipher: string = ''
    cipherHint: string = ''
    errors: any
    isShowHint = false
    hintText = ''
    onLogin = onLogin
    formItems = {
        currentAccountName: '',
        password: ''
    }

    get language() {
        return this.$i18n.locale
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    get accountMap() {
        return localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
    }

    get accountPassword() {
        if (!this.accountMap[this.formItems.currentAccountName]) return null
        return this.formItems.currentAccountName ? this.accountMap[this.formItems.currentAccountName].password : null
    }

    get networkType() {
        return this.activeAccount.currentAccount.networkType
    }

    get accountList() {
        const {accountMap} = this
        let accountList = []
        Object.keys(accountMap).forEach((key: string) => {
            if (accountMap[key].wallets.length === 0) {
                delete accountMap[key]
                return
            }
            accountList.push({
                value: key,
                label: key
            })
        })
        localSave('accountMap', JSON.stringify(accountMap))
        this.$forceUpdate()
        return accountList
    }

    toChooseImportWay() {
        this.$router.push('chooseImportWay')
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(text) + ''})
    }

    submit() {
        const {accountMap} = this
        const {currentAccountName} = this.formItems
        const that = this
        if (this.errors.items.length > 0) {
            this.showErrorNotice(this.errors.items[0].msg)
            return
        }
        if (!currentAccountName) {
            this.showErrorNotice(Message.ACCOUNT_NAME_INPUT_ERROR)
            return
        }

        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.login()
            })
    }

    login() {
      localSave('activeAccountName',this.formItems.currentAccountName)
        if (this.noSeedAvailable()) {
            this.createNewAccount()
            return
        }

        this.onLogin(this.formItems.currentAccountName, this.$store)
        this.goToDashBoard()
    }

    createNewAccount() {
        this.$store.commit('SET_TEMPORARY_PASSWORD', this.formItems.password)
        this.$router.push('generateMnemonic')
        return
    }

    noSeedAvailable(): boolean {
        const {currentAccountName} = this.formItems
        if (!currentAccountName || currentAccountName === '') return true
        if (!this.accountMap) return true
        if (!this.accountMap[currentAccountName]) return true
        if (!this.accountMap[currentAccountName].seed) return true
        return false
    }

    goToDashBoard() {
        const activeWalletAddress = this.accountMap[this.formItems.currentAccountName].activeWalletAddress
        AppWallet.updateActiveWalletAddress(activeWalletAddress, this.$store)
        this.$router.push('monitorPanel')
    }

    @Watch('formItems.currentAccountName')
    onAccountNameChange(newVal, oldVal) {
        if (newVal === oldVal) return
        const {currentAccountName} = this.formItems
        const {accountMap} = this
        if (!accountMap[currentAccountName]) return
        this.cipher = this.accountPassword
        this.hintText = accountMap[currentAccountName].hint
    }


    mounted() {
        const {accountMap} = this
        const activeAccountName = localRead('activeAccountName')
        if (activeAccountName) {
            this.formItems.currentAccountName = activeAccountName
            return
        }
        if (!getTopValueInObject(accountMap)) return
        this.formItems.currentAccountName = getTopValueInObject(accountMap).accountName
    }
}
