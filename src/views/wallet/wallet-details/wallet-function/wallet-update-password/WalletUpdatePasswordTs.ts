import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex';
import {Password} from 'nem2-sdk'
import {StoreAccount, AppInfo, AppWallet} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletUpdatePasswordTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    formItems = {
        prePassword: '',
        newPassword: '',
        repeatPassword: '',
    }
    privateKey = ''
    isCompleteForm = false

    get getWallet() {
        return this.activeAccount.wallet
    }

    get walletList() {
        return this.app.walletList
    }

    checkInfo() {
        // @TODO check password VeeValidate
        const {prePassword, newPassword, repeatPassword} = this.formItems

        if (prePassword == '' || newPassword == '' || repeatPassword == '') {
            this.showNotice('' + this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }

        if (newPassword !== repeatPassword) {
            this.showNotice('' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
            return false
        }
        return true
    }


    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: '' + text
        })
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updatePassword()
    }

    updatePassword() {
        const oldPassword = new Password(this.formItems.prePassword)
        const newPassword = new Password(this.formItems.newPassword)
        new AppWallet(this.getWallet).updatePassword(oldPassword, newPassword, this.$store)

        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    init() {
        this.formItems.prePassword = ''
        this.formItems.newPassword = ''
        this.formItems.repeatPassword = ''
        this.privateKey = ''
    }

    @Watch('formItems', {immediate: true, deep: true})
    onformItemsChange() {
        const {prePassword, newPassword, repeatPassword} = this.formItems
        this.isCompleteForm = prePassword !== '' && newPassword !== '' && repeatPassword !== ''
    }

    mounted() {
        this.init()
    }
}
