import {MnemonicQR} from 'nem2-qr-library'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Password} from "nem2-sdk"
import {AppAccounts, StoreAccount} from "@/core/model"
import {copyTxt} from "@/core/utils"
import {Message} from "@/config"
import failureIcon from "@/common/img/monitor/failure.png"
import {standardFields} from '@/core/validation'
import MnemonicVerification from "@/components/mnemonic-verification/MnemonicVerification.vue"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    components: {
        MnemonicVerification,
        ErrorTooltip,
    }
})
export class MnemonicDialogTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    MnemonicQR = MnemonicQR
    standardFields = standardFields
    copyTxt = copyTxt
    stepIndex = 0
    mnemonic = ''
    mnemonicQr: string = ''
    password: string = ''

    @Prop()
    showMnemonicDialog: boolean

    get show() {
        return this.showMnemonicDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('closeMnemonicDialog')
        }
    }

    get cipher() {
        return AppAccounts().getCipherPassword(this.activeAccount.accountName)
    }

    get QRCode(): string {
        const {mnemonic, password} = this
        const {generationHash, wallet} = this.activeAccount
        const {networkType} = wallet
        if (password.length < 8) return ''
        try {
            return new this.MnemonicQR(
                new MnemonicPassPhrase(mnemonic),
                new Password(password),
                networkType,
                generationHash,
            ).toBase64()
        } catch (error) {
            return failureIcon
        }
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.mnemonic = AppAccounts().decryptString(
                    this.activeAccount.wallet.encryptedMnemonic,
                    this.password,
                )
                this.stepIndex = 1
            })
    }

    async copyMnemonic() {
        await this.copyTxt(this.mnemonic)
        this.$Notice.success({
            title: this.$t(Message.COPY_SUCCESS) + ''
        })
    }
}
