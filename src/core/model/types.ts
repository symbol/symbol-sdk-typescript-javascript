import {
  Transaction, MultisigAccountInfo, SignedTransaction,
  CosignatureSignedTransaction, SimpleWallet, NetworkType,
} from 'nem2-sdk'
import {AppNamespace} from './AppNamespace'
import {AppMosaic} from './AppMosaic'
import {FormattedTransaction} from './FormattedTransaction'
import {NetworkProperties, AppWallet, LockParams, Log, CurrentAccount} from '.'
import {TransactionFormatter} from '../services'
import {Listeners} from './Listeners'
import {NetworkManager} from './NetworkManager'

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
  hex: string
  divisibility: number
  ticker: string
  name: string
}

export interface RemoteAccount {
  simpleWallet: SimpleWallet
  publicKey: string
}

export interface TemporaryLoginInfo {
  password: string
  mnemonic: string
}

export type Balances = Record<string, number>

export interface StoreAccount {
  activeMultisigAccount: string
  balances: Record<string, Balances>
  currentAccount: CurrentAccount
  mosaics: Record<string, AppMosaic>
  multisigAccountInfo: Record<string, MultisigAccountInfo>
  multisigAccountsMosaics: Record<string, Record<string, AppMosaic>>
  multisigAccountsNamespaces: Record<string, AppNamespace[]>
  multisigAccountsTransactions: Record<string, Transaction[]>
  namespaces: AppNamespace[]
  networkCurrency: NetworkCurrency
  networkMosaics: Record<string, AppMosaic>
  node: string
  temporaryLoginInfo: TemporaryLoginInfo
  transactionList: FormattedTransaction[]
  transactionsToCosign: FormattedTransaction[]
  wallet: AppWallet
}

export interface LoadingOverlayObject {
  show: boolean
  message: string
  networkMosaics?: Record<string, AppMosaic>
}

export interface AppInfo {
  _ENABLE_TREZOR_: boolean
  explorerBasePath: string
  isUiDisabled: boolean
  listeners: Listeners
  loadingOverlay: LoadingOverlayObject
  locale: string
  logs: Log[]
  mnemonic: string
  mosaicsLoading: boolean
  multisigLoading: boolean
  namespaceLoading: boolean
  networkManager: NetworkManager
  networkProperties: NetworkProperties
  nodeList: Endpoint[]
  stagedTransaction: StagedTransaction
  timeZone: number
  transactionFormatter: TransactionFormatter
  transactionsLoading: boolean
  uiDisabledMessage: string
  walletList: AppWallet[]
  xemUsdPrice: number
}

export interface StagedTransaction {
  transactionToSign: Transaction
  lockParams: LockParams
  isAwaitingConfirmation: boolean
}

export interface RemoteAccount {
  simpleWallet: SimpleWallet
  publicKey: string
}

export interface SignTransaction {
  success: boolean
  signedTransaction: SignedTransaction | CosignatureSignedTransaction
  signedLock?: SignedTransaction
  error: (string | null)
}

export interface AppState {
  app: AppInfo
  account: StoreAccount
}

export interface DefaultFee {
  speed: string
  value: number
}

export interface Endpoint {
  value: string
  name: string
  url: string
  networkType: NetworkType
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

export enum TransactionCategories {
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


export enum TransactionStatusGroups {
  'confirmed' = 'confirmed',
  'unconfirmed' = 'unconfirmed',
}

export interface TransactionFormatterOptions {
  transactionStatusGroup?: TransactionStatusGroups
  transactionCategory?: TransactionCategories
}

export enum NoticeType {
  success = 'success',
  error = 'error',
  warning = 'warning',
}
