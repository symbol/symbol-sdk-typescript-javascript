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
// internal dependencies
import {IService} from './IService'
import {localSave} from '@/core/utils'
import {Market} from '@/core/api'
import {WebClient} from '@/core/utils/web.ts'

// in-place configuration
import appConfig from '../../config/app.conf.json';

export class MarketService implements IService {
  /**
   * Service name
   * @var {string}
   */
  name: string = 'market'

  public async setMarketOpeningPrice(that: any) {
    try {
      const rstStr = await Market.kline({period: '1min', symbol: 'xemusdt', size: '1'})
      if (!rstStr.rst) return
      const rstQuery: any = JSON.parse(rstStr.rst)
      const result = rstQuery.data ? rstQuery.data[0].close : 0
      that.$store.commit('SET_XEM_USD_PRICE', result)
      const openPriceOneMinute = {
        timestamp: new Date().getTime(),
        openPrice: result,
      }
      localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))
    } catch (error) {
      console.error('setMarketOpeningPrice -> error', error)
    }
  }

  public async kline(params) {
    const symbol = params.symbol
    const period = params.period
    const size = params.size

    const resStr = await WebClient.request('', {
      url: `${appConfig.marketServerUrl}/rest/market/kline/${symbol}/${period}/${size}/`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return {
      rst: resStr,
    }
  }

  public async detail(params) {
    const symbol = params.symbol
    const resStr = await WebClient.request('', {
      url: `${appConfig.marketServerUrl}/rest/market/detail/${symbol}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return {
      rst: resStr,
    }
  }

  public async trade(params) {
    const symbol = params.symbol
    const size = params.size
    const resStr = await WebClient.request('', {
      url: `${appConfig.marketServerUrl}/rest/market/trade/${symbol}/${size}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return {
      rst: resStr,
    }
  }
}
