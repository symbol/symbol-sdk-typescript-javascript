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
import {WebClient} from '@/core/utils/WebClient'
import {MarketsRepository} from '@/repositories/MarketsRepository'

// in-place configuration
import appConfig from '../../config/app.conf.json';

export class MarketService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'market'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * The repository instance
   * @var {MarketsRepository}
   */
  protected repository: MarketsRepository

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
    this.repository = new MarketsRepository()
  }

  public async setMarketOpeningPrice() {
    try {
      const rstStr: any = await this.kline({
        period: '1min',
        symbol: 'xemusdt',
        size: '1'
      })
      if (!rstStr.rst) return

      // parse response
      const rstQuery: any = JSON.parse(rstStr.rst)
      const result = rstQuery.data ? rstQuery.data[0].close : 0

      // update state
      this.$store.commit('market/SET_CURRENT_PRICE', result)

      // save to storage
      this.repository.create(new Map<string, any>([
        ['timestamp', new Date().getTime()],
        ['price_usd', result]
      ]))
    }
    catch (error) {
      const errorMessage = 'An error happened while getting market rates: ' + error
      this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
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
