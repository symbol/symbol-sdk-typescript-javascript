import {AppInfo, ChainStatus} from '@/core/model'
import {localRead} from "@/core/utils";
import {Transaction} from 'nem2-sdk';
import {MutationTree} from 'vuex';

const state: AppInfo = {
    timeZone: new Date().getTimezoneOffset() / 60,   // current time zone
    locale: 'en-US',
    walletList: [],
    isNodeHealthy: true,
    mnemonic: '',
    chainStatus: ChainStatus.getDefault(),
    mosaicsLoading: true,
    transactionsLoading: false,
    namespaceLoading: true,
    xemUsdPrice: 0,
    multisigLoading: true,
    _ENABLE_TREZOR_: localRead("_ENABLE_TREZOR_") === "true",
    isUiDisabled: false,
    uiDisabledMessage: '',
    stagedTransaction: {
        isAwaitingConfirmation: false,
        otherDetails: null,
        data: null,
    },
    nodeNetworkType: ''
}

const mutations: MutationTree<AppInfo> = {
    RESET_APP(state: AppInfo) {
        state.mnemonic = ''
        state.walletList = []
    },
    SET_WALLET_LIST(state: AppInfo, walletList: any[]): void {
        state.walletList = walletList
    },
    SET_MNEMONIC(state: AppInfo, mnemonic: string): void {
        state.mnemonic = mnemonic
    },
    SET_TIME_ZONE(state: AppInfo, timeZone: number): void {
        state.timeZone = timeZone
    },
    SET_IS_NODE_HEALTHY(state: AppInfo, isNodeHealthy: boolean) {
        state.isNodeHealthy = isNodeHealthy
    },
    SET_MOSAICS_LOADING(state: AppInfo, bool: boolean) {
        state.mosaicsLoading = bool
    },
    SET_TRANSACTIONS_LOADING(state: AppInfo, bool: boolean) {
        state.transactionsLoading = bool
    },
    SET_MULTISIG_LOADING(state: AppInfo, bool: boolean) {
        state.multisigLoading = bool
    },
    SET_XEM_USD_PRICE(state: AppInfo, value: number) {
        state.xemUsdPrice = value
    },
    SET_CHAIN_STATUS(state: AppInfo, chainStatus: ChainStatus) {
        state.chainStatus = chainStatus
    },
    SET_CHAIN_HEIGHT(state: AppInfo, chainHeight: number) {
        // @TODO: deprecate in favour of SET_CHAIN_STATUS
        state.chainStatus.currentHeight = chainHeight || 0
    },
    SET_NAMESPACE_LOADING(state: AppInfo, namespaceLoading: boolean) {
        state.namespaceLoading = namespaceLoading
    },
    SET_UI_DISABLED(state: AppInfo, { isDisabled, message }: { isDisabled: boolean, message: string}) {
        state.isUiDisabled = isDisabled;
        state.uiDisabledMessage = message;
    },
    SET_STAGED_TRANSACTION(state: AppInfo,
        { data, isAwaitingConfirmation, otherDetails}:
        {data: Transaction|null, isAwaitingConfirmation: boolean, otherDetails: any}) {
        state.stagedTransaction.data = data;
        state.stagedTransaction.otherDetails = otherDetails;
        state.stagedTransaction.isAwaitingConfirmation = isAwaitingConfirmation;
    },
    SET_NODE_NETWORK_TYPE(state: AppInfo, networkType: any) {
        state.nodeNetworkType = networkType
    },

}

export const appState = {state}
export const appMutations = {mutations}
