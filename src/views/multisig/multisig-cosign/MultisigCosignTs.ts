import {Component, Vue} from 'vue-property-decorator'
import {
    Account,
    AccountHttp,
    NetworkType,
    TransactionHttp,
    CosignatureTransaction,
    AggregateTransaction,
    Address
} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount} from "@/core/model"

// this component is for tesing multisig
@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigCosignTs extends Vue {
    activeAccount: StoreAccount
    privatekey = ''
    publicKey = ''
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

    get address(): Address {
        return Address.createFromRawAddress(this.activeAccount.wallet.address) 
    }

    async getCosignTransactions() {
        const {address, node} = this
        this.aggregatedTransactionList = await new AccountHttp(node)
            .aggregateBondedTransactions(address).toPromise()
    }

    cosignTransaction(index) {
        const {node, privatekey} = this
        const endpoint = node
        const account = Account.createFromPrivateKey(privatekey, NetworkType.MIJIN_TEST)
        const transactionHttp = new TransactionHttp(endpoint)
        const cosignatureTransaction = CosignatureTransaction.create(this.aggregatedTransactionList[index])
        const cosignedTx = account.signCosignatureTransaction(cosignatureTransaction)
        transactionHttp.announceAggregateBondedCosignature(cosignedTx).subscribe((x) => {
            console.log(x)
        })
        this.getCosignTransactions()
    }
}
