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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {MosaicId, MosaicInfo} from 'nem2-sdk'

// configuration
import feesConfig from '@/../config/fees.conf.json'

@Component({computed: {...mapGetters({
  networkMosaic: 'mosaic/networkMosaic',
  networkMosaicName: 'mosaic/networkMosaicName',
  mosaicsInfo: 'mosaic/mosaicsInfoList',
})}})
export class MaxFeeSelectorTs extends Vue {

  /**
   * Networks currency mosaic id
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Networks currency mosaic name
   * @var {string}
   */
  public networkMosaicName: string

  /**
   * Known mosaics info
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  @Prop({
    default: 'single'
  }) multiplier: 'single' | 'double' | 'triple'
  
  /**
   * Value set by the parent component's v-model
   * @type {number}
   */
  @Prop() value: number
  /**
   * Fees specification
   * @var {any}
   */
  public feeSpeeds = feesConfig[this.multiplier]

/// region computed properties getter/setter
  /**
   * Value set by the parent component
   * @type {number}
   */
  get chosenMaxFee(): number {
    return this.value
  }

  /**
   * Emit value change
   */
  set chosenMaxFee(newValue: number) {
    this.$emit('input', newValue)
  }
/// end-region computed properties getter/setter

  /**
   * Convert a relative amount to absolute using mosaicInfo
   * @param {number} price
   * @return {number}
   */
  public convertToRawAmount(price: number): number {
    const mosaicInfo = this.mosaicsInfo.find(info => info.id.equals(this.networkMosaic))
    if (mosaicInfo === undefined) {
      return price * Math.pow(10, 6)
    }

    return price * Math.pow(10, mosaicInfo.divisibility)
  }
}
