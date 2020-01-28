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
import {MosaicId, Mosaic} from 'nem2-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import MosaicSelector from '@/components/MosaicSelector/MosaicSelector.vue'
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue'

@Component({
  components: {
    AmountInput,
    MosaicSelector,
    MessageInput,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    networkMosaic: 'mosaic/networkMosaic',
  })}
})
export class FormInvoiceCreationTs extends Vue {
  /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public currentWalletMosaics: Mosaic[]

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Form items
   * @var {any}
   */
  public formItems = {
    mosaicId: '',
    amount: 0,
    message: '',
  }

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.formItems.mosaicId = this.networkMosaic.toHex()
  }

/// region computed properties getter/setter
  public get selectedMosaic(): string { return this.getter('mosaicId') }
  public set selectedMosaic(mosaicHex: string) { this.setter('mosaicId', mosaicHex) }

  public get amount(): number { return this.getter('amount') }
  public set amount(amount: number) { this.setter('amount', amount) }

  public get message(): string { return this.getter('message') }
  public set message(message: string) { this.setter('message', message) }
/// end-region computed properties getter/setter

  /**
   * Helper for form field getter definition
   * @param {string} field 
   * @return {any}
   */
  protected getter(field: string): any {
    return this.formItems[field]
  }

  /**
   * Helper for form field setter definition
   * @param {string} field 
   * @param {any} value
   * @return {void}
   * @emits change
   */
  protected setter(field: string, value: any) {
    this.formItems[field] = value
    this.$emit('change', this.formItems)
  }
}
