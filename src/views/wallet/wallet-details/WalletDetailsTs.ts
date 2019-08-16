import {copyTxt} from '@/core/utils/utils'
import {QRCodeGenerator} from 'nem2-qr-library'
import {Address} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import WalletAlias from './wallet-function/wallet-alias/WalletAlias.vue'
import WalletFilter from './wallet-function/wallet-filter/WalletFilter.vue'
import KeystoreDialog from '@/views/wallet/keystore-dialog/KeystoreDialog.vue'
import MnemonicDialog from '@/views/wallet/mnemonic-dialog/MnemonicDialog.vue'
import PrivatekeyDialog from '@/views/wallet/privatekey-dialog/PrivatekeyDialog.vue'
import WalletUpdatePassword from './wallet-function/wallet-update-password/WalletUpdatePassword.vue'

@Component({
    components: {
        MnemonicDialog,
        PrivatekeyDialog,
        KeystoreDialog,
        WalletAlias,
        WalletFilter,
        WalletUpdatePassword
    },
})
export class WalletDetailsTs extends Vue {
    aliasList = []
    QRCode: string = ''
    showMnemonicDialog: boolean = false
    showKeystoreDialog: boolean = false
    showPrivatekeyDialog: boolean = false
    functionShowList = [true, false, false]

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get getAddress() {
        return this.getWallet.address
    }

    showFunctionIndex(index) {
        this.functionShowList = [false, false, false]
        this.functionShowList[index] = true
    }

    changeMnemonicDialog() {
        if (!this.getWallet['mnemonicEnCodeObj']['ciphertext']) {
            this.$Notice.warning({
                title: this.$t('no_mnemonic') + ''
            })
            return
        }
        this.showMnemonicDialog = true
    }

    closeMnemonicDialog() {
        this.showMnemonicDialog = false
    }

    changePrivatekeyDialog() {
        this.showPrivatekeyDialog = true
    }

    closePrivatekeyDialog() {
        this.showPrivatekeyDialog = false
    }

    changeKeystoreDialog() {
        this.showKeystoreDialog = true
    }

    closeKeystoreDialog() {
        this.showKeystoreDialog = false
    }

    setQRCode(address) {
        const {networkType} = Address.createFromRawAddress(address)
        const {generationHash} = this.$store.state.account
        this.QRCode = QRCodeGenerator
            .createExportObject({address}, networkType, generationHash).toBase64();
    }

    copy(txt) {
        copyTxt(txt).then(() => {
            this.$Notice.success({
                title: this['$t']('successful_copy') + ''
            });
        })
    }

    init() {
        this.setQRCode(this.getAddress)
    }

    @Watch('getAddress')
    onGetAddressChange() {
        this.init()
    }

    created() {
        this.init()
    }
}
