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

// internal dependencies
import {AbstractService} from './AbstractService'

// XXX network config store getter
import networkConfig from '../../config/network.conf.json'
const {defaultDynamicFeeMultiplier} = networkConfig.networks['testnet-publicTest'].properties

export class RentalFeesService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'rental-fees'

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

  private static getAbsoluteCostFromDuration = (duration: number): number => {
    return duration * defaultDynamicFeeMultiplier
  }
}
