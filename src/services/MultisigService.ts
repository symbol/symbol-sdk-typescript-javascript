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
import {Store} from 'vuex'
import {MultisigAccountGraphInfo, MultisigAccountInfo} from 'symbol-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'

export class MultisigService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'multisig'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Returns all available multisig info from a multisig graph
   * @static
   * @param {MultisigAccountGraphInfo} multisig graph info
   * @returns {MultisigAccountInfo[]} multisig info
   */
  public static getMultisigInfoFromMultisigGraphInfo(
    graphInfo: MultisigAccountGraphInfo,
  ): MultisigAccountInfo[] {
    const {multisigAccounts} = graphInfo

    const multisigsInfo =  [...multisigAccounts.keys()]
        .sort((a, b) => b - a) // Get addresses from top to bottom
        .map((key) => multisigAccounts.get(key) || [])
        .filter((x) => x.length > 0)

    return [].concat(...multisigsInfo).map(item => item) // flatten
  }
}
