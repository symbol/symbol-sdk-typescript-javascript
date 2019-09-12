import {filter, mergeMap} from 'rxjs/operators'
import {Address, Listener, TransactionHttp} from 'nem2-sdk'
import {from as observableFrom} from "rxjs"
import {map} from "rxjs/operators"

export class ListenerApiRxjs {

    public openWs(listener: any) {
        return observableFrom(listener.open())
    }

    sendMultisigWs(address: Address, account: any, node: string, signedBondedTx: any, signedLockTx: any, listener: any) {
        const transactionHttp = new TransactionHttp(node)
        return observableFrom(listener.open().then(() => {
            transactionHttp.announce(signedBondedTx)
            listener
                .confirmed(account.address)
                .pipe(
                    filter((transaction: any) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === signedLockTx.hash),
                    mergeMap(ignored => transactionHttp.announceAggregateBonded(signedBondedTx))
                )
                .subscribe()
        }))
    }
}
