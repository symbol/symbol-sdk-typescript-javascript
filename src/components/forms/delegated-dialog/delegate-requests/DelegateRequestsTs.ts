import {Component, Vue, Provide} from "vue-property-decorator";
import {getAbsoluteMosaicAmount} from "@/core/utils"
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS, Message} from "@/config"
import {AppInfo, AppWallet, FormattedTransaction, StoreAccount, Notice, NoticeType} from "@/core/model"
import {mapState} from "vuex"
import {validation} from "@/core/validation"
import {Deadline, Password, PersistentDelegationRequestTransaction, UInt64} from "nem2-sdk"
import ThreeDotsLoading from '@/components/three-dots-loading/ThreeDotsLoading.vue'
import {RemoteAccountService} from '@/core/services';

@Component({
    components: {
        ThreeDotsLoading
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class DelegateRequestsTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    feeDivider = 1
    feeSpeed = FEE_SPEEDS.NORMAL
    defaultFees = DEFAULT_FEES[FEE_GROUPS.SINGLE]
    validation = validation
    app: AppInfo

    get feeAmount(): number {
        const {feeSpeed} = this
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get wallet() {
        return new AppWallet(this.activeAccount.wallet)
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get password() {
        return this.activeAccount.temporaryLoginInfo.password
    }

    get persistentAccountRequestTransactions(): FormattedTransaction[] {
        return this.wallet.getPersistentAccountRequests(this.$store) || []
    }

    get latestPersistentTransaction() {
        return this.persistentAccountRequestTransactions[0] || null
    }

    get temporaryRemoteNodeConfig() {
        return this.activeAccount.wallet.temporaryRemoteNodeConfig
    }

    getTransaction(): PersistentDelegationRequestTransaction {
        try {
            const {feeAmount, feeDivider} = this
            return new RemoteAccountService(this.wallet).
                getPersistentDelegationRequestTransaction(
                    Deadline.create(),
                    this.temporaryRemoteNodeConfig.publicKey,
                    UInt64.fromUint(feeAmount / feeDivider),
                    new Password(this.password),
                )
        } catch (error) {
            Notice.trigger(Message.REMOTE_ACCOUNT_NOT_FOUND, NoticeType.error, this.$store)
        }
    }

    async signAndAnnounce() {
        try {
            const transactionToSign = this.getTransaction()
            const account = new AppWallet(this.wallet).getAccount(new Password(this.password))
            const signedTransaction = account.sign(transactionToSign, this.app.networkProperties.generationHash)
            this.$emit("nextClicked");
            new AppWallet(this.wallet).announceTransaction(signedTransaction, this.$store)
        } catch (error) {
            console.error("AccountLinkTransactionTs -> signAndAnnounce -> error", error)
        }
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.signAndAnnounce()
            })
    }
}
