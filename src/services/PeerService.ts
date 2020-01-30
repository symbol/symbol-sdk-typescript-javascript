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
import {NetworkHttp, NetworkType} from 'nem2-sdk'
import {Store} from 'vuex'

// internal dependencies
import {AbstractService} from './AbstractService'
import {URLHelpers} from '@/core/utils/URLHelpers'

export class PeerService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'peer'

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
   * Get full node url and add missing pieces
   * @param {string} fromUrl 
   * @return {string}
   */
  public getNodeUrl(fromUrl: string): string {
    const url = URLHelpers.formatUrl(fromUrl)
    return url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : ':3000')
  }

  /**
   * Get a node's network type
   * @param {string} nodeUrl 
   * @return {Promise<NetworkType>}
   */
  public async getNetworkType(nodeUrl: string): Promise<NetworkType> {
    try {
      const networkHttp = new NetworkHttp(nodeUrl)
      return await networkHttp.getNetworkType().toPromise()
    }
    catch(e) {
      return NetworkType.TEST_NET
    }
  }
}
