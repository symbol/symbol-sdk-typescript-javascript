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
import {mapGetters} from 'vuex'
import {Component, Prop, Vue} from 'vue-property-decorator'
import {MosaicId, MosaicInfo} from 'nem2-sdk'

import {MosaicService} from '@/services/MosaicService'

// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'

@Component({
  components: {AmountDisplay},
  computed: {...mapGetters({
    mosaicsInfo: 'mosaic/mosaicsInfoList',
  })}
})
export class MosaicAmountDisplayTs extends Vue {

  @Prop({
    default: null,
    required: true
  }) id: MosaicId
    
  @Prop({
    default: null
  }) relativeAmount: number
    
  @Prop({
    default: null
  }) absoluteAmount: number

  /**
   * Whether to show absolute amount or not
   */
  @Prop({
    default: false
  }) absolute: boolean

  @Prop({
    default: 'green'
  }) color: 'red' | 'green'

  @Prop({
    default: 'normal',
  }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  /**
   * Network mosaics info (all)
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  public divisibility: number = 0

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async mounted() {
    const service = new MosaicService(this.$store)
    if (!this.id) return 
    const model = await service.getMosaic(this.id)
    this.divisibility = model.values.get('divisibility')
  }

/// region computed properties getter/setter
  public get amount(): number {
    if (this.absolute && null === this.absoluteAmount) {
      return this.relativeAmount * Math.pow(10, this.divisibility)
    }
    else if (this.absolute) {
      return this.absoluteAmount
    }

    return this.relativeAmount
  }
/// end-region computed properties getter/setter
}
