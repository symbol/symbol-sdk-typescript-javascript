import Vue from 'vue'
import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {defaultNetworkConfig} from '@/config/index'
import {
  AddressAndNamespaces, AddressAndMosaics,
  AddressAndMultisigInfo, AppMosaic,
  NetworkCurrency, AppWallet, AppNamespace, FormattedTransaction,
  CurrentAccount, AppState, Balances,
} from '@/core/model'
import {localRead, localSave, absoluteAmountToRelativeAmount} from '@/core/utils'
import {StoreWallet} from '@/store/wallet/StoreWallet'
import {NetworkType, AccountHttp, Address} from 'nem2-sdk'
import {BalancesService} from '@/core/services/mosaics/BalancesService'

const state: StoreWallet = {
  walletList: null
}

const mutations: MutationTree<StoreWallet> = {
  ADD_WALLET(state: StoreWallet) {
    state.wallet = null
    state.mosaics = {}
    state.namespaces = []
    state.transactionList = []
    state.currentAccount = CurrentAccount.default()
  },
}

const getters: GetterTree<StoreWallet, AppState> = {
  walletsList(state): string { return state.walletsList; }
}

const actions: ActionTree<any, AppState> = {
  SET_GENERATION_HASH({commit, rootState}, {endpoint, generationHash}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_GENERATION_HASH', generationHash)
  },
  SET_NETWORK_CURRENCY({commit, rootState}, {endpoint, networkCurrency}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_NETWORK_CURRENCY', networkCurrency)
  },
  SET_NETWORK_MOSAICS({commit, rootState}, {endpoint, appMosaics}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_NETWORK_MOSAICS', appMosaics)
  },
  UPDATE_MOSAICS({commit, rootState}, {endpoint, appMosaics}) {
    if (endpoint !== rootState.account.node) return
    commit('UPDATE_MOSAICS', appMosaics)
  },

  async SET_ACCOUNTS_BALANCES({commit, rootState}) {
    const {walletList} = rootState.app
    const {node} = rootState.account
    const plainAddresses = walletList.map(({address}) => Address.createFromRawAddress(address))
    const accountsInfo = await new AccountHttp(node)
      .getAccountsInfo(plainAddresses)
      .toPromise()

    const balances = BalancesService.getFromAccountsInfo(accountsInfo)
    
    commit('SET_ACCOUNTS_BALANCES', balances)
  },
}

export const walletState = {state}
export const walletMutations = {mutations}
export const walletActions = {actions}
export const walletGetters = {getters}
