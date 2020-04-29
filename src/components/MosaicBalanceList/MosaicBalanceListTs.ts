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
import {MosaicId, NamespaceId} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// resources
import {dashboardImages} from '@/views/resources/Images'
import {MosaicService} from '@/services/MosaicService'
import {MosaicConfigurationModel} from '@/core/database/entities/MosaicConfigurationModel'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

export interface BalanceEntry {
  id: MosaicId
  name: string
  amount: number
  mosaic: MosaicModel
}

@Component({
  components: {
    MosaicAmountDisplay,
  },
  computed: {
    ...mapGetters({
      mosaicConfigurations: 'mosaic/mosaicConfigurations',
      balanceMosaics: 'mosaic/balanceMosaics',
      networkMosaic: 'mosaic/networkMosaic',
      currentHeight: 'network/currentHeight',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class MosaicBalanceListTs extends Vue {

  /**
   * Dashboard images
   * @var {any}
   */
  protected dashboardImages: Record<string, any> = dashboardImages

  /**
   * Networks 1currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Network mosaics info (all)
   * @var {MosaicInfo[]}
   */
  public balanceMosaics: MosaicModel[]

  /**
   * List of mosaics that are hidden
   * @var {string[]}
   */
  public mosaicConfigurations: Record<string, MosaicConfigurationModel>

  /**
   * Whether the component is in edition mode
   * @var {boolean}
   */
  public isEditionMode: boolean = false

  public currentHeight: number

  private networkConfiguration: NetworkConfigurationModel


  /// region computed properties getter/setter
  /**
   * Balance entries from the currently active account's mosaics
   * @readonly
   * @type {BalanceEntry}
   */
  get balanceEntries(): BalanceEntry[] {
    return this.balanceMosaics.map(mosaic => {
      return {
        id: new MosaicId(mosaic.mosaicIdHex),
        name: mosaic.name || mosaic.mosaicIdHex,
        amount: (mosaic.balance || 0),
        mosaic: mosaic,
      }
    })
  }

  /**
   * All balance entries except expired mosaics
   * @readonly
   * @type {BalanceEntry[]}
   */
  get allBalanceEntries(): BalanceEntry[] {
    return this.balanceEntries.filter((entry) => {
      // calculate expiration
      const expiration = MosaicService.getExpiration(entry.mosaic, this.currentHeight,
        this.networkConfiguration.blockGenerationTargetTime)
      // skip if mosaic is expired
      return expiration !== 'expired'
    })
  }

  /**
   * Balance entries of active and not hidden mosaics
   * @readonly
   * @type {BalanceEntry[]}
   */
  get filteredBalanceEntries(): BalanceEntry[] {
    // filter out hidden mosaics
    return this.allBalanceEntries.filter(
      entry => {
        return !this.isMosaicHidden(entry.id)
      },
    )
  }

  /// end-region computed properties getter/setter

  /**
   * Returns true when mosaic \a mosaicId is hidden
   * @param {MosaicId} mosaicId
   * @return {boolean}
   */
  public isMosaicHidden(mosaicId: MosaicId | NamespaceId): boolean {
    const mosaicConfiguration = this.mosaicConfigurations[mosaicId.toHex()]
    return mosaicConfiguration && mosaicConfiguration.hidden
  }

  /**
   * Returns true if no mosaic is hidden
   * @returns {boolean}
   */
  public areAllMosaicsShown(): boolean {
    return !Object.values(this.mosaicConfigurations).find(c => c.hidden)
  }

  /**
   * Toggle whether all mosaics are shown or hidden
   * @return {void}
   */
  public toggleMosaicDisplay(mosaicId?: MosaicId | NamespaceId) {
    // - clicked singular checkbox
    if (mosaicId !== undefined) {
      const isHidden = this.isMosaicHidden(mosaicId)
      const action = isHidden ? 'SHOW_MOSAIC' : 'HIDE_MOSAIC'
      return this.$store.dispatch('mosaic/' + action, mosaicId)
    }

    // - update state
    const action = this.areAllMosaicsShown() ? 'HIDE_MOSAIC' : 'SHOW_MOSAIC'
    return this.balanceMosaics.forEach(
      mosaic => this.$store.dispatch('mosaic/' + action, new MosaicId(mosaic.mosaicIdHex)),
    )
  }
}
