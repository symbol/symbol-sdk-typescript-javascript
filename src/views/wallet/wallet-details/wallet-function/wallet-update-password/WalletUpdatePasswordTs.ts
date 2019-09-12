import {Message} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex';
import {Password} from 'nem2-sdk'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletUpdatePasswordTs extends Vue {
    activeAccount: any
    app: any
    formItem = {
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
        const {prePassword, newPassword, repeatPassword} = this.formItem

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
        const oldPassword = new Password(this.formItem.prePassword)
        const newPassword = new Password(this.formItem.newPassword)
        new AppWallet(this.getWallet).updatePassword(oldPassword, newPassword, this.$store)

        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    init() {
        this.formItem.prePassword = ''
        this.formItem.newPassword = ''
        this.formItem.repeatPassword = ''
        this.privateKey = ''
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {prePassword, newPassword, repeatPassword} = this.formItem
        this.isCompleteForm = prePassword !== '' && newPassword !== '' && repeatPassword !== ''
    }

    mounted() {
        this.init()
    }
}
