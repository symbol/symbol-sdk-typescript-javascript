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
import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import {createStore} from '@MOCKS/Store'

/// region globals
const localVue = createLocalVue()
localVue.use(Vuex)
/// end-region globals

/// region helpers
/**
 * Create and *shallow* mount a component injecting
 * store \a modules and \a state (namespaced).
 * @param component 
 * @param modules 
 * @param state 
 */
export const getComponent = (
  component,
  storeModules: {[name: string]: any},
  stateChanges?: {[field: string]: any},
  propsData?: {[field: string]: any},
  stubsData?: {[field: string]: any},
) => {
  // - format store module overwrites
  const modules = Object.keys(storeModules).map(k => ({
    [k]: Object.assign({}, storeModules[k], {
      // - map state overwrites to store module
      state: Object.assign({}, storeModules[k].state, stateChanges),
      // - map unmodified getters
      getters: storeModules[k].getters,
    })
  })).reduce((obj, item) => {
    // - reducer to get {wallet: x, account: y} format
    const key = Object.keys(item).shift()
    obj[key] = item[key]
    return obj
  }, {})

  // - create fake store
  const store = createStore({modules})
  const params = {
    store,
    localVue
  }

  if (propsData && Object.keys(propsData).length) {
    params['propsData'] = propsData
  }

  if (stubsData && Object.keys(stubsData).length) {
    params['stubs'] = stubsData
  } 

  // - mount component
  const wrapper = shallowMount(component, params)
  return wrapper
}
/// end-region helpers
