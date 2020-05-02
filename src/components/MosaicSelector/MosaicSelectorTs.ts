/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { MosaicId } from 'symbol-sdk'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// internal dependencies
// child components
import { ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components//ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components//FormLabel/FormLabel.vue'
import { MosaicModel } from '@/core/database/entities/MosaicModel'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormLabel,
  },
  computed: {
    ...mapGetters({
      networkMosaic: 'mosaic/networkMosaic',
      networkMosaicName: 'mosaic/networkMosaicName',
      mosaics: 'mosaic/mosaics',
    }),
  },
})
export class MosaicSelectorTs extends Vue {
  /**
   * Prop bound to the parent v-model
   */
  @Prop({ default: '' }) value: string

  /**
   * Mosaics to display as options
   */
  @Prop({ default: [] }) mosaicHexIds: string[]

  /**
   * Field label hidden by default
   */
  @Prop({ default: null }) label: string

  @Prop({ default: 'networkMosaic' }) defaultMosaic: 'networkMosaic' | 'firstInList'
  /**
   * Networks currency mosaic
   */
  public networkMosaic: MosaicId

  /**
   * Networks currency mosaic name
   */
  public networkMosaicName: string

  /**
   * All the known mosaics.
   */
  public mosaics: MosaicModel[]

  /// region computed properties getter/setter

  /**
   * Mosaics shown as options in the select
   * @readonly
   * @protected
   */
  protected get displayedMosaics(): MosaicModel[] {
    return this.mosaicHexIds
      .map((mosaicIdHex) => this.mosaics.find((m) => m.mosaicIdHex === mosaicIdHex))
      .filter((x) => x)
  }

  /**
   * Sets the default input value
   * @type {string}
   */
  public get selectedMosaic(): string {
    return this.value
  }

  /**
   * Emits input value change to parent component
   */
  public set selectedMosaic(hex: string) {
    this.$emit('input', hex)
  }

  /**
   * Hook called when the layout is mounted
   * @return {void}
   */
  public mounted(): void {
    // if a value is provided, return
    if (this.value && this.value.length > 0) return

    // else... set default value to network mosaic
    if (this.defaultMosaic === 'networkMosaic' && this.networkMosaic) {
      this.selectedMosaic = this.networkMosaic.toHex()
    }

    // otherwise... set default value to the first mosaic from the props
    if (this.defaultMosaic === 'firstInList' && this.mosaicHexIds.length) {
      this.selectedMosaic = this.mosaicHexIds[0]
    }
  }
}
