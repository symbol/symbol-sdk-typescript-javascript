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
import {MosaicId, MosaicInfo} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// child components
import {ValidationObserver} from 'vee-validate'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import ButtonAdd from '@/components/ButtonAdd/ButtonAdd.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'

@Component({
  components: {
    ValidationObserver,
    MosaicSelector,
    AmountInput,
    ButtonAdd,
    FormRow,
  },
  computed: {...mapGetters({
    networkMosaic: 'mosaic/networkMosaic',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
    mosaicsNames: 'mosaic/mosaicsNames',
  })}
})
export class MosaicAttachmentInputTs extends Vue {

  @Prop({
    default: [],
  }) mosaics: MosaicsModel[]

  /**
   * Whether to show absolute amounts or not
   */
  @Prop({
    default: false
  }) absolute: boolean

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
   * List of known mosaics names
   * @var {any}
   */
  public mosaicsNames: any

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    selectedMosaicHex: '',
    relativeAmount: 0,
  }

/// region computed properties getter/setter
  get selectedMosaic(): string {
    return this.formItems.selectedMosaicHex
  }

  set selectedMosaic(hex: string) {
    this.formItems.selectedMosaicHex = hex
  }

  get relativeAmount(): number {
    return this.formItems.relativeAmount
  }

  set relativeAmount(amount: number) {
    this.formItems.relativeAmount = amount
  }

  get canClickAdd(): boolean {
    if (!this.formItems.selectedMosaicHex
        || undefined === this.formItems.relativeAmount) {
      return false
    }

    return true
  }
/// end-region computed properties getter/setter

  public onChangeMosaic(hex: string) {
    this.selectedMosaic = hex
  }

  public onClickAdd() {
    if (!this.canClickAdd) return

    this.$emit('add', {
      mosaicHex: this.selectedMosaic,
      amount: parseFloat(`${this.relativeAmount}`),
    })
  }
}
