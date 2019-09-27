import {Address, Listener} from "nem2-sdk"
import {filter} from 'rxjs/operators'
import {formatAndSave} from '@/core/services/transactions'
import {ChainStatus} from '@/core/model'
export class ChainListeners {
    private readonly app: any
    private node: string
    // @TODO address as Address
    private address: string

    constructor(app: any, address: string, endpoint: string) {
        this.app = app
        this.address = address || ''
        this.node = endpoint.replace('http', 'ws')
    }

    errorTxList: any = []
    unconfirmedTxListener: Listener
    confirmedTxListener: Listener
    txStatusListener: Listener
    newBlocksListener: Listener
    multisigConfirmedListener: Listener

    start() {
        console.log(`starting chain listener for ${this.address} on ${this.node}`)
        this.chainListener()
    }

    startTransactionListeners() {
        console.log(`starting transactions listeners for ${this.address} on ${this.node}`)
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }

    switchAddress(address: string) {
        this.address = address
        console.log(`ChainListeners switchAddress to ${this.address}`)
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }

    switchEndpoint(endpoint: string) {
        this.node = endpoint.replace('http', 'ws')
        console.log(`ChainListeners switchEndpoint to ${this.node}`)
        this.chainListener()
    }

    switchMultisigConfirmedListener(address: string): void {
        this.multisigConfirmedListener && this.multisigConfirmedListener.close()
        const that = this.app
        const receivedTransactionMessage = that.$t('Multisig_Transaction_Reception')
        const multisigAccountAddress = address

        this.multisigConfirmedListener = new Listener(this.node, WebSocket)
        this.multisigConfirmedListener
            .open()
            .then(() => {
                this.confirmedTxListener
                    .confirmed(Address.createFromRawAddress(multisigAccountAddress))
                    .pipe(filter((transaction: any) => transaction.transactionInfo !== undefined))
                    .subscribe((transaction) => {
                        that.$store.commit('ADD_CONFIRMED_MULTISIG_ACCOUNT_TRANSACTION', {address, transaction})
                        that.$Notice.destroy()
                        that.$Notice.success({
                            title: receivedTransactionMessage, // quickfix
                            duration: 4,
                        })
                    })
            })
    }

    unconfirmedListener(): void {
        this.unconfirmedTxListener && this.unconfirmedTxListener.close()
        const that = this.app
        const receivedTransactionMessage = that.$t('Transaction_sending')
        this.unconfirmedTxListener = new Listener(this.node, WebSocket)
        this.unconfirmedTxListener
            .open()
            .then(() => {
                this.unconfirmedTxListener
                    .unconfirmedAdded(Address.createFromRawAddress(this.address))
                    .pipe(filter((transaction: any) => transaction.transactionInfo !== undefined))
                    .subscribe(transaction => {
                        that.$Notice.success({
                            title: receivedTransactionMessage, // quickfix
                            duration: 20,
                        })
                        formatAndSave(
                            that.$store.getters.mosaicList,
                            {...transaction, isTxUnconfirmed: true},
                            that.$store.getters.wallet.address,
                            that.$store.getters.currentXEM1,
                            that.$store.getters.xemDivisibility,
                            that.$store.getters.node,
                            that.$store.getters.currentXem,
                            that.$store,
                            false
                        )


                    })
            })

    }

    confirmedListener(): void {
        this.confirmedTxListener && this.confirmedTxListener.close()
        const that = this.app
        const receivedTransactionMessage = that.$t('Transaction_Reception')
        this.confirmedTxListener = new Listener(this.node, WebSocket)
        this.confirmedTxListener
            .open()
            .then(() => {
                this.confirmedTxListener
                    .confirmed(Address.createFromRawAddress(this.address))
                    .pipe(filter((transaction: any) => transaction.transactionInfo !== undefined))
                    .subscribe((transaction) => {
                        that.$Notice.destroy()
                        that.$Notice.success({
                            title: receivedTransactionMessage, // quickfix
                            duration: 4,
                        })
                        formatAndSave(
                            that.$store.getters.mosaicList,
                            transaction,
                            that.$store.getters.wallet.address,
                            that.$store.getters.currentXEM1,
                            that.$store.getters.xemDivisibility,
                            that.$store.getters.node,
                            that.$store.getters.currentXem,
                            that.$store,
                            true
                        )
                    })
            })

    }

    txErrorListener(): void {
        this.txStatusListener && this.txStatusListener.close()
        const {errorTxList} = this
        const {$Notice, $store} = this.app
        this.txStatusListener = new Listener(this.node, WebSocket)
        this.txStatusListener
            .open()
            .then(() => {
                this.txStatusListener
                    .status(Address.createFromRawAddress(this.address))
                    .subscribe(transaction => {
                        if (!errorTxList.includes(transaction.hash)) {
                            errorTxList.push(transaction.hash)
                            $store.commit('SET_ERROR_TEXT', errorTxList)
                            $Notice.destroy()
                            $Notice.error({
                                title: transaction.status.split('_').join(' '),
                                duration: 10,
                            })
                        }
                    })
            })

    }

    chainListener() {
        const store = this.app.$store
        this.newBlocksListener && this.newBlocksListener.close()
        this.newBlocksListener = new Listener(this.node, WebSocket)
        this.newBlocksListener
            .open()
            .then(() => {
                this.newBlocksListener
                    .newBlock()
                    .subscribe(block => {
                        store.commit('SET_CHAIN_STATUS', new ChainStatus(block))
                    })
            })
    }

}
