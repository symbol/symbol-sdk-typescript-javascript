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
import {Component, Vue, Prop} from 'vue-property-decorator'
import {AccountInfo} from 'symbol-sdk'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {mapGetters} from 'vuex'

@Component({
  computed: {...mapGetters({
    'knownWalletsInfo': 'wallet/knownWalletsInfo',
  })},
})
export class ImportanceScoreDisplayTs extends Vue {

  @Prop({
    default: null,
  }) wallet: WalletsModel

  /**
   * 
   */
  public knownWalletsInfo: any

  /// region computed properties getter/setter
  get score(): string {
    const addr = Object.keys(this.knownWalletsInfo).find(k => k === this.wallet.objects.address.plain())
    if (undefined === addr) {
      return '0'
    }

    const accountInfo: AccountInfo = this.knownWalletsInfo[addr]
    const importance = accountInfo.importance.compact()
    return importance.toString()
  }
/// end-region computed properties getter/setter
}
