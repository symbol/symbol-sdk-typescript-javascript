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

@Component({
  computed: {...mapGetters({
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })},
})
export class AmountDisplayTs extends Vue {

  @Prop({
    default: 0
  }) value: number

  @Prop({
    default: 0
  }) decimals: number

  @Prop({
    default: false,
  }) showTicker: false

  @Prop({
    default: 'normal',
  }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  /**
   * Currency mosaic's ticker
   * @var {string}
   */
  public networkMosaicTicker: string

/// region computed properties getter/setter
  get integerPart(): string {
    return Math.floor(this.value).toString()
  }

  get fractionalPart(): string {
    const rest = this.value - Math.floor(this.value)
    if (rest === 0) return ''

    // remove leftmost-0
    return rest.toFixed(this.decimals).replace(/^0/, '')
  }
/// end-region computed properties getter/setter
}
