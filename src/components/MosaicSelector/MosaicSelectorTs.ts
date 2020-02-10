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

// child components
// @ts-ignore
import ErrorTooltip from '@/components//ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicName: 'mosaic/networkMosaicName',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
    mosaicsNames: 'mosaic/mosaicsNames',
  })}
})
export class MosaicSelectorTs extends Vue {

  @Prop({
    default: []
  }) mosaics: Mosaic[]

  @Prop({
    default: ''
  }) value: string

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Networks currency mosaic name
   * @var {string}
   */
  public networkMosaicName: string

  /**
   * Network mosaics info (all)
   * @see {Store.Mosaic}
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /**
   * Network mosaics names (all)
   * @see {Store.Mosaic}
   * @var {string[]}
   */
  public mosaicsNames: any

  public created() {
    this.selectedMosaicName = this.networkMosaicName
  }

/// region computed properties getter/setter
  public get selectedMosaic(): string {
    return Object.keys(this.mosaicsNames).find(k => this.mosaicsNames[k] === this.selectedMosaicName)
  }

  public set selectedMosaic(hex: string) {
    this.$emit('input', hex)
  }

  public get selectedMosaicName(): string {
    const selected = this.value || this.networkMosaic.toHex()
    const id = new MosaicId(RawUInt64.fromHex(selected))
    return this.getMosaicName(id)
  }

  public set selectedMosaicName(name: string) {
    this.selectedMosaic = Object.keys(this.mosaicsNames).find(
      k => (this.mosaicsNames[k].hasOwnProperty('namespaceId') 
         && this.mosaicsNames[k].namespaceId.fullName === name)
         || this.mosaicsNames[k] === name
    )
  }
  /// end-region computed properties getter/setter

  public onChange (input: string) {
    console.log('onChange: ', input)
    const canFindByName = Object.keys(this.mosaicsNames).find(
      k => (this.mosaicsNames[k].hasOwnProperty('namespaceId') 
         && this.mosaicsNames[k].namespaceId.fullName === input)
         || this.mosaicsNames[k] === input
    )
    if (undefined !== canFindByName) {
      console.log('canFindByName: ', canFindByName)
      return this.selectedMosaicName = this.mosaicsNames[canFindByName]
    }

    const canFindByHex = Object.keys(this.mosaicsNames).find(k => k === input)
    if (undefined !== canFindByHex) {
      console.log('canFindByHex: ', canFindByHex)
      return this.selectedMosaicName = this.mosaicsNames[canFindByHex]
    }
  }

  public getMosaicName(mosaicId: MosaicId): string {
    if (this.mosaicsNames.hasOwnProperty(mosaicId.toHex())) {
      return this.mosaicsNames[mosaicId.toHex()].hasOwnProperty('namespaceId')
           ? this.mosaicsNames[mosaicId.toHex()].namespaceId.fullName
           : this.mosaicsNames[mosaicId.toHex()]
    }

    return mosaicId.toHex()
  }
}
