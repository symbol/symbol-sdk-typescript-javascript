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
import {MosaicId, MosaicInfo, Mosaic, RawUInt64} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkMosaic: 'mosaic/networkMosaic',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
  })}
})
export class AmountInputTs extends Vue {

  @Prop({
    default: null
  }) mosaicId: MosaicId

  @Prop({
    default: ''
  }) mosaicHex: string

  @Prop({
    default: ''
  }) value: number

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Network mosaics info (all)
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public created() {
    if (this.mosaicId) {
      this.mosaicHex = this.mosaicId.toHex()
    }
    else if (this.mosaicHex) {
      this.mosaicId = new MosaicId(RawUInt64.fromHex(this.mosaicHex))
    }
  }

/// region computed properties getter/setter
  public get relativeValue(): string {
    const mosaicInfo = this.mosaicsInfo.find(info => info.id.equals(this.mosaicId))
    if (undefined === mosaicInfo) {
      return this.value.toString()
    }

    return (this.value / Math.pow(10, mosaicInfo.divisibility)).toString()
  }

  public set relativeValue(amount: string) {
    const asNumber = parseFloat(amount)
    const mosaicInfo = this.mosaicsInfo.find(info => info.id.equals(this.mosaicId))
    if (undefined === mosaicInfo) {
      this.value = Math.floor(asNumber)
    }
    else {
      this.value = Math.floor(asNumber * Math.pow(10, mosaicInfo.divisibility))
    }

    this.$emit('change', this.value)
  }
/// end-region computed properties getter/setter
}
