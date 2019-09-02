import {Password} from 'nem2-sdk'
import {AppWallet} from '@/core/utils/wallet.ts'
import {Message} from "@/config/index.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex';

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class DeleteWalletCheckTs extends Vue {
    activeAccount: any
    stepIndex = 0
    show = false
    wallet = {
        password: ''
    }

    @Prop()
    showCheckPWDialog: boolean

    get getWallet() {
        return this.activeAccount.wallet
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    // @TODO detele component in favord of VeeValidate check in WalletSwitch
    checkPassword() {
        try {
            const isPasswordCorrect = new AppWallet(this.getWallet).checkPassword(new Password(this.wallet.password))
            if (isPasswordCorrect) {
              this.checkPasswordDialogCancel()
              this.$emit('checkEnd')
            } else {
              this.$Notice.error({
                  title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
              })
            }

        } catch (error) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.wallet.password = ''
        this.show = this.showCheckPWDialog
    }

}
