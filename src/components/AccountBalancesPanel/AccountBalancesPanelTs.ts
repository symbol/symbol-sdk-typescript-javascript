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
import {MosaicId, Mosaic} from 'symbol-sdk'
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
    currentSigner: 'wallet/currentSigner',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    currentSignerMosaics: 'wallet/currentSignerMosaics',
    isCosignatoryMode: 'wallet/isCosignatoryMode',
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })},
})
export class AccountBalancesPanelTs extends Vue {
  /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Currently active signer
   * @var {any}
   */
  public currentSigner: WalletsModel

  /**
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public currentWalletMosaics: Mosaic[]

  /**
   * Currently active signers's balances
   * @var {Mosaic[]}
   */
  public currentSignerMosaics: Mosaic[]

  /**
   * Whether currently active wallet is in cosignatory mode
   * @var {boolean}
   */
  public isCosignatoryMode: boolean

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
  public get currentMosaics(): Mosaic[] {
    if (this.isCosignatoryMode) {
      return this.currentSignerMosaics
    }

    return this.currentWalletMosaics
  }

  public get currentSignerAddress(): string {
    if (this.isCosignatoryMode && this.currentSigner) {
      return this.currentSigner.values.get('address')
    }

    if (!this.currentWallet) {
      return this.$t('loading').toString()
    }

    return this.currentWallet.values.get('address')
  }

  public get absoluteBalance() {
    const mosaics = [...this.currentMosaics]

    if (!mosaics.length || !this.networkMosaic) {
      return 0
    }

    // - search for network mosaic
    const entry = mosaics.find(
      mosaic => mosaic.id.id.equals(this.networkMosaic.id),
    )

    if (undefined === entry) {
      return 0
    }

    // - format to relative
    return entry.amount.compact()
  }

  public get networkMosaicBalance(): number {
    const balance = this.absoluteBalance
    if (balance === 0 || !this.divisibility) return 0
    return balance / Math.pow(10, this.divisibility)
  }
/// end-region computed properties getter/setter
}
