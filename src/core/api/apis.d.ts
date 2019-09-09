import {VoteQuery} from "@/core/query/voteQuery"

export declare namespace api {
    interface market {
        kline: (params: {
            symbol: string,
            period: string,
            size: string,
        }) => Promise<{
            rst: any;
        }>;

        detail: (params: {
            symbol: string
        }) => Promise<{
            rst: any;
        }>;

        trade: (params: {
            symbol: string,
            size: string,
        }) => Promise<{
            rst: any;
        }>;
    }

    interface blog {
        list: (params: {
            limit: string,
            offset: string,
            language: string,
        }) => Promise<{
            rst: any;
        }>;
        commentSave: (params: {
            cid: string
            comment: string
            address: string
            nickName: string
            gtmCreate: string
        }) => Promise<{
            rst: any;
        }>;
        commentList: (params: {
            cid: string,
            limit: string,
            offset: string,
        }) => Promise<{
            rst: any;
        }>;
    }

    interface vote {
        list: (params: {
            limit: string,
            offset: string,
        }) => Promise<{
            rst: any;
        }>;
        listData: (params: {
            voteid: string,   // vote id
            id?: string   // selection id
        }) => Promise<{
            rst: any;
        }>;
        saveVote: (params: {
            vote: VoteQuery
        }) => Promise<{
            rst: any;
        }>;
        addVote: (params: {
            address: string,
            voteId: string,
            voteDataIds: string[],
        }) => Promise<{
            rst: any;
        }>;

        userAlready: (params: {
            limit: string,   //1
            offset: string,    //0
            address: string,
            voteId?: string
        }) => Promise<{
            rst: any;
        }>;

    }
}
