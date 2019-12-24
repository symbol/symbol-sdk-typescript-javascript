import {WebClient} from "@/core/utils/web.ts"
import {apiServerConfig} from "@/config/index.ts"
import {api} from "@/core/api/apis.d.ts"

export const market: api.market = {

    kline: async (params) => {
        const symbol = params.symbol
        const period = params.period
        const size = params.size

        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.marketUrl}/rest/market/kline/${symbol}/${period}/${size}/`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    detail: async (params) => {
        const symbol = params.symbol
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.marketUrl}/rest/market/detail/${symbol}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },

    trade: async (params) => {
        const symbol = params.symbol
        const size = params.size
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.marketUrl}/rest/market/trade/${symbol}/${size}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },

}

