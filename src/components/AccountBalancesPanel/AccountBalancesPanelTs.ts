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
import {MosaicId, Mosaic, MosaicRestrictionTransactionService} from 'nem2-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {UIHelpers} from '@/core/utils/UIHelpers'
import {MosaicService} from '@/services/MosaicService'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// @ts-ignore
import MosaicBalanceList from '@/components/MosaicBalanceList/MosaicBalanceList.vue'

@Component({
  components: {
    MosaicAmountDisplay,
    MosaicBalanceList,
  },
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })}
})
export class AccountBalancesPanelTs extends Vue {
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
   * Currency mosaic's ticker
   * @var {string}
   */
  public networkMosaicTicker: string

  /**
   * UI Helpers
   * @var {UIHelpers}
   */
  public uiHelpers = UIHelpers

  /**
   * The current wallet's network mosaic balance (RELATIVE)
   * @var {number}
   */
  public networkMosaicBalance: number = 0

  public async created() {
    const service = new MosaicService(this.$store)
    const balance = this.absoluteBalance
    this.networkMosaicBalance = await service.getRelativeAmount(balance, this.networkMosaic)
  }

/// region computed properties getter/setter
  public get absoluteBalance() {
    if (!this.currentWallet || !this.currentWalletMosaics.length) {
      return 0
    }

    // - search for network mosaic
    const entry = this.currentWalletMosaics.filter(
      mosaic => mosaic.id.equals(this.networkMosaic)
    )

    if (!entry.length) {
      return 0
    }

    // - format to relative
    return entry.shift().amount.compact()
  }
/// end-region computed properties getter/setter
}
