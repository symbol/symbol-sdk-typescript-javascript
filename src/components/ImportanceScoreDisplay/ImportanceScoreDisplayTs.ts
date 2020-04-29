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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {AccountInfo} from 'symbol-sdk'
// internal dependencies
import {mapGetters} from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      'accountsInfo': 'account/accountsInfo',
    }),
  },
})
export class ImportanceScoreDisplayTs extends Vue {

  @Prop({
    default: null,
  }) address: string

  /**
   *
   */
  private accountsInfo: AccountInfo[]

  /// region computed properties getter/setter
  get score(): string {
    const accountInfo = this.accountsInfo.find(k => k.address.plain() === this.address)
    if (!accountInfo) {
      return '0'
    }
    const importance = accountInfo.importance.compact()
    return importance.toString()
  }

/// end-region computed properties getter/setter
}
