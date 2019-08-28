import {
    Account,
    Address,
    AliasActionType,
    Deadline,
    MosaicId,
    NamespaceId,
    NetworkType,
    Password,
    PublicAccount,
    SignedTransaction,
    MultisigAccountInfo,

    Listener,
    MosaicSupplyChangeTransaction,
    AggregateTransaction,
    PropertyType,
    ModifyAccountPropertyAddressTransaction,
    AccountPropertyModification,
    ModifyAccountPropertyMosaicTransaction, ModifyAccountPropertyEntityTypeTransaction
} from 'nem2-sdk'
import {SimpleWallet} from "nem2-sdk";
import {Transaction} from "nem2-sdk";
import {UInt64} from "nem2-sdk";

declare namespace api {
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

}
