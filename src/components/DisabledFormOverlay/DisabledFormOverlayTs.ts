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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {MosaicId, MultisigAccountInfo} from 'nem2-sdk'

// internal dependencies
import {NotificationType} from '@/core/utils/NotificationType'
import {WalletsModel} from '@/core/database/models/AppWallet'

@Component({computed: {...mapGetters({
  currentWallet: 'wallet/currentWallet',
  networkMosaic: 'mosaic/networkMosaic',
  multisigInfo: 'wallet/currentMultisigInfo',
})}})
export class DisabledFormOverlayTs extends Vue {
  
  /**
   * Currently active account
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Currently active wallet's multisig info
   * @var {MultisigAccountInfo}
   */
  public multisigInfo: MultisigAccountInfo

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created() {
    await this.$store.dispatch('wallet/REST_FETCH_MULTISIG', this.currentWallet)
  }

/// region computed properties getter/setter
  get alert(): string {
    if (!this.networkMosaic) return NotificationType.NO_NETWORK_CURRENCY
    if (this.multisigInfo.cosignatories.length) return NotificationType.MULTISIG_ACCOUNTS_NO_TX
    return ''
  }
/// end-region computed properties getter/setter
}
