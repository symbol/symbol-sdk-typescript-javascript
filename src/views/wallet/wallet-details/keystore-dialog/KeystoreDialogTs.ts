import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Message} from "@/config/index.ts"
import {copyTxt} from "@/core/utils"
import {validation} from '@/core/validation'
import {AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
})
export class KeystoreDialogTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    errors: any
    validation = validation
    stepIndex = 0
    QRCode = ''
    keystoreText = ''
    password = ''

    @Prop()
    showKeystoreDialog: boolean

    get show() {
        return this.showKeystoreDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('closeKeystoreDialog')
        }
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    checkWalletPassword() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) {
                    this.$Notice.destroy()
                    this.$Notice.error({title: `${this.$t(this.errors.items[0].msg)}`})
                    return
                }

                this.stepIndex = 1
            })
    }

    exportKeystore() {
        switch (this.stepIndex) {
            case 0:
                this.checkWalletPassword()
                break
            case 1:
                this.generateKeystore()
                break
            case 2:
                this.stepIndex = 3
                break
        }
    }

    async generateKeystore() {
        this.keystoreText = new AppWallet(this.wallet).getKeystore()
        this.stepIndex = 2
    }

    copyKeystore() {
        copyTxt(this.keystoreText).then((data) => {
            this.$Notice.success({
                title: this.$t(Message.COPY_SUCCESS) + ''
            })
        }).catch((error) => {
            console.log(error)
        })
    }
}
