import {FormattedTransaction} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, LockFundsTransaction} from 'nem2-sdk'
import {defaultNetworkConfig} from '@/config/index.ts';

export class FormattedLock extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor( tx: LockFundsTransaction,
                address: Address,
                currentXem: string,
                xemDivisibility: number,
                store: any) {
          super(tx, address, currentXem, xemDivisibility, store)

          this.dialogDetailMap = {
              'transfer_type': this.txHeader.tag,
              'mosaic_ID': currentXem + ("(" + tx.mosaic.id.toHex() + ")"),
              'quantity': tx.mosaic.amount.compact(),
              'timestamp': this.txHeader.time,
              'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + defaultNetworkConfig.XEM,
              'block': this.txHeader.block,
              'hash': this.txHeader.hash,
          }
    }
}
