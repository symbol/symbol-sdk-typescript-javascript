import {FormattedTransaction} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, AddressAliasTransaction} from 'nem2-sdk'
import {defaultNetworkConfig} from '@/config/index.ts';

export class FormattedAddressAlias extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: AddressAliasTransaction,
                  address: Address,
                  currentXem: string,
                  xemDivisibility: number,
                  store: any) {
        super(tx, address, currentXem, xemDivisibility, store)

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), xemDivisibility) + defaultNetworkConfig.XEM,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
