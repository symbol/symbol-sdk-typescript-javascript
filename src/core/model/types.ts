import {Transaction, MultisigAccountInfo} from 'nem2-sdk'
import {AppNamespace} from './AppNamespace'
import {AppMosaic} from './AppMosaic'
import {FormattedTransaction} from './FormattedTransaction'
import {ChainStatus, AppWallet} from '.'

export interface AddressAndTransaction {
    address: string
    transaction: Transaction
}

export interface AddressAndNamespaces {
    address: string
    namespaces: AppNamespace[]
}

export interface AddressAndMosaics {
    address: string
    mosaics: AppMosaic[]
}

export interface AddressAndMultisigInfo {
    address: string
    multisigAccountInfo: MultisigAccountInfo
}

export interface NetworkCurrency {
    hex: string,
    divisibility: number,
    ticker: string,
    name: string,
}

export interface StoreAccount {
    node: string,
    account: Account | any,
    wallet: AppWallet,
    mosaics: Record<string, AppMosaic>,
    namespaces: AppNamespace[],
    errorTx: Array<any>,
    addressAliasMap: any,
    generationHash: string,
    transactionList: FormattedTransaction[],
    accountName: string
    activeMultisigAccount: string,
    multisigAccountsMosaics: Record<string, Record<string, AppMosaic>>,
    multisigAccountsNamespaces: Record<string, AppNamespace[]>,
    multisigAccountsTransactions: Record<string, Transaction[]>,
    multisigAccountInfo: Record<string, MultisigAccountInfo>,
    activeWalletAddress: string
    /**
     *  The network currency, to be used for fees management,
     *  formatting, defaulting...
     */
    networkCurrency: NetworkCurrency,
    /**
     * This property is ONLY for mosaic list initialization purposes
     */
    networkMosaics: Record<string, AppMosaic>,
}

export interface AppInfo {
    timeZone: number,
    locale: string,
    walletList: AppWallet[]
    hasWallet: boolean,
    isNodeHealthy: boolean,
    mnemonic: string,
    chainStatus: ChainStatus,
    mosaicsLoading: boolean,
    transactionsLoading: boolean,
    xemUsdPrice: Number,
    namespaceLoading: boolean
    multisigLoading: boolean,
    isUiDisabled: boolean,
    uiDisabledMessage: string,
    _ENABLE_TREZOR_: boolean,
}

export interface AppState {
    app: AppInfo,
    account: StoreAccount,
}

export interface DefaultFee {
    speed: string,
    value: number,
}

export interface Endpoint {
    value: string,
    name: string,
    url: string,
    isSelected: boolean
}

/**
 * These keys will be handled in a specific way by the transaction detail modal component
 */
export enum SpecialTxDetailsKeys {
    mosaics = 'mosaics',
    namespace = 'namespace',
    cosignatories = 'cosignatories',
    from = 'from',
    aims = 'aims',
}

export enum TxDetailsKeysWithValueToTranslate {
    action = 'action',
    direction = 'direction',
}
