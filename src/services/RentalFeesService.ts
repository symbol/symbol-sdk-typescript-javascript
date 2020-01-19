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
import {Password} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'

import {Formatters} from '@/core/utils/Formatters'
import {MosaicHelpers} from '@/core/utils/MosaicHelpers'
import {MosaicsModel} from '@/core/database/models/AppMosaic'

//XXX network config store getter
import networkConfig from '../../config/network.conf.json'
const {defaultDynamicFeeMultiplier} = networkConfig.networks['testnet-publicTest'].properties

export class RentalFeesService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  name: string = 'rental-fees'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
  }

  public static getFromDurationInBlocks(
    duration: number,
    networkCurrency: MosaicsModel,
  ) {
    const absoluteCost = this.getAbsoluteCostFromDuration(duration)
    const relative = MosaicHelpers.getRelativeMosaicAmount(absoluteCost, networkCurrency.info().divisibility)
    const relativeWithTicker = Formatters.absoluteAmountToRelativeAmount(absoluteCost, networkCurrency)

    return {absoluteCost, relative, relativeWithTicker}
  }

  private static getAbsoluteCostFromDuration = (duration: number): number => {
    return duration * defaultDynamicFeeMultiplier
  }
}
