import {Endpoint} from '@/core/model'

export const nodeListConfig: Endpoint[] = [
    {
        value: 'http://api-01.mt.ap-northeast-1.nemtech.network:3000',
        name: 'northeast',
        url: 'api-01.mt.ap-northeast-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.mt.ap-southeast-1.nemtech.network:3000',
        name: 'southeast',
        url: 'api-01.mt.ap-southeast-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.mt.eu-central-1.nemtech.network:3000',
        name: 'central',
        url: 'api-01.mt.eu-central-1.nemtech.network',
        isSelected: true,
    },
    {
        value: 'http://api-01.mt.us-east-1.nemtech.network:3000',
        name: 'east',
        url: 'api-01.mt.us-east-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.mt.us-west-2.nemtech.network:3000',
        name: 'west',
        url: 'api-01.mt.us-west-2.nemtech.network',
        isSelected: false,
    },

    // test net node
    {
        value: 'http://api-01.ap-northeast-1.nemtech.network:3000',
        name: 'ap-northeast-1',
        url: 'api-01.ap-northeast-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.ap-southeast-1.nemtech.network:3000',
        name: 'ap-southeast-1',
        url: 'api-01.ap-southeast-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.eu-central-1.nemtech.network:3000',
        name: 'eu-central-1',
        url: 'api-01.eu-central-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.eu-west-1.nemtech.network:3000',
        name: 'eu-west-1',
        url: 'api-01.eu-west-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.us-east-1.nemtech.network:3000',
        name: 'us-east-1',
        url: 'api-01.us-east-1.nemtech.network',
        isSelected: false,
    },
    {
        value: 'http://api-01.us-west-2.nemtech.network:3000',
        name: 'us-west-2',
        url: 'api-01.us-west-2.nemtech.network',
        isSelected: false,
    },
]

export const explorerUrlHead = 'http://explorer.mt.nemtech.network/transaction/'
