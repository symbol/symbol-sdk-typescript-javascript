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
// external dependencies
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {MosaicId} from 'symbol-sdk'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

@Component({
  computed: {...mapGetters({
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
    networkMosaic: 'mosaic/networkMosaic',
  })},
})
export class AmountDisplayTs extends Vue {
  @Prop({ default: 0 }) value: number
  
  @Prop({ default: currentNetworkConfig.properties.maxMosaicDivisibility }) decimals: number
  
  @Prop({ default: false }) showTicker: false
  
  @Prop({ default: '' }) ticker: string
  
  @Prop({ default: 'normal' }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  /**
   * Currency mosaic's ticker
   * @var {string}
   */
  public networkMosaicTicker: string

  /**
   * Currency mosaic's Id
   * @var {string}
   */
  public networkMosaic: MosaicId

  /// region computed properties getter/setter
  get integerPart(): string {
    return Math.floor(this.value).toLocaleString()
  }

  get fractionalPart(): string {
    const rest = this.value - Math.floor(this.value)
    if (rest === 0) return ''

    // remove leftmost-0 and rightmost-0
    return Number(rest.toFixed(this.decimals)).toPrecision().toString().replace(/^0/, '')
  }

  /**
   * Ticker displayed in the view
   * @readonly
   * @type {string}
   */
  get displayedTicker(): string {
    if (!this.showTicker) return ''
    if (this.ticker === this.networkMosaic.id.toHex()) return this.networkMosaicTicker
    return this.ticker || this.networkMosaicTicker
  }
/// end-region computed properties getter/setter
}
