import {FormattedTransaction} from '@/core/services/transactions'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Address, TransferTransaction} from 'nem2-sdk'

export class FormattedTransfer extends FormattedTransaction {
    infoFirst: string
    infoSecond: string
    infoThird: any
    dialogDetailMap: any

    constructor(    tx: TransferTransaction,
                    address: Address,
                    currentXem: string,
                    xemDivisibility: number) {
        super(tx, address, currentXem, xemDivisibility)

        const {rawTx}: any = this
        this.infoFirst = this.txHeader.isReceipt ? rawTx.signer.address.plain() : rawTx.recipient.address

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'from': this.infoFirst,
            'mosaic': rawTx.mosaics,
            'fee': getRelativeMosaicAmount(rawTx.maxFee.compact(), xemDivisibility) + 'XEM',
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'message': rawTx.message.payload
        }
    }
}

