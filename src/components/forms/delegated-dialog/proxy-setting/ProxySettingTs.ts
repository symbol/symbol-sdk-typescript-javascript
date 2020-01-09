import {Component, Vue, Provide} from "vue-property-decorator";
import {AppInfo, AppWallet, StoreAccount} from "@/core/model"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils"
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS} from "@/config"
import {AccountLinkTransaction, Deadline, LinkAction, Password, UInt64} from "nem2-sdk"
import {validatePublicKey} from "@/core/validation"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {RemoteAccountService} from '@/core/services';

@Component({
    components: {ErrorTooltip},
    computed: {...mapState({activeAccount: 'account', app: 'app'})},

})
export class ProxySettingTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    feeSpeed = FEE_SPEEDS.NORMAL
    defaultFees = DEFAULT_FEES[FEE_GROUPS.SINGLE]
    feeDivider = 1
    isButtonDisabled = false
    isShowAlertToConfirm = false
    remotePublicKey: string = null

    get feeAmount(): number {
        const {feeSpeed} = this
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get linkedAccountKey() {
        return this.wallet.linkedAccountKey
    }

    get currentRemotePublicKey() {
        return this.linkedAccountKey || this.remotePublicKey
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get password() {
        return this.activeAccount.temporaryLoginInfo.password
    }

    async signAndAnnounce() {
        try {
            const {wallet, feeAmount, feeDivider, remotePublicKey, password} = this

            const transactionToSign = wallet.linkedAccountKey
                ? this.createUnlinkTransaction()
                : this.createAccountLinkTransaction(
                    password,
                    remotePublicKey,
                    UInt64.fromUint(feeAmount / feeDivider),
                )

            const account = new AppWallet(this.wallet).getAccount(new Password(this.password))
            const signedTransaction = account.sign(transactionToSign, this.app.networkProperties.generationHash)
            new AppWallet(this.wallet).announceTransaction(signedTransaction, this.$store)

        } catch (error) {
            console.error("AccountLinkTransactionTs -> submit -> error", error)
        }
    }

    createUnlinkTransaction(): AccountLinkTransaction {
        const {feeAmount, feeDivider} = this
        return AccountLinkTransaction.create(
            Deadline.create(),
            this.linkedAccountKey,
            LinkAction.Unlink,
            this.wallet.networkType,
            UInt64.fromUint(feeAmount / feeDivider),
        )
    }

    createAccountLinkTransaction(password: string, remoteAccountPublicKey: string, feeAmount: UInt64): AccountLinkTransaction {
        try {
            return AccountLinkTransaction.create(
                Deadline.create(),
                remoteAccountPublicKey,
                LinkAction.Link,
                this.wallet.networkType,
                feeAmount
            )
        } catch (error) {
            throw new Error(error)
        }
    }

    submit() {
        if (this.isButtonDisabled) return
        if (validatePublicKey(this.currentRemotePublicKey).valid) {
            this.isButtonDisabled = true
            this.signAndAnnounce()
        }
    }

    async mounted() {
        if (!this.linkedAccountKey) {
            Vue.nextTick().then(() => {
                setTimeout(() => {
                    this.setRemotePublicKey()
                }, 100)
            })
        }
    }

    async setRemotePublicKey() {
        try {
            this.remotePublicKey = await new RemoteAccountService(this.wallet)
                .getAvailableRemotePublicKey(
                    new Password(this.password),
                    this.$store,
                )
        } catch (error) {
            // @TODO
            console.error(error)
        }
    }
}
