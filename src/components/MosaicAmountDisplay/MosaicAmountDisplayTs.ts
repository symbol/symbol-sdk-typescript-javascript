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
import {MosaicId, MosaicInfo} from 'symbol-sdk'

// internal dependencies
import {MosaicService} from '@/services/MosaicService'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'

@Component({
  components: {AmountDisplay},
  computed: {...mapGetters({
    mosaicsInfo: 'mosaic/mosaicsInfoList',
  })},
})
export class MosaicAmountDisplayTs extends Vue {

  @Prop({
    default: null,
    required: true,
  }) id: MosaicId

  @Prop({
    default: null,
  }) relativeAmount: number

  @Prop({
    default: null,
  }) absoluteAmount: number

  /**
   * Whether to show absolute amount or not
   */
  @Prop({
    default: false,
  }) absolute: boolean

  @Prop({
    default: 'green',
  }) color: 'red' | 'green'

  @Prop({
    default: 'normal',
  }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  @Prop({
    default: false,
  }) showTicker: false

  @Prop({
    default: null,
  }) ticker: string

  /**
   * Network mosaics info (all)
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /// region computed properties getter/setter
  /**
   * Mosaic divisibility from database
   * @return {number}
   */
  protected get divisibility(): number {
    const service = new MosaicService(this.$store)
    const model = service.getMosaicSync(this.id)
    if (!model) return currentNetworkConfig.properties.maxMosaicDivisibility
    return model.values.get('divisibility')
  }

  public get amount(): number {
    if (this.absolute && null === this.absoluteAmount) {
      return this.relativeAmount * Math.pow(10, this.divisibility)
    }
    else if (this.absolute) {
      return this.absoluteAmount
    }
    else if (!this.absolute && this.absoluteAmount && this.divisibility >= 0) {
      return this.absoluteAmount / Math.pow(10, this.divisibility)
    }

    return this.relativeAmount
  }
/// end-region computed properties getter/setter
}
