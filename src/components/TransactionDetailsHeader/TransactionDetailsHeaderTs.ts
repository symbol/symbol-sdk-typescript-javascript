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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {
  NetworkType,
  MosaicId,
} from 'nem2-sdk'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import networkConfig from '@/../config/network.conf.json'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

@Component({
  components: {
    MosaicAmountDisplay,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })},
})
export class TransactionDetailsHeaderTs extends Vue {

  @Prop({
    default: null
  }) view: TransactionViewType

  /**
   * Current network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Network mosaic id
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Current network currency mosaic ticker
   * @see {Store.Mosaic}
   * @var {string}
   */
  public networkMosaicTicker: string

  /**
   * Explorer base path
   * @var {string}
   */
  public explorerBaseUrl: string = networkConfig.explorerUrl

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters = Formatters

  /**
   * Returns the effective fee paid if available
   * @return {number}
   */
  public getFeeAmount(): number {
    if (!this.view) {
      return 0
    }

    return this.view.values.get('effectiveFee')
        || this.view.values.get('maxFee')
        || 0
  }
}
