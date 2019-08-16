import {transactionTag} from '@/config'
import {formatNemDeadline} from "@/core/utils/utils"
import {Transaction, TransactionType} from 'nem2-sdk'

import dashboardAddressAlias from '@/common/img/monitor/dash-board/dashboardAddressAlias.png'
import dashboardAggregate from '@/common/img/monitor/dash-board/dashboardAggregate.png'
import dashboardDefinition from '@/common/img/monitor/dash-board/dashboardDefinition.png'
import dashboardFilter from '@/common/img/monitor/dash-board/dashboardFilter.png'
import dashboardLinkAccount from '@/common/img/monitor/dash-board/dashboardLinkAccount.png'
import dashboardLock from '@/common/img/monitor/dash-board/dashboardLock.png'
import dashboardModify from '@/common/img/monitor/dash-board/dashboardModify.png'
import dashboardMosaicAlias from '@/common/img/monitor/dash-board/dashboardMosaicAlias.png'
import dashboardNamespace from '@/common/img/monitor/dash-board/dashboardNamespace.png'
import dashboardSecret from '@/common/img/monitor/dash-board/dashboardSecret.png'

const iconMap = {
    dashboardAddressAlias,
    dashboardAggregate,
    dashboardDefinition,
    dashboardFilter,
    dashboardLinkAccount,
    dashboardLock,
    dashboardModify,
    dashboardMosaicAlias,
    dashboardNamespace,
    dashboardSecret
}


const formatTransferTransactions = function (transaction, accountAddress, currentXEM) {
    transaction.isReceipt = transaction.recipient.address == accountAddress
    transaction.tag = transaction.isReceipt ? transactionTag.GATHERING : transactionTag.PAYMENT
    transaction.infoFirst = transaction.isReceipt ? transaction.signer.address.address : transaction.recipient.address;
    transaction.infoSecond = transaction.mosaics && transaction.mosaics[0] && currentXEM.toUpperCase() !== transaction.mosaics[0].id.id.toHex().toUpperCase() ? transaction.mosaics[0].id.id.toHex().toUpperCase() : 'nem.xem';
    transaction.infoThird = (transaction.isReceipt ? '+' : '-') + (transaction.mosaics && transaction.mosaics[0] ? transaction.mosaics[0].amount.compact() : '0')
    transaction.time = formatNemDeadline(transaction.deadline);
    transaction.dialogDetailMap = {
        'transfer_type': transaction.tag,
        'from': transaction.infoFirst,
        'mosaic': transaction.infoSecond,
        'the_amount': transaction.infoThird,
        'fee': transaction.maxFee.compact(),
        'block': transaction.transactionInfo.height.compact(),
        'hash': transaction.transactionInfo.hash,
        'message': transaction.message.payload
    }
    return transaction
};


function formatOtherTransaction(transaction: any, accountAddress: string) {
    const {type} = transaction
    transaction.time = formatNemDeadline(transaction.deadline);
    transaction.isReceipt = false
    transaction.infoSecond = transaction.maxFee.compact()
    transaction.infoThird = transaction.transactionInfo.height.compact()
    switch (type) {
        case TransactionType.REGISTER_NAMESPACE:
            transaction.tag = transactionTag.REGIST_NAMESPACE
            transaction.icon = iconMap.dashboardNamespace
            // transaction.infoFirst = transaction.tag;
            // transaction.infoSecond =  transaction.maxFee.compact()
            // transaction.infoThird = transaction.transactionInfo.height.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.ADDRESS_ALIAS:
            transaction.icon = iconMap.dashboardAddressAlias
            transaction.tag = transactionTag.ADDRESS_ALIAS
            // transaction.infoFirst = transaction.actionType;
            // transaction.infoSecond = transaction.namespaceId
            // transaction.infoThird = transaction.address
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }

        case TransactionType.MOSAIC_ALIAS:
            transaction.icon = iconMap.dashboardMosaicAlias
            transaction.tag = transactionTag.MOSAIC_ALIAS
            // transaction.infoFirst = transaction.transactionInfo.hash
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MOSAIC_DEFINITION:
            transaction.icon = iconMap.dashboardModify
            transaction.tag = transactionTag.MOSAIC_DEFINITION
            // transaction.infoFirst = transaction.MosaicId.id.toHex();
            // transaction.infoSecond = transaction.mosaicProperties.supplyMutable
            // transaction.infoThird = transaction.mosaicProperties.duration
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            transaction.icon = iconMap.dashboardModify
            transaction.tag = transactionTag.MOSAIC_SUPPLY_CHANGE
            // transaction.infoFirst = transaction.MosaicId.id.toHex();
            // transaction.infoSecond = transaction.direction
            // transaction.infoThird = transaction.delta.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }

            break;
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            transaction.icon = iconMap.dashboardModify
            transaction.tag = transactionTag.MODIFY_MULTISIG_ACCOUNT
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.AGGREGATE_COMPLETE:
            transaction.icon = iconMap.dashboardAggregate
            transaction.tag = transactionTag.AGGREGATE_COMPLETE
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.AGGREGATE_BONDED:
            transaction.icon = iconMap.dashboardAggregate
            transaction.tag = transactionTag.AGGREGATE_BONDED
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.LOCK:
            transaction.tag = transactionTag.LOCK
            transaction.icon = iconMap.dashboardLock
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.SECRET_LOCK:
            transaction.tag = transactionTag.SECRET_LOCK
            transaction.icon = iconMap.dashboardSecret
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;

        case TransactionType.SECRET_PROOF:
            transaction.icon = iconMap.dashboardSecret
            transaction.tag = transactionTag.SECRET_PROOF
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ADDRESS
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_MOSAIC
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact(),
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break;
        case TransactionType.LINK_ACCOUNT:
            transaction.icon = iconMap.dashboardLinkAccount
            transaction.tag = transactionTag.LINK_ACCOUNT
            // transaction.infoFirst = transaction.transactionInfo.hash;
            // transaction.infoSecond = transaction.transactionInfo.height.compact()
            // transaction.infoThird = '-' + transaction.maxFee.compact()
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


export const transactionFormat = (transactionList: Array<Transaction>, accountAddress: string, currentXEM: string) => {
    const transferTransactionList = []
    const receiptList = []
    transactionList.forEach((item) => {
        if (item.type !== TransactionType.TRANSFER) {
            item = formatOtherTransaction(item, accountAddress)
            receiptList.push(item)
            return
        }
        item = formatTransferTransactions(item, accountAddress, currentXEM)
        transferTransactionList.push(item)
    })
    const result = {
        transferTransactionList,
        receiptList
    }
    return result
}

