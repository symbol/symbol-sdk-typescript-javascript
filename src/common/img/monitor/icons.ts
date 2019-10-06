import {TransactionType} from 'nem2-sdk';
import dashboardAggregate from '@/common/img/monitor/dash-board/dashboardAggregate.png';
import dashboardMultisig from '@/common/img/monitor/dash-board/dashboardMultisig.png';
import dashboardOther from '@/common/img/monitor/dash-board/dashboardOther.png';
import transferSent from '@/common/img/monitor/dash-board/dashboardMosaicOut.png'
import transferReceived from '@/common/img/monitor/dash-board/dashboardMosaicIn.png'

export const transferIcons = {
    transferReceived,
    transferSent,
}

export const transactionTypeToIcon = {
    [TransactionType.REGISTER_NAMESPACE] : dashboardOther,
    [TransactionType.ADDRESS_ALIAS] : dashboardOther,
    [TransactionType.MOSAIC_ALIAS] : dashboardOther,
    [TransactionType.MOSAIC_DEFINITION] : dashboardOther,
    [TransactionType.MOSAIC_SUPPLY_CHANGE] : dashboardOther,
    [TransactionType.MODIFY_MULTISIG_ACCOUNT] : dashboardMultisig,
    [TransactionType.AGGREGATE_COMPLETE] : dashboardAggregate,
    [TransactionType.AGGREGATE_BONDED] : dashboardAggregate,
    [TransactionType.LOCK] : dashboardOther,
    [TransactionType.SECRET_LOCK] : dashboardOther,
    [TransactionType.SECRET_PROOF] : dashboardOther,
    [TransactionType.ACCOUNT_RESTRICTION_ADDRESS] : dashboardOther,
    [TransactionType.ACCOUNT_RESTRICTION_MOSAIC] : dashboardOther,
    [TransactionType.ACCOUNT_RESTRICTION_OPERATION] : dashboardOther,
    [TransactionType.LINK_ACCOUNT] : dashboardOther,
    [TransactionType.MOSAIC_ADDRESS_RESTRICTION] : dashboardOther,
    [TransactionType.MOSAIC_GLOBAL_RESTRICTION] : dashboardOther,
    [TransactionType.ACCOUNT_METADATA_TRANSACTION] : dashboardOther,
    [TransactionType.MOSAIC_METADATA_TRANSACTION] : dashboardOther,
    [TransactionType.NAMESPACE_METADATA_TRANSACTION] : dashboardOther,
}
