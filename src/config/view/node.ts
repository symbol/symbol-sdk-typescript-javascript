import {Endpoint} from '@/core/model'
import {NetworkType} from "nem2-sdk"

export const nodeListConfig: Endpoint[] = [
    {
        value: 'http://api-harvest-20.ap-northeast-1.nemtech.network:3000',
        name: 'ap-northeast-1',
        url: 'api-harvest-20.ap-northeast-1.nemtech.network',
        isSelected: true,
    },
    {
        value: 'http://api-harvest-20.ap-southeast-1.nemtech.network:3000',
        name: 'ap-southeast-1',
        url: 'api-harvest-20.ap-southeast-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-harvest-20.eu-west-1.nemtech.network:3000',
        name: 'eu-west-1',
        url: 'api-harvest-20.eu-west-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-harvest-20.us-west-1.nemtech.network:3000',
        name: 'us-west-1',
        url: 'api-harvest-20.us-west-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-20.us-west-1.nemtech.network:3000',
        name: 'us-west-1',
        url: 'api-20.us-west-1.nemtech.network',
        isSelected: false,
    },
]

export const explorerUrlHead = 'http://explorer.nemtech.network/transaction/'
export const explorerLinkList = [
    {
        explorerBasePath: 'http://explorer.nemtech.network/transaction/',
        networkType: NetworkType.TEST_NET
    },
    {
        explorerBasePath: 'http://explorer.mt.nemtech.network/transaction/',
        networkType: NetworkType.MIJIN_TEST
    }
]
