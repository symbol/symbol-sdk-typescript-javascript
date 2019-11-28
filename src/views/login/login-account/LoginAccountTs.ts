import {languageConfig, Message} from "@/config"
import {AppAccount, AppAccounts, AppInfo, CurrentAccount, StoreAccount} from "@/core/model"
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import {localRead, getObjectLength, getTopValueInObject, localSave} from "@/core/utils/utils"
import {validation} from "@/core/validation"
import {mapState} from "vuex"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue';

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
    languageList = languageConfig
    validation = validation
    cipher: string = ''
    cipherHint: string = ''
    errors: any
    isShowHint = false
    hintText = ''
    activeAccount: StoreAccount
    app: AppInfo
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

    jumpToDashBoard() {
        const {accountMap, accountPassword} = this
        const {currentAccountName, password} = this.formItems
        // no seed
        if (getObjectLength(currentAccountName) == 0 || !accountMap[currentAccountName].seed) {
            this.$store.commit('SET_TEMPORARY_PASSWORD', password)
            this.$router.push('generateMnemonic')
            return
        }

        this.$store.commit('SET_ACCOUNT_DATA', {
            name: currentAccountName,
            password: accountPassword,
            networkType: accountMap[currentAccountName].networkType,
        });
        // have wallet and seed ,init wallet
        this.$store.commit('SET_WALLET_LIST', accountMap[currentAccountName].wallets)
        this.$store.commit('SET_WALLET', accountMap[currentAccountName].wallets[0])
        this.$router.push('monitorPanel')
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
                that.jumpToDashBoard()
                localSave('activeAccountName', currentAccountName)
            })
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
