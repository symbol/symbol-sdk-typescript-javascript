import {FormattedTransaction, iconMap} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, LockFundsTransaction} from 'nem2-sdk'
import {nodeConfig} from '@/config/index.ts';

export class FormattedLock extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor( tx: LockFundsTransaction,
                address: Address,
                currentXem: string,
                xemDivisibility: number) {
          super(tx, address, currentXem, xemDivisibility)
          this.icon = iconMap.dashboardLock

          this.dialogDetailMap = {
              'transfer_type': this.txHeader.tag,
              'mosaic_ID': currentXem + ("(" + tx.mosaic.id.toHex() + ")"),
              'quantity': tx.mosaic.amount.compact(),
              'timestamp': this.txHeader.time,
              'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + nodeConfig.XEM,
              'block': this.txHeader.block,
              'hash': this.txHeader.hash,
          }
    }
}
