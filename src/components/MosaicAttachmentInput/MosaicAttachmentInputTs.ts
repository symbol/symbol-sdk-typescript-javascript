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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Mosaic, MosaicId, UInt64} from 'symbol-sdk'

// child components
import {ValidationObserver} from 'vee-validate'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import ButtonRemove from '@/components/ButtonRemove/ButtonRemove.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({
  components: {
    ValidationObserver,
    MosaicSelector,
    AmountInput,
    ButtonRemove,
    FormRow,
  },
})
export class MosaicAttachmentInputTs extends Vue {
  /**
   * Initial value set by the parent
   * @type {{mosaicHex: string, amount: number}}
   */
  @Prop({ default: {mosaicHex: '', amount: 0}, required: true }) mosaicAttachment: {mosaicHex: string, amount: number}
  
  /**
   * Unique Id assigned to this component
   * @type {number}
   */
  @Prop({ default: 0, required: true }) uid: number
  
  /**
   * Hex ids of mosaics to show in options
   * @type {string[]}
   */
  @Prop({ default: [] }) mosaicHexIds: string[]

  /**
   * Whether to show absolute amounts or not
   */
  @Prop({ default: false }) absolute: boolean

  /**
   * the item index in the Array
   */
  @Prop({default:true}) isShowDelete: boolean
  
  /**
   * whether to show the label accord to isFirstItem
   */
  @Prop({default:true}) isFirstItem: boolean
  /**
   * Updated value to sync with the parent formItems
   * @protected 
   * @type {{mosaicHex: string, amount: number}}
   */
  protected chosenValue: {mosaicHex: string, amount: number} = {...this.mosaicAttachment}

  /**
   * Handle mosaic changes from mosaic selection fields
   * @param {string} hex
   */
  public onChangeMosaic(hex: string): void {
    Vue.set(this.chosenValue, 'mosaicHex', hex)
    Vue.nextTick().then(() => this.emitChange())
  }

  /**
   * Handle amount changes from mosaic selection fields
   * @param {number} amount
   */
  public onChangeAmount(amount: number): void {
    Vue.set(this.chosenValue, 'amount', amount)
    Vue.nextTick().then(() => this.emitChange())
  }

  /**
   * Emits input change to the parent
   * @private
   * @return {void}
   */
  private emitChange(): void {
    this.$emit('input-changed', {
      mosaicAttachment: this.chosenValue,
      inputIndex: this.uid,
    })
  }

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    selectedMosaicHex: '',
    relativeAmount: 0,
  }

  /// region computed properties getter/setter
  /**
   * Mosaics to be shown as options
   * @readonly
   * @type {Mosaic[]}
   */
  get mosaics(): Mosaic[] {
    return this.mosaicHexIds.map(hex => new Mosaic(new MosaicId(hex), UInt64.fromUint(0)))
  }

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
    if (!this.formItems.selectedMosaicHex || undefined === this.formItems.relativeAmount) {
      return false
    }

    return true
  }
/// end-region computed properties getter/setter
}
