import {Transaction, MultisigAccountInfo} from 'nem2-sdk';
import {AppNamespace} from './AppNamespace';
import {AppMosaic} from './AppMosaic';
import {FormattedTransaction} from './FormattedTransaction';
import {ChainStatus} from '.';

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

export interface StoreAccount {
    node: string,
    // @TODO: the currentXem should be renamed
    currentXem: string,
    currentXEM1: string,
    account: Account | any,
    wallet: any,
    mosaics: Record<string, AppMosaic>,
    namespaces: any[],
    errorTx: Array<any>,
    addressAliasMap: any,
    generationHash: string,
    xemDivisibility: number
    transactionList: FormattedTransaction[],
    accountName: string
    networkMosaic: AppMosaic,
    activeMultisigAccount: string,
    multisigAccountsMosaics: Record<string, Record<string, AppMosaic>>,
    multisigAccountsNamespaces: Record<string, AppNamespace[]>,
    multisigAccountsTransactions: Record<string, Transaction[]>,
    multisigAccountInfo: Record<string, MultisigAccountInfo>,
}

export interface AppInfo {
    timeZone: number,
    locale: string,
    currentPanelIndex: number,
    walletList: any[]
    hasWallet: boolean,
    isNodeHealthy: boolean,
    mnemonic: string,
    chainStatus: ChainStatus,
    mosaicsLoading: boolean,
    balanceLoading: boolean,
    transactionsLoading: boolean,
    xemUsdPrice: Number,
    namespaceLoading: boolean
    multisigLoading: boolean,
    isUiDisabled: boolean,
    uiDisabledMessage: string
}
