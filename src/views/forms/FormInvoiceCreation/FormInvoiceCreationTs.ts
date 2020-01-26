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
import {WalletsModel} from '@/core/database/models/AppWallet'

// child components
// @ts-ignore
import AmountInput from '@/components/AmountInput/AmountInput.vue'
// @ts-ignore
import MosaicBalanceList from '@/components/MosaicBalanceList/MosaicBalanceList.vue'
// @ts-ignore
import MessageInput from '@/components/MessageInput/MessageInput.vue'

@Component({
  components: {
    AmountInput,
    MosaicBalanceList,
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
   * Hex ID of the selected mosaic
   * @var {string}
   */
  public selectedMosaic: string

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.selectedMosaic = this.networkMosaic.toHex()
  }

/// region computed properties getter/setter
/// end-region computed properties getter/setter
}
