/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import Vue from 'vue'
import { AccountInfo, Address, IListener, MultisigAccountInfo, NetworkType, RepositoryFactory } from 'symbol-sdk'
import { of, Subscription } from 'rxjs'
// internal dependencies
import { $eventBus } from '../events'
import { RESTService } from '@/services/RESTService'
import { AwaitLock } from './AwaitLock'
import { AccountModel } from '@/core/database/entities/AccountModel'
import { MultisigService } from '@/services/MultisigService'
import * as _ from 'lodash'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { AccountService } from '@/services/AccountService'
import { catchError, map } from 'rxjs/operators'

/// region globals
const Lock = AwaitLock.create()
/// end-region globals

/**
 * Type SubscriptionType for account Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
  listener: IListener
  subscriptions: Subscription[]
}

export type Signer = {
  label: string
  publicKey: string
  address: Address
  multisig: boolean
  requiredCosignatures: number
}

// Account state typing
interface AccountState {
  initialized: boolean
  currentAccount: AccountModel
  currentAccountAddress: Address
  currentAccountMultisigInfo: MultisigAccountInfo
  isCosignatoryMode: boolean
  signers: Signer[]
  currentSigner: Signer
  currentSignerAddress: Address
  currentSignerMultisigInfo: MultisigAccountInfo
  // Known accounts database identifiers
  knownAccounts: AccountModel[]
  knownAddresses: Address[]
  accountsInfo: AccountInfo[]
  multisigAccountsInfo: MultisigAccountInfo[]
  subscriptions: Record<string, SubscriptionType[]>
}

// account state initial definition
const accountState: AccountState = {
  initialized: false,
  currentAccount: null,
  currentAccountAddress: null,
  currentAccountMultisigInfo: null,
  isCosignatoryMode: false,
  signers: [],
  currentSigner: null,
  currentSignerAddress: null,
  currentSignerMultisigInfo: null,
  knownAccounts: [],
  knownAddresses: [],
  accountsInfo: [],
  multisigAccountsInfo: [],
  subscriptions: {},
}

/**
 * Account Store
 */
export default {
  namespaced: true,
  state: accountState,
  getters: {
    getInitialized: (state: AccountState) => state.initialized,
    currentAccount: (state: AccountState): AccountModel => {
      return state.currentAccount
    },
    signers: (state: AccountState): Signer[] => state.signers,
    currentSigner: (state: AccountState): Signer => state.currentSigner,
    currentAccountAddress: (state: AccountState) => state.currentAccountAddress,
    knownAddresses: (state: AccountState) => state.knownAddresses,
    currentAccountMultisigInfo: (state: AccountState) => state.currentAccountMultisigInfo,
    currentSignerMultisigInfo: (state: AccountState) => state.currentSignerMultisigInfo,
    isCosignatoryMode: (state: AccountState) => state.isCosignatoryMode,
    currentSignerAddress: (state: AccountState) => state.currentSignerAddress,
    knownAccounts: (state: AccountState) => state.knownAccounts,
    accountsInfo: (state: AccountState) => state.accountsInfo,
    multisigAccountsInfo: (state: AccountState) => state.multisigAccountsInfo,
    getSubscriptions: (state: AccountState) => state.subscriptions,
  },
  mutations: {
    setInitialized: (state: AccountState, initialized: boolean) => {
      state.initialized = initialized
    },
    currentAccount: (state: AccountState, accountModel: AccountModel) => {
      state.currentAccount = accountModel
    },
    currentAccountAddress: (state: AccountState, accountAddress: Address) => {
      state.currentAccountAddress = accountAddress
    },
    currentSigner: (state: AccountState, currentSigner: Signer) => {
      state.currentSigner = currentSigner
    },
    signers: (state: AccountState, signers: Signer[]) => {
      state.signers = signers
    },
    currentSignerAddress: (state: AccountState, signerAddress) => {
      state.currentSignerAddress = signerAddress
    },
    knownAccounts: (state: AccountState, knownAccounts: AccountModel[]) => {
      state.knownAccounts = knownAccounts
    },
    knownAddresses: (state: AccountState, knownAddresses: Address[]) => {
      state.knownAddresses = knownAddresses
    },
    isCosignatoryMode: (state: AccountState, isCosignatoryMode: boolean) => {
      state.isCosignatoryMode = isCosignatoryMode
    },
    accountsInfo: (state: AccountState, accountsInfo) => {
      state.accountsInfo = accountsInfo
    },
    multisigAccountsInfo: (state: AccountState, multisigAccountsInfo) => {
      state.multisigAccountsInfo = multisigAccountsInfo
    },
    currentAccountMultisigInfo: (state: AccountState, currentAccountMultisigInfo) => {
      state.currentAccountMultisigInfo = currentAccountMultisigInfo
    },
    currentSignerMultisigInfo: (state: AccountState, currentSignerMultisigInfo) => {
      state.currentSignerMultisigInfo = currentSignerMultisigInfo
    },

    setSubscriptions: (state: AccountState, subscriptions: Record<string, SubscriptionType[]>) => {
      state.subscriptions = subscriptions
    },
    updateSubscriptions: (state: AccountState, payload: { address: string; subscriptions: SubscriptionType }) => {
      const { address, subscriptions } = payload

      // if subscriptions are empty, unset the address subscriptions
      if (!subscriptions) {
        Vue.delete(state.subscriptions, address)
        return
      }

      // get current subscriptions from state
      const oldSubscriptions = state.subscriptions[address] || []
      // update subscriptions
      const newSubscriptions: SubscriptionType[] = [...oldSubscriptions, subscriptions]
      // update state
      Vue.set(state.subscriptions, address, newSubscriptions)
    },
  },
  actions: {
    /**
     * Possible `options` values include:
     * @type {
     *    skipTransactions: boolean,
     * }
     */
    async initialize({ commit, getters }, { address }) {
      const callback = async () => {
        if (!address || !address.length) return
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, { getters })
    },
    async uninitialize({ commit, dispatch, getters }, { address }) {
      const callback = async () => {
        // close websocket connections
        await dispatch('UNSUBSCRIBE', address)
        await dispatch('transaction/RESET_TRANSACTIONS', {}, { root: true })
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, { getters })
    },

    /**
     * Possible `options` values include:
     * @type {
     *    isCosignatoryMode: boolean,
     * }
     */
    async SET_CURRENT_ACCOUNT({ commit, dispatch, getters }, currentAccount: AccountModel) {
      const previous: AccountModel = getters.currentAccount
      if (previous && previous.address === currentAccount.address) return

      const currentAccountAddress: Address = Address.createFromRawAddress(currentAccount.address)
      dispatch(
        'diagnostic/ADD_DEBUG',
        'Store action account/SET_CURRENT_ACCOUNT dispatched with ' + currentAccountAddress.plain(),
        {
          root: true,
        },
      )

      // set current account
      commit('currentAccount', currentAccount)

      // reset current signer
      dispatch('SET_CURRENT_SIGNER', {
        publicKey: currentAccount.publicKey,
      })
      $eventBus.$emit('onAccountChange', currentAccountAddress.plain())
    },

    async RESET_CURRENT_ACCOUNT({ commit, dispatch }) {
      dispatch('diagnostic/ADD_DEBUG', 'Store action account/RESET_CURRENT_ACCOUNT dispatched', { root: true })
      commit('currentAccount', null)
      commit('currentAccountAddress', null)
      commit('currentSignerAddress', null)
    },

    async SET_CURRENT_SIGNER({ commit, dispatch, getters, rootGetters }, { publicKey }: { publicKey: string }) {
      if (!publicKey) {
        throw new Error('Public Key must be provided when calling account/SET_CURRENT_SIGNER!')
      }
      const networkType: NetworkType = rootGetters['network/networkType']
      const currentProfile: ProfileModel = rootGetters['profile/currentProfile']
      const currentAccount: AccountModel = getters.currentAccount
      const previousSignerAddress: Address = getters.currentSignerAddress

      const currentSignerAddress: Address = Address.createFromPublicKey(publicKey, networkType)

      if (previousSignerAddress && previousSignerAddress.equals(currentSignerAddress)) return

      dispatch(
        'diagnostic/ADD_DEBUG',
        'Store action account/SET_CURRENT_SIGNER dispatched with ' + currentSignerAddress.plain(),
        {
          root: true,
        },
      )

      dispatch('transaction/RESET_TRANSACTIONS', {}, { root: true })

      const currentAccountAddress = Address.createFromRawAddress(currentAccount.address)
      const knownAccounts = new AccountService().getKnownAccounts(currentProfile.accounts)

      commit('currentSignerAddress', currentSignerAddress)
      commit('currentAccountAddress', currentAccountAddress)
      commit('isCosignatoryMode', !currentSignerAddress.equals(currentAccountAddress))
      commit('knownAccounts', knownAccounts)

      // Upgrade
      dispatch('namespace/SIGNER_CHANGED', {}, { root: true })
      dispatch('mosaic/SIGNER_CHANGED', {}, { root: true })
      dispatch('transaction/SIGNER_CHANGED', {}, { root: true })

      // open / close websocket connections
      if (previousSignerAddress) await dispatch('UNSUBSCRIBE', previousSignerAddress)
      await dispatch('SUBSCRIBE', currentSignerAddress)

      await dispatch('LOAD_ACCOUNT_INFO')

      dispatch('namespace/LOAD_NAMESPACES', {}, { root: true })
      dispatch('mosaic/LOAD_MOSAICS', {}, { root: true })
    },

    async NETWORK_CHANGED({ dispatch }) {
      dispatch('transaction/RESET_TRANSACTIONS', {}, { root: true })
      dispatch('namespace/RESET_NAMESPACES', {}, { root: true })
      dispatch('mosaic/RESET_MOSAICS', {}, { root: true })
      dispatch('transaction/LOAD_TRANSACTIONS', undefined, { root: true })
      await dispatch('mosaic/LOAD_NETWORK_CURRENCIES', undefined, {
        root: true,
      })
      await dispatch('LOAD_ACCOUNT_INFO')
      dispatch('namespace/LOAD_NAMESPACES', {}, { root: true })
      dispatch('mosaic/LOAD_MOSAICS', {}, { root: true })
    },

    async LOAD_ACCOUNT_INFO({ commit, getters, rootGetters }) {
      const networkType: NetworkType = rootGetters['network/networkType']
      const currentAccount: AccountModel = getters.currentAccount
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const currentSignerAddress: Address = getters.currentSignerAddress
      const currentAccountAddress: Address = getters.currentAccountAddress
      const knownAccounts: AccountModel[] = getters.knownAccounts

      // remote calls:

      const getMultisigAccountGraphInfoPromise = repositoryFactory
        .createMultisigRepository()
        .getMultisigAccountGraphInfo(currentAccountAddress)
        .pipe(
          map((g) => {
            return MultisigService.getMultisigInfoFromMultisigGraphInfo(g)
          }),
          catchError(() => {
            return of([])
          }),
        )
        .toPromise()

      // REMOTE CALL
      const multisigAccountsInfo: MultisigAccountInfo[] = await getMultisigAccountGraphInfoPromise

      const currentAccountMultisigInfo = multisigAccountsInfo.find((m) =>
        m.account.address.equals(currentAccountAddress),
      )
      const currentSignerMultisigInfo = multisigAccountsInfo.find((m) => m.account.address.equals(currentSignerAddress))

      const signers = new MultisigService().getSigners(
        networkType,
        knownAccounts,
        currentAccount,
        currentAccountMultisigInfo,
      )

      const knownAddresses = _.uniqBy(
        [...signers.map((s) => s.address), ...knownAccounts.map((w) => Address.createFromRawAddress(w.address))].filter(
          (a) => a,
        ),
        'address',
      )

      commit('knownAddresses', knownAddresses)
      commit(
        'currentSigner',
        signers.find((s) => s.address.equals(currentSignerAddress)),
      )
      commit('signers', signers)
      commit('multisigAccountsInfo', multisigAccountsInfo)
      commit('currentAccountMultisigInfo', currentAccountMultisigInfo)
      commit('currentSignerMultisigInfo', currentSignerMultisigInfo)

      // REMOTE CALL
      const getAccountsInfoPromise = repositoryFactory
        .createAccountRepository()
        .getAccountsInfo(knownAddresses)
        .toPromise()
      const accountsInfo = await getAccountsInfoPromise

      commit('accountsInfo', accountsInfo)
    },

    UPDATE_CURRENT_ACCOUNT_NAME({ commit, getters, rootGetters }, name: string) {
      const currentAccount: AccountModel = getters.currentAccount
      if (!currentAccount) {
        return
      }
      const currentProfile: ProfileModel = rootGetters['profile/currentProfile']
      if (!currentProfile) {
        return
      }
      const accountService = new AccountService()
      accountService.updateName(currentAccount, name)
      const knownAccounts = accountService.getKnownAccounts(currentProfile.accounts)
      commit('knownAccounts', knownAccounts)
    },

    SET_KNOWN_ACCOUNTS({ commit }, accounts: string[]) {
      commit('knownAccounts', new AccountService().getKnownAccounts(accounts))
    },

    /**
     * Websocket API
     */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({ commit, dispatch, rootGetters }, address: Address) {
      if (!address) return

      const plainAddress = address.plain()

      // use RESTService to open websocket channel subscriptions
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const subscriptions: SubscriptionType = await RESTService.subscribeTransactionChannels(
        { commit, dispatch },
        repositoryFactory,
        plainAddress,
      )
      const payload: { address: string; subscriptions: SubscriptionType } = { address: plainAddress, subscriptions }
      // update state of listeners & subscriptions
      commit('updateSubscriptions', payload)
    },

    // Unsubscribe an address open websocket connections
    async UNSUBSCRIBE({ commit, getters }, plainAddress: string) {
      // get all subscriptions
      const subscriptions: Record<string, SubscriptionType[]> = getters.getSubscriptions
      // subscriptions to close
      const subscriptionTypes = (subscriptions && subscriptions[plainAddress]) || []

      if (!subscriptionTypes.length) return

      // close subscriptions
      for (const subscriptionType of subscriptionTypes) {
        const { listener, subscriptions } = subscriptionType
        for (const subscription of subscriptions) subscription.unsubscribe()
        listener.close()
      }

      // update state of listeners & subscriptions
      const payload: { address: string; subscriptions: SubscriptionType } = {
        address: plainAddress,
        subscriptions: null,
      }
      commit('updateSubscriptions', payload)
    },
  },
}
