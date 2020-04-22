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
import {mapGetters} from 'vuex'
import {Component, Prop, Vue} from 'vue-property-decorator'
import {MosaicId, NamespaceId} from 'symbol-sdk'
// internal dependencies
// configuration
// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'


@Component({
  components: {AmountDisplay},
  computed: {
    ...mapGetters({
      mosaics: 'mosaic/mosaics',
      networkCurrency: 'mosaic/networkCurrency',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class MosaicAmountDisplayTs extends Vue {

  @Prop({
    default: null,
  }) id: MosaicId | NamespaceId

  @Prop({
    default: null,
  }) relativeAmount: number

  @Prop({
    default: null,
  }) absoluteAmount: number

  @Prop({
    default: 'green',
  }) color: 'red' | 'green'

  @Prop({
    default: 'normal',
  }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  @Prop({
    default: false,
  }) showTicker: false

  private mosaics: MosaicModel[]

  private networkCurrency: NetworkCurrencyModel

  private networkConfiguration: NetworkConfigurationModel

  /// region computed properties getter/setter

  private useNetwork(): boolean {
    if (!this.id) {
      return !!this.networkCurrency
    }
    if (this.networkCurrency && this.id.toHex() === this.networkCurrency.mosaicIdHex) {
      return true
    }
    if (this.networkCurrency && this.id.toHex() === this.networkCurrency.namespaceIdHex) {
      return true
    }
    return false
  }

  /**
   * Mosaic divisibility from database
   * @return {number}
   */
  protected get divisibility(): number {
    if (this.useNetwork()) {
      return this.networkCurrency.divisibility
    }
    // TODO improve how to resolve the mosaic id when the known value is a namespace id.
    // Note that if the transaction is old, the namespace id of the mosaic may have been expired!
    const mosaic = this.mosaics.find(m => m.mosaicIdHex === this.id.toHex())
    return mosaic ? mosaic.divisibility : this.networkConfiguration.maxMosaicDivisibility
  }

  public get amount(): number {
    if (this.absoluteAmount) {
      return this.absoluteAmount / Math.pow(10, this.divisibility)
    } else {return this.relativeAmount || 0}
  }

  public get ticker(): string {
    if (!this.showTicker) {
      return ''
    }

    if (this.useNetwork()) {
      return this.networkCurrency.ticker || ''
    }

    const mosaic = this.mosaics.find(m => m.mosaicIdHex === this.id.toHex())
    return mosaic && mosaic.name || this.id.toHex()
  }

/// end-region computed properties getter/setter
}
