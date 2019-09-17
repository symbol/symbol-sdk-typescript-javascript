import {FormattedTransaction, iconMap, transactionFormatter} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, AggregateTransaction} from 'nem2-sdk'
import {nodeConfig} from '@/config/index.ts';

export class FormattedAggregateComplete extends FormattedTransaction {
    dialogDetailMap: any
    icon: any
    formattedInnerTransactions: FormattedTransaction[]

    constructor(  tx: AggregateTransaction,
                  address: Address,
                  currentXem: string,
                  xemDivisibility: number) {
        super(tx, address, currentXem, xemDivisibility)
        this.icon = iconMap.dashboardAggregate
        this.formattedInnerTransactions = transactionFormatter(
            tx.innerTransactions,
            address,
            'currentXem',
            xemDivisibility,
            'node',
            currentXem)

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + nodeConfig.XEM,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
