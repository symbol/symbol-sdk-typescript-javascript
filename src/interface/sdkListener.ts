import {Listener,TransactionHttp} from 'nem2-sdk'
import {SdkV0} from './sdkDefine'
// @ts-ignore
import {filter, mergeMap} from 'rxjs/operators'

export const wsInterface: SdkV0.ws = {
  openWs: async (params) => {
    const Observable = params.listener.open();
    return {
      result: {
        ws: Observable
      }
    }
  },

  sendMultisigWs: async (params) => {
    const listener = params.listener
    const transactionHttp = new TransactionHttp(params.node)
    listener.open().then(() => {
      transactionHttp
        .announce(params.signedLockTx)

      listener
        .confirmed(params.account.address)
        .pipe(
          filter((transaction:any) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === params.signedLockTx.hash),
          mergeMap(ignored => transactionHttp.announceAggregateBonded(params.signedBondedTx))
        )
        .subscribe(announcedAggregateBonded => {
          } ,
          err => console.error(err))
    })
    return {
      result: {
        ws: 'hellow'
      }
    }
  },
}
