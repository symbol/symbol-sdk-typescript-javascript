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
import {MosaicId, Mosaic, MosaicInfo} from 'nem2-sdk'
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
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'

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

  private mosaicService: MosaicService = new MosaicService(this.$store)


  /**
   * collection of known mosaics from database
   * @readonly
   * @protected
   * @type {MosaicsModel[]}
   */
  protected get allMosaics(): MosaicsModel[] {
    return this.mosaicService.getMosaics()
  }

  /**
   * Network mosaic divisibility
   * @readonly
   * @protected
   * @type {number}
   */
  protected get divisibility(): number {
    if (!this.networkMosaic) return null
    const networkMosaicId = this.networkMosaic.id.toHex()
    const networkMosaicModel = this.allMosaics.find(m => m.getIdentifier() === networkMosaicId)
    if (networkMosaicModel === undefined) return null
    return networkMosaicModel.values.get('divisibility')
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

  public get networkMosaicBalance(): number {
    const balance = this.absoluteBalance
    if (balance === 0 || !this.divisibility) return 0
    return balance / Math.pow(10, this.divisibility)
  }
/// end-region computed properties getter/setter
}
