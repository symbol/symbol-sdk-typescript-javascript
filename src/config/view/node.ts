import {Endpoint} from '@/core/model'

export const nodeListConfig: Endpoint[] = [
    {
        value: 'http://47.107.245.217:3000',
        name: 'cn',
        url: 'http://47.107.245.217:3000',
        isSelected: true,
    },
    {
        value: 'http://jp5.nemesis.land:3000',
        name: 'jp5',
        url: 'http://jp5.nemesis.land:3000',
        isSelected: false,
    },
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
        isSelected: false,
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
]