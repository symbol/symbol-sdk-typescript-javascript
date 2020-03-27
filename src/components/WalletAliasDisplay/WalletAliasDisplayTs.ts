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
// external dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {NamespaceInfo} from 'symbol-sdk'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'

@Component({
  computed: mapGetters({
    namespacesInfo: 'namespace/namespacesInfo',
    namespacesNames: 'namespace/namespacesNames',
  }),
})
export class WalletAliasDisplayTs extends Vue {
  @Prop({ default: null }) wallet: WalletsModel

  /**
   * Namespaces info
   * @protected
   * @type {Record<string, NamespaceInfo>}
   */
  protected namespacesInfo: Record<string, NamespaceInfo>

  /**
   * Namespaces names
   * @protected
   * @type {Record<string, string>}
   */
  protected namespacesNames: Record<string, string>

  get walletAliases(): string[] {
    if (!this.namespacesInfo || !this.wallet) return []

    // get an array of namespaceInfo
    const namespacesInfo = Object.values(this.namespacesInfo)

    // get the current wallet address
    const address = this.wallet.values.get('address')

    // return the current wallet aliases
    return namespacesInfo
      .filter(({alias}) => alias.address && alias.address.plain() === address)
      .map(({id}) => this.namespacesNames[id.toHex()] || id.toHex())
  }
}
