import {Address, Listener, NodeHttp} from "nem2-sdk"
import {filter} from 'rxjs/operators'
import {formatAndSave} from '@/core/services/transactions'
import {ChainStatus, TRANSACTIONS_CATEGORIES} from '@/core/model'
import {Message} from '@/config'

export class ChainListeners {
    private readonly app: any //@TODO: rename and type
    private node: string
    // @TODO address as Address
    private address: string

    constructor(app: any, address: string, endpoint: string) {
        this.app = app
        this.address = address || ''
        // can be http or https
        this.node = endpoint.replace(endpoint.substring(0, 5) == 'https' ? 'https' : 'http', 'ws')
    }

    errorTxList: any = []
    unconfirmedTxListener: Listener
    confirmedTxListener: Listener
    txStatusListener: Listener
    newBlocksListener: Listener
    multisigConfirmedListener: Listener
    aggregateBondedTxListener: Listener
    cosignatureTxAdded: Listener

    start() {
        console.log(`starting chain listener for ${this.address} on ${this.node}`)
        this.chainListener()
    }

    startTransactionListeners() {
        console.log(`starting transactions listeners for ${this.address} on ${this.node}`)
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
        this.aggregateBondedListener()
        this.cosignatureAddedListener()
    }

    switchAddress(address: string) {
        this.address = address
        this.startTransactionListeners()
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
                    .subscribe(
                      transaction => {
                        that.$Notice.success({
                            title: receivedTransactionMessage, // quick fix
                            duration: 20,
                        })
                        formatAndSave(
                            {...transaction, isTxConfirmed: false},
                            that.$store,
                            false,
                            TRANSACTIONS_CATEGORIES.NORMAL,
                        )
                      },
                    error => console.error("ChainListeners -> error", error)
                  )
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
                            title: receivedTransactionMessage, // quick fix
                            duration: 4,
                        })
                        formatAndSave(
                            transaction,
                            that.$store,
                            true,
                            TRANSACTIONS_CATEGORIES.NORMAL,
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

    cosignatureAddedListener(): void {
        this.cosignatureTxAdded && this.cosignatureTxAdded.close()
        const that = this.app
        const NEW_COSIGNATURE = that.$t(Message.NEW_COSIGNATURE)
        this.cosignatureTxAdded = new Listener(this.node, WebSocket)
        this.cosignatureTxAdded
            .open()
            .then(() => {
                this.cosignatureTxAdded
                    .cosignatureAdded(Address.createFromRawAddress(this.address))
                    .subscribe((_) => {
                        that.$Notice.destroy()
                        that.$Notice.success({
                            title: NEW_COSIGNATURE, // quick fix
                            duration: 4,
                        })
                    })
            })

    }

    aggregateBondedListener(): void {
        this.aggregateBondedTxListener && this.aggregateBondedTxListener.close()
        const that = this.app
        const NEW_AGGREGATE_BONDED = that.$t(Message.NEW_AGGREGATE_BONDED)
        this.aggregateBondedTxListener = new Listener(this.node, WebSocket)
        this.aggregateBondedTxListener
            .open()
            .then(() => {
                this.aggregateBondedTxListener
                    .aggregateBondedAdded(Address.createFromRawAddress(this.address))
                    .subscribe((_) => {
                        that.$Notice.destroy()
                        that.$Notice.success({
                            title: NEW_AGGREGATE_BONDED, // quick fix
                            duration: 4,
                        })
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
