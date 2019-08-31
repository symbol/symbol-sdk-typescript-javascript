import {Component, Vue} from 'vue-property-decorator'
import {
    Account,
    AccountHttp,
    NetworkType,
    PublicAccount,
    TransactionHttp,
    CosignatureTransaction,
    AggregateTransaction
} from "nem2-sdk"
import {mapState} from "vuex"

// this component is for tesing multisig
@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigCosignTs extends Vue {
    activeAccount: any
    privatekey = ''
    publickey = ''
    aggregatedTransactionList: Array<AggregateTransaction> = []

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    async getCosignTransactions() {
        const {publickey, node} = this
        const accountHttp = new AccountHttp(node)

        const publicAccount = PublicAccount.createFromPublicKey(
            publickey,
            NetworkType.MIJIN_TEST,
        )
        this.aggregatedTransactionList = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise()
    }

    cosignTransaction(index) {

        const {publickey, node, privatekey} = this
        const endpoint = node
        const account = Account.createFromPrivateKey(privatekey, NetworkType.MIJIN_TEST)
        const transactionHttp = new TransactionHttp(endpoint)
        const emitter = (type, value) => {
            this.$emit(type, value)
        }
        const cosignatureTransaction = CosignatureTransaction.create(this.aggregatedTransactionList[index])
        const cosignedTx = account.signCosignatureTransaction(cosignatureTransaction)
        transactionHttp.announceAggregateBondedCosignature(cosignedTx).subscribe((x) => {
            console.log(x)
        })
        this.getCosignTransactions()
    }

}
