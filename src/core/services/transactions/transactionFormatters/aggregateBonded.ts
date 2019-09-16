import {FormattedTransaction, iconMap} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils/utils'
import {Address, RegisterNamespaceTransaction} from 'nem2-sdk'
import {nodeConfig} from '@/config/index.ts';

export class FormattedAggregateBonded extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor( tx: RegisterNamespaceTransaction,
                address: Address,
                currentXem: string,
                xemDivisibility: number) {
        super(tx, address, currentXem, xemDivisibility)
        this.icon = iconMap.dashboardAggregate

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + nodeConfig.XEM,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
