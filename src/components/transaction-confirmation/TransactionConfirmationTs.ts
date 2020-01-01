import {mapState} from 'vuex'
import {Password, AggregateTransaction, CosignatureTransaction} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {transactionFormatter, transactionConfirmationObservable} from '@/core/services'
import {Message} from "@/config"
import {
    CreateWalletType, AppWallet, StagedTransaction, SignTransaction,
    AppInfo, StoreAccount, Notice, NoticeType,
} from '@/core/model'
import trezor from '@/core/utils/trezor'
import TransactionDetails from '@/components/transaction-details/TransactionDetails.vue'

@Component({
    computed: {...mapState({app: 'app', activeAccount: 'account'})},
    components: {
        TransactionDetails
    }
})

export class TransactionConfirmationTs extends Vue {
    app: AppInfo;
    activeAccount: StoreAccount;
    password = '';
    CreateWalletType = CreateWalletType

    get show() {
        return this.app.stagedTransaction.isAwaitingConfirmation
    }

    set show(val) {
        if (!val) {
            this.password = ""
            this.$emit('close')
            const result: SignTransaction = {
                success: false,
                signedTransaction: null,
                error: Message.USER_ABORTED_TX_CONFIRMATION,
            }

            transactionConfirmationObservable.next(result);
        }
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get stagedTransaction(): StagedTransaction {
        return this.app.stagedTransaction
    }

    get formattedTransaction() {
        const {transactionToSign} = this.stagedTransaction
        const [formattedTransaction] = transactionFormatter([transactionToSign], this.$store)
        return formattedTransaction
    }

    async confirmTransactionViaTrezor() {
        const transactionResult = await trezor.nemSignTransaction({
            path: this.wallet.path,
            transaction: this.stagedTransaction
        })

        if (transactionResult.success) {
            // get signedTransaction via TrezorConnect.nemSignTransaction
            const result: SignTransaction = {
                success: true,
                signedTransaction: transactionResult.payload.signature,
                error: null
            }

            transactionConfirmationObservable.next(result);
        } else {
            const result: SignTransaction = {
                success: false,
                signedTransaction: null,
                error: transactionResult.payload.error
            }

            transactionConfirmationObservable.next(result);
        }
    }

    submit() {
        const {wallet, password} = this

        if (!wallet.checkPassword(password)) {
            Notice.trigger(Message.WRONG_PASSWORD_ERROR, NoticeType.error, this.$store)
            this.password = ''
            return;
        }

        const account = wallet.getAccount(new Password(this.password))
        const {transactionToSign, lockParams} = this.stagedTransaction;

        /**
         * AGGREGATE BONDED
         */
        if (transactionToSign instanceof AggregateTransaction && lockParams.announceInLock) {
            const {signedTransaction, signedLock} = wallet.getSignedLockAndAggregateTransaction(
                transactionToSign,
                lockParams.transactionFee,
                this.password,
                this.$store,
            )

            const result: SignTransaction = {
                success: true,
                signedTransaction,
                signedLock,
                error: null,
            }

            transactionConfirmationObservable.next(result);
            this.password = ''
            return
        }


        /**
         * COSIGNATURE
         */
        if (transactionToSign instanceof AggregateTransaction && transactionToSign.signer) {
            const cosignatureTransaction = CosignatureTransaction.create(transactionToSign)

            const result: SignTransaction = {
                success: true,
                signedTransaction: account.signCosignatureTransaction(cosignatureTransaction),
                error: null,
            }

            transactionConfirmationObservable.next(result);
            this.password = ''
            return
        }


        /**
         * DEFAULT SIGNATURE
         */
        const result: SignTransaction = {
            success: true,
            signedTransaction: account.sign(transactionToSign, this.app.NetworkProperties.generationHash),
            error: null,
        }

        this.password = ''
        transactionConfirmationObservable.next(result);
    }
}
