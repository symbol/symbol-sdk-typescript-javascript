import {mapState} from 'vuex'
import {Password, AggregateTransaction, CosignatureTransaction} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {transactionFormatter} from '@/core/services/transactions'
import {Message} from "@/config"
import {CreateWalletType} from '@/core/model/CreateWalletType'
import trezor from '@/core/utils/trezor'
import {AppWallet} from '@/core/model/AppWallet'
import {transactionConfirmationObservable} from '@/core/services/transactions'
import TransactionSummary from '@/components/transaction-summary/TransactionSummary.vue'
import {StagedTransaction, SignTransaction} from '@/core/model'

@Component({
    computed: {...mapState({app: 'app', account: 'account'})},
    components:{
        TransactionSummary
    }
})

export class TransactionConfirmationTs extends Vue {
    app: any;
    account: any;

    // when a user is prompted to confirm/sign a transaction
    // that workflow will subscribe to this observable and use it to control UI flow
    producer: any;

    password = '';

    get walletTypes() {
        return CreateWalletType;
    }

    get show() {
        return this.app.stagedTransaction.isAwaitingConfirmation
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
            const result: SignTransaction = {
                success: false,
                signedTransaction: null,
                error: Message.USER_ABORTED_TX_CONFIRMATION,
            }

            transactionConfirmationObservable.next(result);
        }
    }

    get isSelectedAccountMultisig(): boolean {
        return this.account.activeMultisigAccount ? true : false
    }

    get accountPublicKey(): string {
        return this.account.wallet.publicKey
    }

    get wallet() {
        return this.account.wallet;
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

        if(transactionResult.success) {
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
        const isPasswordValid = new AppWallet(this.wallet).checkPassword(this.password);

        if(!isPasswordValid) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return;
        }

        const account = new AppWallet(this.wallet).getAccount(new Password(this.password))

        // by default just sign the basic stagedTransaction
        const {transactionToSign, lockParams} = this.stagedTransaction;

        /**
         * AGGREGATE BONDED
         */
        if (transactionToSign instanceof AggregateTransaction && lockParams.announceInLock) {
            const {signedTransaction, signedLock} = new AppWallet(this.wallet).getSignedLockAndAggregateTransaction(
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
            this.password = '';
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
          this.password = '';
        }


        /**
         * DEFAULT SIGNATURE
         */
        const result: SignTransaction = {
            success: true,
            signedTransaction: account.sign(transactionToSign, this.account.generationHash),
            error: null,
        }

        transactionConfirmationObservable.next(result);
        this.password = '';
    }
}
