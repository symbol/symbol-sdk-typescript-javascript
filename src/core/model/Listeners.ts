import {Address, Listener, BlockInfo, Transaction, TransactionStatusError} from 'nem2-sdk'
import {Store} from 'vuex'
import {filter} from 'rxjs/operators'
import {NetworkProperties, AppState, Notice, NoticeType, TransactionStatusGroups} from '@/core/model'
import {Message, APP_PARAMS} from '@/config'
import {httpToWs} from '@/core/utils'
import {TransactionFormatter} from '../services'

const {MAX_LISTENER_RECONNECT_TRIES} = APP_PARAMS

export class Listeners {
  private httpEndpoint: string
  private wsEndpoint: string
  private restartTimes = 0
  private listener: Listener
  private address: Address

  private constructor(
    private readonly store: Store<AppState>,
    private readonly networkProperties: NetworkProperties,
    private readonly transactionFormatter: TransactionFormatter,
  ) { }

  public static create(store: Store<AppState>) {
    return new Listeners(
      store,
      store.state.app.networkProperties,
      store.state.app.transactionFormatter,
    )
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
    this.httpEndpoint = httpEndpoint
    this.wsEndpoint = httpToWs(httpEndpoint)
    if (!this.address) return
    this.stop()
    this.start()
  }

  private stop() {
    if (!this.listener) return
    this.listener && this.listener.close()
    console.info(`Stopped listeners for ${this.address.pretty()} on ${this.wsEndpoint}`)
  }

  private start() {
    const {address, wsEndpoint, store} = this
    this.listener = new Listener(this.wsEndpoint, WebSocket)

    if (this.restartTimes >= MAX_LISTENER_RECONNECT_TRIES) {
      console.info(`listener error, ${wsEndpoint} is invalid`)
      return
    }

    console.info(`starting chain listener for ${address.pretty()} on ${wsEndpoint}`)

    this.listener
      .open()
      .then(() => {
        this.listener.newBlock().subscribe((block: BlockInfo) => {
          this.networkProperties.handleLastBlock(block, this.httpEndpoint)
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

            this.transactionFormatter.formatAndSaveNewTransaction(transaction)
        })

        this.listener.unconfirmedAdded(this.address)
          .pipe(filter((transaction) => transaction.transactionInfo !== undefined))
          .subscribe((transaction: Transaction) => {
            Notice.trigger('Transaction_sending', NoticeType.success, store)

            this.transactionFormatter.formatAndSaveNewTransaction(
              transaction,
              {transactionStatusGroup: TransactionStatusGroups.unconfirmed}
            )
          })
      }, () => {
        this.retry()
      })
  }

  private retry() {
    this.stop()
    this.restartTimes++
    this.start()
  }
}