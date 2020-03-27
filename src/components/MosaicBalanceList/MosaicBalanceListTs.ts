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
import {MosaicId, MosaicInfo, Mosaic, NamespaceId} from 'symbol-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {MosaicService} from '@/services/MosaicService'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

// resources
import {dashboardImages} from '@/views/resources/Images' 
import {BalanceEntry} from '@/core/database/entities/MosaicsModel'

@Component({
  components: {
    MosaicAmountDisplay,
  },
  computed: {...mapGetters({
    hiddenMosaics: 'mosaic/hiddenMosaics',
    mosaicsInfo: 'mosaic/mosaicsInfo',
    mosaicsNames: 'mosaic/mosaicsNames',
    networkMosaic: 'mosaic/networkMosaic',
  })},
})
export class MosaicBalanceListTs extends Vue {

  @Prop({
    default: [],
  }) mosaics: Mosaic[]

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
  public mosaicsInfo: MosaicInfo[]

  /**
   * List of mosaics that are hidden
   * @var {string[]}
   */
  public hiddenMosaics: string[]

  /**
   * Mosaic service
   * @var {MosaicService}
   */
  public mosaicService: MosaicService = new MosaicService(this.$store)

  /**
   * Whether the component is in edition mode
   * @var {boolean}
   */
  public isEditionMode: boolean = false

  /**
   * Formatted balance entries
   * @var {any}
   */
  public formatted: any[] = []

  /**
   * Form items
   * @var {any}
   */
  public formItems: any = {
    name: '',
    hasShowExpired: false,
  }

  /**
   * Mosaic names
   * @private
   * @type {Record<string, string>}
   */
  private mosaicsNames: Record<string, string>


  /// region computed properties getter/setter
  /**
   * Balance entries from the currently active wallet's mosaics
   * @readonly
   * @type {BalanceEntry}
   */
  get balanceEntries(): BalanceEntry[] {
    return this.mosaics.map(mosaic => {
      const mosaicInfo = this.mosaicsInfo[mosaic.id.toHex()]
      // if mosaicInfo is unavailable, skip and wait for re-render
      if (!mosaicInfo) return null

      return {
        id: mosaic.id as MosaicId,
        name: this.mosaicsNames[mosaic.id.toHex()] || '',
        amount: mosaic
          ? mosaic.amount.compact() / Math.pow(10, mosaicInfo.divisibility)
          : 0,
      }
    }).filter(x => x) // filter out mosaics without info available
  }

  /**
   * All balance entries except expired mosaics
   * @readonly
   * @type {BalanceEntry[]}
   */
  get allBalanceEntries(): BalanceEntry[] {
    // get mosaicService
    const mosaicService = new MosaicService(this.$store)

    return this.balanceEntries.filter((entry) => {
      // get mosaic info
      const mosaicInfo = this.mosaicsInfo[entry.id.toHex()]
      // skip if mosaic info is not available
      if (!mosaicInfo) return false

      // calculate expiration
      const expiration = mosaicService.getExpiration(mosaicInfo)
      // skip if mosaic is expired
      if (expiration === 'expired') return false

      return true
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
      entry => this.hiddenMosaics.indexOf(entry.id.toHex()) === -1,
    )
  }
  /// end-region computed properties getter/setter

  /**
   * Returns true when mosaic \a mosaicId is hidden
   * @param {MosaicId} mosaicId 
   * @return {boolean}
   */
  public isMosaicHidden(mosaicId: MosaicId | NamespaceId): boolean {
    return this.hiddenMosaics.indexOf(mosaicId.toHex()) > -1
  }

  /**
   * Returns true if no mosaic is hidden
   * @returns {boolean}
   */
  public areAllMosaicsShown(): boolean {
    return this.hiddenMosaics.length === 0
  }

  /**
   * Toggle whether all mosaics are shown or hidden
   * @return {void}
   */
  public toggleMosaicDisplay(mosaicId?: MosaicId| NamespaceId) {
    // - clicked singular checkbox
    if (mosaicId !== undefined) {
      const isHidden = this.isMosaicHidden(mosaicId)
      const action = isHidden ? 'SHOW_MOSAIC' : 'HIDE_MOSAIC'
      return this.$store.dispatch(`mosaic/${action}`, mosaicId)
    }

    // - update state
    const action = this.areAllMosaicsShown() ? 'HIDE_MOSAIC' : 'SHOW_MOSAIC'
    return this.mosaics.forEach(
      mosaic => this.$store.dispatch(`mosaic/${action}`, mosaic.id),
    )
  }

  /**
   * Hook called when the component is mounted
   */
  mounted() {
    // refresh mosaic models
    this.mosaicService.refreshMosaicModels(this.mosaics)
  }
}
