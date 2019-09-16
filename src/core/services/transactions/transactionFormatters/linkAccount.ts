import {FormattedTransaction, iconMap} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils/utils'
import {Address, AccountLinkTransaction} from 'nem2-sdk'
import {nodeConfig} from '@/config/index.ts';

export class FormattedLinkAccount extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: AccountLinkTransaction,
                  address: Address,
                  currentXem: string,
                  xemDivisibility: number) {
        super(tx, address, currentXem, xemDivisibility)

        this.icon = iconMap.dashboardLinkAccount

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + nodeConfig.XEM,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
