import {transactionTag} from '@/config'
import {formatNemDeadline} from "@/core/utils/utils"
import {MosaicId, Transaction, TransactionType, UInt64} from 'nem2-sdk'

function formatTx(transaction: any, accountAddress: string) {
    const {type} = transaction
    transaction.time = formatNemDeadline(transaction.deadline);
    transaction.isReceipt = false

    switch (type) {
        case TransactionType.TRANSFER:
            transaction.isReceipt = transaction.recipient.address == accountAddress ? true : false
            transaction.tag = transaction.isReceipt ? transactionTag.GATHERING : transactionTag.PAYMENT
            transaction.infoFirst = transaction.isReceipt ? transaction.signer.address.address : transaction.recipient.address;
            transaction.infoThird = (transaction.isReceipt ? '+' : '-') + (transaction.mosaics ? transaction.mosaics[0].amount.compact() : '')
            transaction.infoSecond = transaction.mosaics ? transaction.mosaics[0].id.id.toHex().toUpperCase() : 'null';
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'from': transaction.infoFirst,
                'mosaic': transaction.infoThird,
                'the_amount': transaction.infoSecond,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
                'message': transaction.message.payload
            }
            break;

        case TransactionType.REGISTER_NAMESPACE:
            transaction.tag = transactionTag.REGIST_NAMESPACE
            transaction.infoFirst = transaction.namespaceName;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.ADDRESS_ALIAS:
            transaction.tag = transactionTag.ADDRESS_ALIAS
            transaction.infoFirst = transaction.actionType;
            transaction.infoSecond = transaction.namespaceId
            transaction.infoThird = transaction.address
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }

        case TransactionType.MOSAIC_ALIAS:
            transaction.tag = transactionTag.MOSAIC_ALIAS
            transaction.infoFirst = transaction.transactionInfo.hash
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MOSAIC_DEFINITION:
            transaction.tag = transactionTag.MOSAIC_DEFINITION
            transaction.infoFirst = transaction.MosaicId.id.toHex();
            transaction.infoSecond = transaction.mosaicProperties.supplyMutable
            transaction.infoThird = transaction.mosaicProperties.duration
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            transaction.tag = transactionTag.MOSAIC_DEFINITION
            break;

        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            transaction.tag = transactionTag.MOSAIC_SUPPLY_CHANGE
            transaction.infoFirst = transaction.MosaicId.id.toHex();
            transaction.infoSecond = transaction.direction
            transaction.infoThird = transaction.delta.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }

            break;
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            transaction.tag = transactionTag.MODIFY_MULTISIG_ACCOUNT
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.AGGREGATE_COMPLETE:
            transaction.tag = transactionTag.AGGREGATE_COMPLETE
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.AGGREGATE_BONDED:
            transaction.tag = transactionTag.AGGREGATE_BONDED
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.LOCK:
            transaction.tag = transactionTag.LOCK
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.SECRET_LOCK:
            transaction.tag = transactionTag.SECRET_LOCK
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.SECRET_PROOF:
            transaction.tag = transactionTag.SECRET_PROOF
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ADDRESS
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_MOSAIC
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.LINK_ACCOUNT:
            transaction.tag = transactionTag.LINK_ACCOUNT
            transaction.infoFirst = transaction.transactionInfo.hash;
            transaction.infoSecond = transaction.transactionInfo.height.compact()
            transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
    }
    return transaction
}


export const transactionFormat = (transactionList: Array<Transaction>, accountAddress: string) => {
    transactionList = transactionList.map((item) => {
        item = formatTx(item, accountAddress)
        return item
    })
    return transactionList
}

