import {Transaction, MultisigAccountInfo, SignedTransaction, CosignatureSignedTransaction, SimpleWallet} from 'nem2-sdk'
import {AppNamespace} from './AppNamespace'
import {AppMosaic} from './AppMosaic'
import {FormattedTransaction} from './FormattedTransaction'
import {ChainStatus, AppWallet, LockParams, Log, CurrentAccount} from '.'

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

export interface RemoteAccount {
    simpleWallet: SimpleWallet,
    publicKey: string,
}


export interface StoreAccount {
    node: string
    wallet: AppWallet
    mosaics: Record<string, AppMosaic>
    namespaces: AppNamespace[]
    addressAliasMap: any,
    generationHash: string
    transactionList: FormattedTransaction[]
    currentAccount: CurrentAccount
    activeMultisigAccount: string
    multisigAccountsMosaics: Record<string, Record<string, AppMosaic>>
    multisigAccountsNamespaces: Record<string, AppNamespace[]>
    multisigAccountsTransactions: Record<string, Transaction[]>
    multisigAccountInfo: Record<string, MultisigAccountInfo>
    transactionsToCosign: FormattedTransaction[],
    activeWalletAddress: string
    /**
     *  The network currency, to be used for fees management,
     *  formatting, defaulting...
     */
    networkCurrency: NetworkCurrency
    /**
     * This property is ONLY for mosaic list initialization purposes
     */
    networkMosaics: Record<string, AppMosaic>
}

export interface LoadingOverlayObject {
    show: boolean,
    message: string,
    networkMosaics?: Record<string, AppMosaic>,
    temporaryInfo?: any
}

export interface AppInfo {
    timeZone: number,
    locale: string,
    walletList: AppWallet[]
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
    stagedTransaction: StagedTransaction,
    nodeNetworkType: string,
    logs: Log[],
    loadingOverlay: LoadingOverlayObject,
    nodeLoading:boolean,
    explorerBasePath:string
}

export interface StagedTransaction {
    transactionToSign: Transaction
    lockParams: LockParams
    isAwaitingConfirmation: boolean
}

export interface SignTransaction {
    success: Boolean
    signedTransaction: SignedTransaction | CosignatureSignedTransaction
    signedLock?: SignedTransaction
    error: (String | null)
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

export enum ANNOUNCE_TYPES {
    NORMAL = 'NORMAL',
    AGGREGATE_BONDED = 'AGGREGATE_BONDED',
    AGGREGATE_COMPLETE = 'AGGREGATE_COMPLETE',
}

export enum MULTISIG_FORM_MODES {
    CONVERSION = 'CONVERSION',
    MODIFICATION = 'MODIFICATION',
}

export enum TRANSACTIONS_CATEGORIES {
    NORMAL = 'NORMAL',
    MULTISIG = 'MULTISIG',
    TO_COSIGN = 'TO_COSIGN',
}

export enum RECIPIENT_TYPES {
    ADDRESS = 'ADDRESS',
    ALIAS = 'ALIAS',
    PUBLIC_KEY = 'PUBLIC_KEY',
}

export enum BindTypes {
    ADDRESS = 'ADDRESS',
    MOSAIC = 'MOSAIC'
}

export enum AddOrRemove {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

export interface ValidationObject {
    valid: false | string
}

/**
 * These keys will be handled in a specific way by the transaction info template component
 */
export enum SpecialTxDetailsKeys {
    mosaics = 'mosaics',
    namespace = 'namespace',
    cosignatories = 'cosignatories',
    from = 'from',
    aims = 'aims',
    hash = 'hash',
    cosigned_by = 'cosigned_by',
}

export interface BlocksAndTime {
    blocks: number
    time: string
}

export interface NamespaceExpirationInfo {
    expired: boolean
    remainingBeforeExpiration: BlocksAndTime
    remainingBeforeDeletion: BlocksAndTime
}
