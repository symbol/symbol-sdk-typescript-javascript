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
import {Password} from 'nem2-sdk'

// internal dependencies
import {IService} from './IService'

import {networkConfig} from '@/config'
import {absoluteAmountToRelativeAmount} from '@/core/utils'
import {NetworkCurrency} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'

const {defaultDynamicFeeMultiplier} = networkConfig

export class RentalFeesService implements IService {
  /**
   * Service name
   * @var {string}
   */
  name: string = 'rental-fees'

  public static getFromDurationInBlocks(
    duration: number,
    networkCurrency: NetworkCurrency,
  ) {
    const absoluteCost = this.getAbsoluteCostFromDuration(duration)
    const relative = getRelativeMosaicAmount(absoluteCost, networkCurrency.divisibility)
    const relativeWithTicker = absoluteAmountToRelativeAmount(absoluteCost, networkCurrency)

    return {absoluteCost, relative, relativeWithTicker}
  }

  private static getAbsoluteCostFromDuration = (duration: number): number => {
    return duration * defaultDynamicFeeMultiplier
  }
}
