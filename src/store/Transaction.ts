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
import {Address, AggregateTransaction, BlockInfo, CosignatureSignedTransaction, QueryParams, RepositoryFactory, Transaction, TransactionType, UInt64} from 'symbol-sdk'
// internal dependencies
import {AwaitLock} from './AwaitLock'
import {combineLatest, Observable} from 'rxjs'
import * as _ from 'lodash'
import {map} from 'rxjs/operators'

const Lock = AwaitLock.create()

export enum TransactionGroup {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
  partial = 'partial',
  all = 'all'
}


/**
 * Helper to format transaction group in name of state variable.
 *
 * @internal
 * @param {string} group
 * @return {string} One of 'confirmedTransactions', 'unconfirmedTransactions' or
 *   'partialTransactions'
 */
const transactionGroupToStateVariable = (group: TransactionGroup): string => {
  return group + 'Transactions'
}

const transactionComparator = (t1, t2) => {
  // - unconfirmed/partial sorted by index
  return t1.transactionInfo.index - t2.transactionInfo.index
}
const confirmedTransactionComparator = (t1, t2) => {
  const info1 = t1.transactionInfo
  const info2 = t2.transactionInfo
  // - confirmed sorted by height then index
  const diffHeight = info1.height.compact() - info2.height.compact()
  const diffIndex = info1.index - info2.index
  return diffHeight !== 0 ? diffHeight : diffIndex
}

function conditionalSort<T>(array: T[] | undefined, comparator: (a: T, b: T) => number): T[] | undefined {
  if (!array) {
    return array
  }
  return array.sort(comparator)
}


interface TransactionState {
  initialized: boolean
  isFetchingTransactions: boolean
  confirmedTransactions: Transaction[]
  unconfirmedTransactions: Transaction[]
  partialTransactions: Transaction[]
  blocks: BlockInfo[]
}

const transactionState: TransactionState = {
  initialized: false,
  isFetchingTransactions: false,
  confirmedTransactions: [],
  unconfirmedTransactions: [],
  partialTransactions: [],
  blocks: [],
}
export default {
  namespaced: true,
  state: transactionState,
  getters: {
    getInitialized: (state: TransactionState) => state.initialized,
    isFetchingTransactions: (state: TransactionState) => state.isFetchingTransactions,
    confirmedTransactions: (state: TransactionState) => state.confirmedTransactions,
    unconfirmedTransactions: (state: TransactionState) => state.unconfirmedTransactions,
    partialTransactions: (state: TransactionState) => state.partialTransactions,
    blocks: (state: TransactionState) => state.blocks,
  },
  mutations: {
    setInitialized: (state: TransactionState, initialized: boolean) => { state.initialized = initialized },
    isFetchingTransactions: (state: TransactionState, isFetchingTransactions: boolean) =>
    { state.isFetchingTransactions = isFetchingTransactions },
    confirmedTransactions: (state: TransactionState, confirmedTransactions: Transaction[] | undefined) => {
      state.confirmedTransactions = conditionalSort(confirmedTransactions,
        confirmedTransactionComparator)
    },
    unconfirmedTransactions: (state: TransactionState, unconfirmedTransactions: Transaction[] | undefined) => {
      state.unconfirmedTransactions = conditionalSort(unconfirmedTransactions,
        transactionComparator)
    },
    partialTransactions: (state: TransactionState, partialTransactions: Transaction[] | undefined) => {
      state.partialTransactions = conditionalSort(partialTransactions, transactionComparator)
    },
    blocks: (state: TransactionState, blocks: BlockInfo[]) => {
      state.blocks = _.uniqBy(blocks, b => b.height.compact())
    },

  },
  actions: {
    async initialize({commit, getters}) {
      const callback = async () => {
        // Placeholder for initialization if necessary.
        commit('setInitialized', true)
      }
      // aquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },

    async uninitialize({commit, getters, dispatch}) {
      const callback = async () => {
        await dispatch('RESET_TRANSACTIONS')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },

    LOAD_TRANSACTIONS({commit, rootGetters, dispatch}, {group}:
    { group: TransactionGroup } = {group: TransactionGroup.all}) {
      const currentSignerAddress: Address = rootGetters['wallet/currentSignerAddress']
      if (!currentSignerAddress) {
        return
      }
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const accountRepository = repositoryFactory.createAccountRepository()
      const subscribeTransactions = (group: TransactionGroup, transactionCall: Observable<Transaction[]>):
      Observable<Transaction[]> => {
        const attributeName = transactionGroupToStateVariable(group)
        commit(attributeName, [])
        return transactionCall.pipe(map((transactions) => {
          commit(attributeName, transactions)
          const heights = _.uniqBy(
            transactions.filter(t => t.transactionInfo && t.transactionInfo.height)
              .map(t => t.transactionInfo.height),
            h => h.compact())
          dispatch('LOAD_BLOCKS', heights)
          return transactions
        }))
      }

      const subscriptions: Observable<Transaction[]>[] = []
      commit('isFetchingTransactions', true)

      const queryParams = new QueryParams({pageSize: 100})
      if (group === TransactionGroup.all || group === TransactionGroup.confirmed) {
        subscriptions.push(subscribeTransactions(TransactionGroup.confirmed,
          accountRepository.getAccountTransactions(currentSignerAddress, queryParams)))
      }
      if (group === TransactionGroup.all || group === TransactionGroup.unconfirmed) {
        subscriptions.push(subscribeTransactions(TransactionGroup.unconfirmed,
          accountRepository.getAccountUnconfirmedTransactions(currentSignerAddress, queryParams)))
      }

      if (group === TransactionGroup.all || group === TransactionGroup.partial) {
        subscriptions.push(subscribeTransactions(TransactionGroup.partial,
          accountRepository.getAccountPartialTransactions(currentSignerAddress, queryParams)))
      }

      combineLatest(subscriptions)
        .subscribe({
          complete: () => commit('isFetchingTransactions', false),
        })
    },


    SIGNER_CHANGED({dispatch}) {
      dispatch('LOAD_TRANSACTIONS')
    },

    RESET_TRANSACTIONS({commit}) {
      Object.keys(TransactionGroup).forEach((group: TransactionGroup) => {
        if (group !== TransactionGroup.all) {commit(transactionGroupToStateVariable(group), [])}
      })
    },

    ADD_BLOCK({commit, getters}, block: BlockInfo) {
      const blocks: BlockInfo[] = getters['blocks']
      commit('blocks', [ block, ...blocks ])
    },

    async LOAD_BLOCKS({commit, getters, rootGetters}, heights: UInt64[]) {
      if (!heights || !heights.length) {
        return
      }

      let blocks: BlockInfo[] = getters['blocks']
      const isUnknownBlock = h => !blocks.find(block => block.height.equals(h))
      const heightsToBeLoaded = heights.filter(isUnknownBlock).sort((a, b) => a.compare(b))
      if (!heightsToBeLoaded.length) {
        return
      }

      const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index ++) {
          await callback(array[index], index, array)
        }
      }

      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const blockRepository = repositoryFactory.createBlockRepository()

      await asyncForEach(heightsToBeLoaded, async (start: UInt64) => {
        // Async one by one sequentially so we can reuse a previous loading if the height has been
        // found.
        if (isUnknownBlock(start)) {
          const infos = await blockRepository.getBlocksByHeightWithLimit(start, 100).toPromise()
          blocks = blocks.concat(infos)
          commit('blocks', blocks)
        }
      })
    },


    ADD_TRANSACTION({commit, getters}, {group, transaction}: { group: TransactionGroup, transaction: Transaction }) {
      if (!group) {
        throw Error('Missing mandatory field \'group\' for action transaction/ADD_TRANSACTION.')
      }

      if (!transaction) {
        throw Error(
          'Missing mandatory field \'transaction\' for action transaction/ADD_TRANSACTION.')
      }
      // format transactionAttribute to store variable name
      const transactionAttribute = transactionGroupToStateVariable(group)

      // register transaction
      const transactions = getters[transactionAttribute] || []
      if (!transactions.find(t => t.transactionInfo.hash === transaction.transactionInfo.hash)) {
        // update state
        commit(transactionAttribute, [ transaction, ...transactions ])
      }

    },
    REMOVE_TRANSACTION({commit, getters}, {group, transactionHash}:
    { group: TransactionGroup, transactionHash: string }) {

      if (!group) {
        throw Error('Missing mandatory field \'group\' for action transaction/REMOVE_TRANSACTION.')
      }

      if (!transactionHash) {
        throw Error(
          'Missing mandatory field \'transactionHash\' for action transaction/REMOVE_TRANSACTION.')
      }
      // format transactionAttribute to store variable name
      const transactionAttribute = transactionGroupToStateVariable(group)

      // register transaction
      const transactions = getters[transactionAttribute] || []
      commit(transactionAttribute,
        transactions.filter(t => t.transactionInfo.hash !== transactionHash))
    },

    ON_NEW_TRANSACTION({dispatch}, transaction: Transaction): void {
      if (!transaction) return

      // extract transaction types from the transaction
      const transactionTypes: TransactionType[] = _.uniq(transaction instanceof AggregateTransaction
        ? transaction.innerTransactions
          .map(({type}) => type)
        : [transaction.type])

      // add actions to the dispatcher according to the transaction types
      if ([
        TransactionType.NAMESPACE_REGISTRATION,
        TransactionType.MOSAIC_ALIAS,
        TransactionType.ADDRESS_ALIAS,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatch('namespace/LOAD_NAMESPACES', {}, {root: true})
      }
      if ([
        TransactionType.MOSAIC_DEFINITION,
        TransactionType.MOSAIC_SUPPLY_CHANGE,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatch('mosaic/LOAD_MOSAICS', {}, {root: true})
      }

      if (transactionTypes.includes(TransactionType.MULTISIG_ACCOUNT_MODIFICATION)) {
        dispatch('wallet/LOAD_ACCOUNT_INFO', {}, {root: true})
      }

    },
    /// end-region scoped actions

    ADD_COSIGNATURE({commit, getters}, transaction: CosignatureSignedTransaction) {
      if (!transaction || !transaction.parentHash) {
        throw Error(
          'Missing mandatory field \'parentHash\' for action transaction/ADD_COSIGNATURE.')
      }
      const transactionAttribute = transactionGroupToStateVariable(TransactionGroup.partial)
      const transactions = getters[transactionAttribute] || []

      // return if no transactions
      if (!transactions.length) return

      const index = transactions.findIndex(
        t => t.transactionInfo.hash === transaction.parentHash)

      // partial tx unknown, @TODO: handle this case (fetch partials)
      if (index === -1) return

      transactions[index] = transactions[index].addCosignatures(transaction)
      commit('partialTransactions', transactions)
    },
  },

}
