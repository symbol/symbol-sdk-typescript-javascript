import {transactionTag} from '@/config/index.ts'
import {formatNemDeadline} from "@/core/utils/utils.ts"
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

const formatAggregateCompelete = (innerTransactionList: Array<any>, accountAddress: string) => {
    innerTransactionList = innerTransactionList.map((item) => {
        const type = item.type
        switch (type) {
            case TransactionType.TRANSFER:
                item.isReceipt = item.recipient.address == accountAddress
                item.tag = item.isReceipt ? transactionTag.GATHERING : transactionTag.PAYMENT
                item.time = formatNemDeadline(item.deadline)
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                    'message': item.message.payload
                }
                break
            case TransactionType.REGISTER_NAMESPACE:
                item.tag = transactionTag.REGIST_NAMESPACE
                item.icon = iconMap.dashboardNamespace
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'space_name': item.namespaceName + ' (' + (item.namespaceType ? 'sub' : 'root') + ')',
                    'root_namespace': item.parentId ? item.parentId.id.toHex() : '-',
                    'sender': item.signer.publicKey,
                    'duration': item.duration ? item.duration.compact() : 0,
                    'rent': (item.duration ? item.duration.compact() : '0') * 0.00005 + ' XEM',
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.ADDRESS_ALIAS:
                item.icon = iconMap.dashboardAddressAlias
                item.tag = transactionTag.ADDRESS_ALIAS
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
            case TransactionType.MOSAIC_ALIAS:
                item.icon = iconMap.dashboardMosaicAlias
                item.tag = transactionTag.MOSAIC_ALIAS
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.MOSAIC_DEFINITION:
                item.icon = iconMap.dashboardModify
                item.tag = transactionTag.MOSAIC_DEFINITION
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                item.icon = iconMap.dashboardDefinition
                item.tag = transactionTag.MOSAIC_SUPPLY_CHANGE
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }

                break
            case TransactionType.MODIFY_MULTISIG_ACCOUNT:
                item.icon = iconMap.dashboardModify
                item.tag = transactionTag.MODIFY_MULTISIG_ACCOUNT
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            // case TransactionType.AGGREGATE_COMPLETE:
            //     const innerTransactionList = item.innerTransactions
            //     item.formatAggregateCompelete = formatAggregateCompelete(innerTransactionList)
            //     item.icon = iconMap.dashboardAggregate
            //     item.tag = transactionTag.AGGREGATE_COMPLETE
            //     item.dialogDetailMap = {
            //         'transfer_type': item.tag,
            //         'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
            //         'block': item.transactionInfo.height.compact(),
            //         'aggregate_hash': item.transactionInfo.hash,
            //     }
            //     break;
            case TransactionType.AGGREGATE_BONDED:
                item.icon = iconMap.dashboardAggregate
                item.tag = transactionTag.AGGREGATE_BONDED
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.LOCK:
                item.tag = transactionTag.LOCK
                item.icon = iconMap.dashboardLock
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'mosaic_ID': 'nem.xem' + `(${item.mosaic.id.toHex()})`,
                    'quantity': item.mosaic.amount.compact(),
                    'timestamp': item.time,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.SECRET_LOCK:
                item.tag = transactionTag.SECRET_LOCK
                item.icon = iconMap.dashboardSecret
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.SECRET_PROOF:
                item.icon = iconMap.dashboardSecret
                item.tag = transactionTag.SECRET_PROOF
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                item.icon = iconMap.dashboardFilter
                item.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ADDRESS
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                item.icon = iconMap.dashboardFilter
                item.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_MOSAIC
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                item.icon = iconMap.dashboardFilter
                item.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
            case TransactionType.LINK_ACCOUNT:
                item.icon = iconMap.dashboardLinkAccount
                item.tag = transactionTag.LINK_ACCOUNT
                item.dialogDetailMap = {
                    'transfer_type': item.tag,
                    'fee': item.maxFee.compact() * 0.0000001 + ' XEM',
                    'block': item.transactionInfo.height.compact(),
                    'aggregate_hash': item.transactionInfo.aggregateHash,
                }
                break
        }
        return item
    })
    return innerTransactionList
}


const formatTransferTransactions = function (transaction, accountAddress, currentXEM) {
    transaction.isReceipt = transaction.recipient.address == accountAddress
    transaction.tag = transaction.isReceipt ? transactionTag.GATHERING : transactionTag.PAYMENT
    transaction.infoFirst = transaction.isReceipt ? transaction.signer.address.address : transaction.recipient.address
    transaction.infoSecond = transaction.mosaics && transaction.mosaics[0] && currentXEM.toUpperCase() !== transaction.mosaics[0].id.id.toHex().toUpperCase() ?
        transaction.mosaics.map(item => {
            const hex = item.id.id.toHex()
            if (hex == currentXEM) {
                return 'nem.xem'
            }
            return item.id.id.toHex()
        }).join(',') : 'nem.xem'

    const mosaic = transaction.mosaics.map(item => {
        const hex = item.id.id.toHex()
        if (hex == currentXEM) {
            return 'nem.xem' + `(${item.amount.compact()})`
        }
        return item.id.id.toHex() + `(${item.amount.compact()})`
    }).join(',')

    transaction.infoThird = transaction.mosaics.length <= 1 ? (transaction.isReceipt ? '+' : '-') + (transaction.mosaics && transaction.mosaics[0] ? transaction.mosaics[0].amount.compact() : '0') : 'mix'
    transaction.time = formatNemDeadline(transaction.deadline)
    transaction.dialogDetailMap = {
        'transfer_type': transaction.tag,
        'from': transaction.infoFirst,
        'mosaic': mosaic,
        'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
        'block': transaction.transactionInfo.height.compact(),
        'hash': transaction.transactionInfo.hash,
        'message': transaction.message.payload
    }
    return transaction
}


function formatOtherTransaction(transaction: any, accountAddress: string) {
    const {type} = transaction
    transaction.time = formatNemDeadline(transaction.deadline)
    transaction.isReceipt = false
    transaction.infoSecond = transaction.maxFee.compact()
    transaction.infoThird = transaction.transactionInfo.height.compact()
    switch (type) {
        case TransactionType.REGISTER_NAMESPACE:
            transaction.tag = transactionTag.REGIST_NAMESPACE
            transaction.icon = iconMap.dashboardNamespace
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'space_name': transaction.namespaceName + ' (' + (transaction.namespaceType ? 'sub' : 'root') + ')',
                'root_namespace': transaction.parentId ? transaction.parentId.id.toHex() : '-',
                'sender': transaction.signer.publicKey,
                'duration': transaction.duration ? transaction.duration.compact() : 0,
                'rent': (transaction.duration ? transaction.duration.compact() : '0') * 0.00005 + ' XEM',
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.ADDRESS_ALIAS:
            transaction.icon = iconMap.dashboardAddressAlias
            transaction.tag = transactionTag.ADDRESS_ALIAS
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
        case TransactionType.MOSAIC_ALIAS:
            transaction.icon = iconMap.dashboardMosaicAlias
            transaction.tag = transactionTag.MOSAIC_ALIAS
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.MOSAIC_DEFINITION:
            transaction.icon = iconMap.dashboardModify
            transaction.tag = transactionTag.MOSAIC_DEFINITION
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.MOSAIC_SUPPLY_CHANGE:
            transaction.icon = iconMap.dashboardDefinition
            transaction.tag = transactionTag.MOSAIC_SUPPLY_CHANGE
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }

            break
        case TransactionType.MODIFY_MULTISIG_ACCOUNT:
            transaction.icon = iconMap.dashboardModify
            transaction.tag = transactionTag.MODIFY_MULTISIG_ACCOUNT
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.AGGREGATE_COMPLETE:
            const innerTransactionList = transaction.innerTransactions
            transaction.formatAggregateCompelete = formatAggregateCompelete(innerTransactionList, accountAddress)
            transaction.icon = iconMap.dashboardAggregate
            transaction.tag = transactionTag.AGGREGATE_COMPLETE
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.AGGREGATE_BONDED:
            transaction.icon = iconMap.dashboardAggregate
            transaction.tag = transactionTag.AGGREGATE_BONDED
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.LOCK:
            transaction.tag = transactionTag.LOCK
            transaction.icon = iconMap.dashboardLock
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'mosaic_ID': 'nem.xem' + `(${transaction.mosaic.id.toHex()})`,
                'quantity': transaction.mosaic.amount.compact(),
                'timestamp': transaction.time,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.SECRET_LOCK:
            transaction.tag = transactionTag.SECRET_LOCK
            transaction.icon = iconMap.dashboardSecret
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.SECRET_PROOF:
            transaction.icon = iconMap.dashboardSecret
            transaction.tag = transactionTag.SECRET_PROOF
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ADDRESS
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_MOSAIC
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
            transaction.icon = iconMap.dashboardFilter
            transaction.tag = transactionTag.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
        case TransactionType.LINK_ACCOUNT:
            transaction.icon = iconMap.dashboardLinkAccount
            transaction.tag = transactionTag.LINK_ACCOUNT
            transaction.dialogDetailMap = {
                'transfer_type': transaction.tag,
                'fee': transaction.maxFee.compact() * 0.0000001 + ' XEM',
                'block': transaction.transactionInfo.height.compact(),
                'hash': transaction.transactionInfo.hash,
            }
            break
    }
    return transaction
}


export const transactionFormat = (transactionList: Array<Transaction>, accountAddress: string, currentXEM: string, namespaceList?: Array<any>) => {
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

