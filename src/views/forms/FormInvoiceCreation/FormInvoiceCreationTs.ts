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
import {MosaicId, MosaicInfo, Mosaic} from 'nem2-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import FormTransferCreation from '@/views/forms/FormTransferCreation/FormTransferCreation.vue'

@Component({
  components: {
    FormTransferCreation,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    networkMosaic: 'mosaic/networkMosaic',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
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
   * List of known mosaics
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /**
   * Form items
   * @var {any}
   */
  public formItems: any = {}

/// region computed properties getter/setter
/// end-region computed properties getter/setter

  /**
   * Setter for form values
   * @return {void}
   * @emits input
   */
  public onFormChange(formItems: any) {
    this.formItems = formItems
    this.$emit('input', this.formItems)
  }
}
