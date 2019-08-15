import {WebClient} from "@/core/utils/web"
import {AppConfig} from "@/config"
import {api} from "@/core/api/apis";

export const market: api.market = {

    kline: async (params) => {
        const symbol = params.symbol;
        const period = params.period;
        const size = params.size;

        const resStr = await WebClient.request('', {
            url: `${AppConfig.marketUrl}/rest/market/kline/${symbol}/${period}/${size}/`,
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
        const symbol = params.symbol;
        const resStr = await WebClient.request('', {
            url: `${AppConfig.marketUrl}/rest/market/detail/${symbol}`,
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
        const symbol = params.symbol;
        const size = params.size;
        const resStr = await WebClient.request('', {
            url: `${AppConfig.marketUrl}/rest/market/trade/${symbol}/${size}`,
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

export const blog: api.blog = {

    commentList: async (params) => {
        const cid = params.cid;
        const limit = params.limit;
        const offset = params.offset;

        const resStr = await WebClient.request('', {
            url: `${AppConfig.apiUrl}/rest/blog/comment/list?cid=${cid}&limit=${limit}&offset=${offset}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    commentSave: async (params) => {
        const cid = params.cid;
        const address = params.address;
        const comment = params.comment;
        const gtmCreate = params.gtmCreate;
        const nickName = params.nickName;

        const resStr = await WebClient.request('', {
            url: `${AppConfig.apiUrl}/rest/blog/comment/save?cid=${cid}&comment=${comment}&address=${address}&nickName=${nickName}&gtmCreate=${gtmCreate}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    list: async (params) => {
        const offset = params.offset;
        const limit = params.limit;
        const language = params.language;

        const resStr = await WebClient.request('', {
            url: `${AppConfig.apiUrl}/rest/blog/list?limit=${limit}&offset=${offset}&language=${language}`,
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
