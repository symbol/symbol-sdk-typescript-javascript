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
import {NetworkType, MosaicId} from 'symbol-sdk'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

// child components
// @ts-ignore
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({
  components: {
    TransactionDetailRow,
  },
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      networkMosaic: 'mosaic/networkMosaic',
      networkMosaicTicker: 'mosaic/networkMosaicTicker',
    }),
  },
})
export class TransactionDetailsHeaderTs extends Vue {

  @Prop({
    default: null,
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
   * Returns the relative effective fee paid if available
   * @return {number}
   */
  public getFeeAmount(): number {
    if (!this.view) return 0
    const absoluteFee = this.view.values.get('effectiveFee') || this.view.values.get('maxFee')
    if (!absoluteFee) return 0
    const networkMosaicDivisibility = currentNetworkConfig.properties.maxMosaicDivisibility
    return absoluteFee / Math.pow(10, networkMosaicDivisibility)
  }

  /**
   * Displayed items
   * @see {Store.Mosaic}
   * @type {({ key: string, value: string | boolean, | Mosaic }[])}
   */
  get items(): {key: string, value: any, isMosaic?: boolean}[] {
    return [
      {key: 'status', value: `${this.$t(this.view.info ? 'confirmed' : 'unconfirmed')}`},
      {
        key: 'transaction_type',
        value: `${this.$t(`transaction_descriptor_${this.view.transaction.type}`)}`,
      },
      {
        key: 'hash',
        value: this.view.info ? this.view.info.hash : '-',
      },
      {
        key: `${this.view.info ? 'paid_fee' : 'max_fee'}`,
        value: {
          id: this.networkMosaic,
          mosaicHex: this.networkMosaicTicker,
          amount: this.getFeeAmount(),
        },
        isMosaic: true,
      },
      {
        key: 'block_height',
        value: this.view.info ? `${this.$t('block')} #${this.view.info.height.compact()}` : '-',
      },
      {
        key: 'deadline',
        value: `${this.view.values.get('deadline').value.toLocalDate()} ${this.view.values.get('deadline').value.toLocalTime()}`,
      },
    ]
  }
}
