import {copyTxt} from '@/core/utils/utils.ts'
import {QRCodeGenerator} from 'nem2-qr-library'
import {Address, MultisigAccountInfo} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import WalletAlias from './wallet-function/wallet-alias/WalletAlias.vue'
import WalletFilter from './wallet-function/wallet-filter/WalletFilter.vue'
import KeystoreDialog from '@/views/wallet/keystore-dialog/KeystoreDialog.vue'
import MnemonicDialog from '@/views/wallet/mnemonic-dialog/MnemonicDialog.vue'
import PrivatekeyDialog from '@/views/wallet/privatekey-dialog/PrivatekeyDialog.vue'
import WalletUpdatePassword from './wallet-function/wallet-update-password/WalletUpdatePassword.vue'
import {mapState} from "vuex"
import {AppWallet} from '@/core/model'

@Component({
    components: {
        MnemonicDialog,
        PrivatekeyDialog,
        KeystoreDialog,
        WalletAlias,
        WalletFilter,
        WalletUpdatePassword
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletDetailsTs extends Vue {
    activeAccount: any
    app: any
    aliasList = []
    QRCode: string = ''
    showMnemonicDialog: boolean = false
    showKeystoreDialog: boolean = false
    showPrivatekeyDialog: boolean = false
    functionShowList = [true, false]

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get isMultisig(): boolean {
        const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[this.wallet.address]
        if (!multisigAccountInfo) return false
        return multisigAccountInfo.cosignatories.length > 0
    }

    get getAddress() {
        return this.activeAccount.wallet ? this.activeAccount.wallet.address : false
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    showFunctionIndex(index) {
        this.functionShowList = [false, false, false]
        this.functionShowList[index] = true
    }

    // @TODO
    changeMnemonicDialog() {
        if (!this.wallet['encryptedMnemonic']) {
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
        if (!address || address.length < 40) return
        const {networkType} = Address.createFromRawAddress(address)
        const {generationHash} = this
        this.QRCode = QRCodeGenerator.createExportObject({address}, networkType, generationHash).toBase64()
    }

    copy(txt) {
        copyTxt(txt).then(() => {
            this.$Notice.success({
                title: this['$t']('successful_copy') + ''
            })
        })
    }

    init() {
        this.setQRCode(this.getAddress)
    }

    @Watch('getAddress')
    onGetAddressChange() {
        this.init()
    }

    mounted() {
        this.init()
    }
}
