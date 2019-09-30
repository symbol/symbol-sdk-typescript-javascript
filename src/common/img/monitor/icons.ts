import {TransactionType} from 'nem2-sdk';
import dashboardAddressAlias from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardAggregate from '@/common/img/monitor/dash-board/dashboardAggregate.png';
import dashboardDefinition from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardFilter from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardLinkAccount from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardLock from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardModify from '@/common/img/monitor/dash-board/dashboardMultisig.png';
import dashboardMosaicAlias from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardNamespace from '@/common/img/monitor/dash-board/dashboardOther.png';
import dashboardSecret from '@/common/img/monitor/dash-board/dashboardMosaicOut.png';
import transferSent from '@/common/img/monitor/dash-board/dashboardMosaicOut.png'
import transferReceived from '@/common/img/monitor/dash-board/dashboardMosaicIn.png'

export const transferIcons = {
    transferReceived,
    transferSent,
}

export const transactionTypeToIcon = {
    [TransactionType.REGISTER_NAMESPACE] : dashboardNamespace,
    [TransactionType.ADDRESS_ALIAS] : dashboardAddressAlias,
    [TransactionType.MOSAIC_ALIAS] : dashboardMosaicAlias,
    [TransactionType.MOSAIC_DEFINITION] : dashboardDefinition,
    [TransactionType.MOSAIC_SUPPLY_CHANGE] : dashboardModify,
    [TransactionType.MODIFY_MULTISIG_ACCOUNT] : dashboardModify,
    [TransactionType.AGGREGATE_COMPLETE] : dashboardAggregate,
    [TransactionType.AGGREGATE_BONDED] : dashboardAggregate,
    [TransactionType.LOCK] : dashboardLock,
    [TransactionType.SECRET_LOCK] : dashboardSecret,
    [TransactionType.SECRET_PROOF] : dashboardSecret,
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS] : dashboardFilter,
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC] : dashboardFilter,
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION] : dashboardFilter,
    [TransactionType.LINK_ACCOUNT] : dashboardLinkAccount,
}
