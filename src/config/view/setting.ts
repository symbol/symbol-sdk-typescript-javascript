import { NetworkType } from "nem2-sdk";
import dashboardBlockHeight from "@/common/img/monitor/dash-board/dashboardBlockHeight.png";
import dashboardBlockTime from "@/common/img/monitor/dash-board/dashboardBlockTime.png";
import dashboardPointAmount from "@/common/img/monitor/dash-board/dashboardPointAmount.png";
import dashboardTransactionAmount from "@/common/img/monitor/dash-board/dashboardTransactionAmount.png";
import dashboardPublicKey from "@/common/img/monitor/dash-board/dashboardPublicKey.png";

export const settingNetworkColorConfig = ['green_point', 'pink_point', 'purple_point', 'yellow_point']

export const settingNetworkPointConfig: Array<{
    name: string,
    rpcUrl: string,
    chainId: number,
    symbol: string,
    exploerUrl: string,
    isSelected: boolean
}> = [
        {
            name: 'NEM_PRIVATE_1',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 1,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: true
        }, {
            name: 'NEM_MAIN',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 2,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: false
        },
        {
            name: 'NEM_MAIN_NET',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 2,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: false
        }
    ]

export const networkTypeConfig: Array<{
    value: NetworkType,
    label: string
}> = [
        {
            value: NetworkType.MIJIN_TEST,
            label: 'MIJIN_TEST'
        }, {
            value: NetworkType.MAIN_NET,
            label: 'MAIN_NET'
        }, {
            value: NetworkType.TEST_NET,
            label: 'TEST_NET'
        }, {
            value: NetworkType.MIJIN,
            label: 'MIJIN'
        },
    ]

export const networkStatusConfig: Array<{
    icon: string,
    descript: string,
    data: number,
    variable: string
}> = [
        {
            icon: dashboardBlockHeight,
            descript: 'block_height',
            data: 1978365,
            variable: 'currentHeight'

        }, {
            icon: dashboardBlockTime,
            descript: 'average_block_time',
            data: 12,
            variable: 'targetBlockTime'
        }, {
            icon: dashboardPointAmount,
            descript: 'point',
            data: 4,
            variable: 'nodeNumber'
        }, {
            icon: dashboardTransactionAmount,
            descript: 'number_of_transactions',
            data: 0,
            variable: 'numTransactions'
        }, {
            icon: dashboardPublicKey,
            descript: 'Harvester',
            data: 0,
            variable: 'signerPublicKey'
        }
    ]
