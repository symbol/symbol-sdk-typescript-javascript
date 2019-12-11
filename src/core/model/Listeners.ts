import {Address, Listener, BlockInfo, Transaction, TransactionStatusError, add} from "nem2-sdk"
import {Store} from 'vuex'
import {filter} from 'rxjs/operators'
import {formatAndSave} from '@/core/services/transactions'
import {ChainStatus, TRANSACTIONS_CATEGORIES, AppState, Notice, NoticeType} from '@/core/model'
import {Message, APP_PARAMS} from '@/config'
import {httpToWs} from '@/core/utils'

const {MAX_LISTENER_RECONNECT_TRIES} = APP_PARAMS

export class Listeners {
    private wsEndpoint: string
    private restartTimes: number = 0
    private listener: Listener
    private address: Address

    private constructor(private store: Store<AppState>) {}

    public static create(store: Store<AppState>) {
        return new Listeners(store)
    }

    public switchAddress(address: Address) {
        this.restartTimes = 0
        this.address = address
        if (!this.wsEndpoint) return
        this.stop()
        this.start()
    }

    public switchEndpoint(httpEndpoint: string) {
        this.restartTimes = 0
        this.wsEndpoint = httpToWs(httpEndpoint)
        if (!this.address) return
        this.stop()
        this.start()
    }

    private stop() {
        if (!this.listener) return
        this.listener && this.listener.close()
        console.log(`Stopped listeners for ${this.address.pretty()} on ${this.wsEndpoint}`)
    }

    private start() {
        const {address, wsEndpoint, store} = this
        this.listener = new Listener(this.wsEndpoint, WebSocket)

        if (this.restartTimes >= MAX_LISTENER_RECONNECT_TRIES) {
            console.log(`listener error, ${wsEndpoint} is invalid`)
            return
        }

        console.log(`starting chain listener for ${address.pretty()} on ${wsEndpoint}`)

        this.listener
            .open()
            .then(() => {
                this.listener.newBlock().subscribe((block: BlockInfo) => {
                    store.commit('SET_CHAIN_STATUS', new ChainStatus(block))
                })

                this.listener.status(address).subscribe((error: TransactionStatusError) => {
                    Notice.trigger(error.status.split('_').join(' '), NoticeType.error, store)
                })

                this.listener.cosignatureAdded(address).subscribe(() => {
                    Notice.trigger(Message.NEW_COSIGNATURE, NoticeType.success, store)
                })

                this.listener.aggregateBondedAdded(address).subscribe(() => {
                    Notice.trigger(Message.NEW_AGGREGATE_BONDED, NoticeType.success, store)
                })

                this.listener.confirmed(address)
                    .pipe(filter((transaction) => transaction.transactionInfo !== undefined))
                    .subscribe((transaction: Transaction) => {
                        Notice.trigger('Transaction_Reception', NoticeType.success, store)

                        formatAndSave(
                            // @ts-ignore
                            {...transaction, isTxConfirmed: true},
                            this.store,
                            true,
                            TRANSACTIONS_CATEGORIES.NORMAL,
                        )
                    })

                this.listener.unconfirmedAdded(this.address)
                    .pipe(filter((transaction) => transaction.transactionInfo !== undefined))
                    .subscribe((transaction: Transaction) => {
                        Notice.trigger('Transaction_sending', NoticeType.success, store)

                        formatAndSave(
                            // @ts-ignore
                            {...transaction, isTxConfirmed: false},
                            this.store,
                            false,
                            TRANSACTIONS_CATEGORIES.NORMAL,
                        )
                    })
            }, (err) => {
                this.retry()
            })
    }

    private retry() {
        this.stop();
        this.restartTimes++;
        this.start()
    }
}
