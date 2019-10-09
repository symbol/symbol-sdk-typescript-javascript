import {copyTxt} from '@/core/utils/utils.ts'
import {ContactQR} from 'nem2-qr-library'
import {Address, AddressAlias, MultisigAccountInfo, PublicAccount} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import WalletAlias from './wallet-function/wallet-alias/WalletAlias.vue'
import WalletFilter from './wallet-function/wallet-filter/WalletFilter.vue'
import KeystoreDialog from '@/views/wallet/keystore-dialog/KeystoreDialog.vue'
import MnemonicDialog from '@/views/wallet/mnemonic-dialog/MnemonicDialog.vue'
import PrivatekeyDialog from '@/views/wallet/privatekey-dialog/PrivatekeyDialog.vue'
import WalletUpdatePassword from './wallet-function/wallet-update-password/WalletUpdatePassword.vue'
import WalletHarvesting from '@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvesting.vue'
import {mapState} from "vuex"
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import Alias from '@/views/forms/alias/Alias.vue'

@Component({
    components: {
        Alias,
        MnemonicDialog,
        PrivatekeyDialog,
        KeystoreDialog,
        WalletAlias,
        WalletFilter,
        WalletUpdatePassword,
        WalletHarvesting,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletDetailsTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    aliasList = []
    showMnemonicDialog: boolean = false
    showKeystoreDialog: boolean = false
    showPrivatekeyDialog: boolean = false
    functionShowList = [true, false]
    isShowBindDialog = false

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get isMultisig(): boolean {
        const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[this.wallet.address]
        if (!multisigAccountInfo) return false
        return multisigAccountInfo.cosignatories.length > 0
    }

    // @TODO: false should not be an option, if false occurs, then it is a reactivity bug
    get getAddress(): string | false {
        return this.activeAccount.wallet ? this.activeAccount.wallet.address : false
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get NamespaceList() {
        return this.activeAccount.namespaces
    }

    get importance() {
        return this.activeAccount.wallet.importance ? this.activeAccount.wallet.importance + '0' : 0
    }

    // @TODO: this should return a string, not an array
    get getSelfAlias(): string[] {
        return this.NamespaceList
            .filter(({alias}) =>
                alias instanceof AddressAlias &&
                alias.address.plain() === this.getAddress
            )
            .map(item => item.label)
    }


    showFunctionIndex(index) {
        this.functionShowList = [false, false, false]
        this.functionShowList[index] = true
    }

    // @WALLETS refactor
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

    get QRCode(): string {
        // @QR
        const publicAccount: any =  PublicAccount.createFromPublicKey(this.wallet.publicKey, this.wallet.networkType)
        return new ContactQR(
            this.wallet.name,
            publicAccount,
            this.wallet.networkType,
            this.activeAccount.generationHash,
        ).toBase64()
    }

    copy(txt) {
        copyTxt(txt).then(() => {
            this.$Notice.success({
                title: this['$t']('successful_copy') + ''
            })
        })
    }
}
