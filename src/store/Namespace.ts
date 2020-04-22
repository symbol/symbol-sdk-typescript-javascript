/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Address, NamespaceId, RepositoryFactory} from 'symbol-sdk'
import Vue from 'vue'
// internal dependencies
import {AwaitLock} from './AwaitLock'
import {NamespaceService} from '@/services/NamespaceService'
import {NamespaceModel} from '@/core/database/entities/NamespaceModel'

import * as _ from 'lodash'

const Lock = AwaitLock.create()


interface NamespaceState {
  initialized: boolean
  namespaces: NamespaceModel[]
  ownedNamespaces: NamespaceModel[]
}

const namespaceState: NamespaceState = {
  initialized: false,
  namespaces: [],
  ownedNamespaces: [],
}

export default {
  namespaced: true,
  state: namespaceState,
  getters: {
    getInitialized: (state: NamespaceState) => state.initialized,
    namespaces: (state: NamespaceState) => state.namespaces,
    ownedNamespaces: (state: NamespaceState) => state.ownedNamespaces,
  },
  mutations: {
    setInitialized: (state: NamespaceState, initialized) => { state.initialized = initialized },
    namespaces: (state: NamespaceState,
      {namespaces, currentSignerAddress}: { namespaces: NamespaceModel[], currentSignerAddress: Address }) => {
      const uniqueNamespaces = _.uniqBy(namespaces, n => n.namespaceIdHex)
      Vue.set(state, 'namespaces', uniqueNamespaces)
      Vue.set(state, 'ownedNamespaces',
        uniqueNamespaces.filter(n => n.ownerAddressRawPlain === currentSignerAddress.plain()))
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

    async uninitialize({commit, getters}) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },

    LOAD_NAMESPACES({commit, rootGetters}) {
      const currentSignerAddress = rootGetters['wallet/currentSignerAddress'] as Address
      const knownAddresses = rootGetters['wallet/knownAddresses'] as Address[] || []
      if (!currentSignerAddress) {
        return
      }
      const repositoryFactory = rootGetters['network/repositoryFactory']
      const namespaceService = new NamespaceService()
      namespaceService.getNamespaces(repositoryFactory, knownAddresses).subscribe((namespaces) => {
        commit('namespaces', {namespaces, currentSignerAddress})
      })
    },

    async RESOLVE_NAME({commit, getters, rootGetters}, namespaceId: NamespaceId): Promise<string> {
      if (!namespaceId) {
        return ''
      }

      if (namespaceId.fullName) {
        return namespaceId.fullName
      }
      const namespaces: NamespaceModel[] = getters['namespaces']
      const knownNamespace = namespaces.find(n => n.namespaceIdHex === namespaceId.toHex())
      if (knownNamespace) {
        return knownNamespace.name
      }
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const currentSignerAddress = rootGetters['wallet/currentSignerAddress'] as Address
      const namespaceRepository = repositoryFactory.createNamespaceRepository()

      const namespaceInfo = await namespaceRepository.getNamespace(namespaceId).toPromise()

      // map by hex if names available
      const namespaceName = await namespaceRepository.getNamespacesName([namespaceId]).toPromise()

      // Note, fullName may not be full. How can we load it without needing to load each parent recursively?.
      const model = new NamespaceModel(namespaceInfo,
        NamespaceService.getFullNameFromNamespaceNames(namespaceName[0], namespaceName))
      namespaces.push(model)
      commit('namespaces', {namespaces, currentSignerAddress})
      return model.name
    },

    SIGNER_CHANGED({dispatch}) {
      dispatch('LOAD_NAMESPACES')
    },

  },
}
