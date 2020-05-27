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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// configuration
import feesConfig from '@/../config/fees.conf.json'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel'

@Component({
  components: {
    FormLabel,
  },
  computed: {
    ...mapGetters({
      defaultFee: 'app/defaultFee',
      networkMosaicName: 'mosaic/networkMosaicName',
      networkCurrency: 'mosaic/networkCurrency',
    }),
  },
})
export class MaxFeeSelectorTs extends Vue {
  @Prop({
    default: 'form-line-container',
  })
  public className: string

  /**
   * Networks currency mosaic name
   * @var {string}
   */
  private networkMosaicName: string

  /**
   * Known mosaics info
   * @var {MosaicInfo[]}
   */
  private networkCurrency: NetworkCurrencyModel

  /**
   * Default fee setting
   * @var {number}
   */
  private defaultFee: number

  /**
   * The fees to be displayed in the dropw down.
   */
  private fees: { label: string; maxFee: number }[]

  @Prop({
    default: 1,
  })
  multiplier: number

  public created() {
    this.fees = Object.entries(feesConfig).map((entry) => ({ label: this.getLabel(entry), maxFee: entry[1] }))
  }

  private getLabel([key, value]: [string, number]) {
    //SPECIAL VALUES!!!
    if (value == 1 || value == 2) {
      return this.$t('fee_speed_' + key).toString()
    }
    return this.$t('fee_speed_' + key).toString() + ': ' + this.getRelative(value) + ' ' + this.networkMosaicName
  }

  /**
   * Value set by the parent component's v-model
   * @type {number}
   */
  @Prop({
    default: feesConfig.median,
  })
  value: number

  /// region computed properties getter/setter
  /**
   * Value set by the parent component
   * @type {number}
   */
  get chosenMaxFee(): number {
    return this.value || this.defaultFee
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
  public getRelative(amount: number): number {
    if (this.networkCurrency === undefined) {
      return amount
    }
    return amount / Math.pow(10, this.networkCurrency.divisibility)
  }
}
