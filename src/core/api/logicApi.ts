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

export const blog: api.blog = {

    commentList: async (params) => {
        const cid = params.cid
        const limit = params.limit
        const offset = params.offset

        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.apiUrl}/rest/blog/comment/list?cid=${cid}&limit=${limit}&offset=${offset}`,
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
        const cid = params.cid
        const address = params.address
        const comment = params.comment
        const gtmCreate = params.gtmCreate
        const nickName = params.nickName

        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.apiUrl}/rest/blog/comment/save?cid=${cid}&comment=${comment}&address=${address}&nickName=${nickName}&gtmCreate=${gtmCreate}`,
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
        const offset = params.offset
        const limit = params.limit
        const language = params.language

        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.apiUrl}/rest/blog/list?limit=${limit}&offset=${offset}&language=${language}`,
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


export const vote: api.vote = {
    list: async (params) => {
        const limit = params.limit
        const offset = params.offset
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.voteUrl}/rest/vote/list?&limit=${limit}&offset=${offset}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    listData: async (params) => {
        const voteid = params.voteid
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.voteUrl}/rest/vote/list/data?&voteid=${voteid}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    saveVote: async (params) => {
        const vote = params.vote
        let {title, address, initiator, content, type, voteDataDOList, endtime, starttime} = vote
        const list = voteDataDOList.map(item => {
            return JSON.stringify(item)
        })
        const resStr = await WebClient.request(JSON.stringify(vote), {
            url: `${apiServerConfig.voteUrl}/rest/vote/save?title=${title}&address=${address}&initiator=${initiator}&content=${content}&type=${type}&endtime=${endtime}&starttime=${starttime}&voteData=${list}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream;charset=UTF-8'
            }
        })
        return {
            rst: resStr
        }
    },
    addVote: async (params) => {
        const address = params.address
        const voteId = params.voteId
        const voteDataIds = params.voteDataIds
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.voteUrl}/rest/vote/add/${address}/${voteId}/${voteDataIds}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return {
            rst: resStr
        }
    },
    userAlready: async (params) => {
        const limit = params.limit
        const offset = params.offset
        const address = params.address
        const resStr = await WebClient.request('', {
            url: `${apiServerConfig.voteUrl}/rest/vote/list/user?&limit=${limit}&offset=${offset}&address=${address}`,
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
