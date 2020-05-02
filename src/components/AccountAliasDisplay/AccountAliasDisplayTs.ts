/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel'
import { NamespaceModel } from '@/core/database/entities/NamespaceModel'

@Component({
  computed: mapGetters({
    namespaces: 'namespace/namespaces',
  }),
})
export class AccountAliasDisplayTs extends Vue {
  @Prop({ default: null }) account: AccountModel

  /**
   * NamespaceModel
   */
  protected namespaces: NamespaceModel[]

  get accountAliases(): string[] {
    if (!this.namespaces || !this.account) return []

    // get the current account address
    const address = this.account.address

    // return the current account aliases
    return this.namespaces
      .filter(({ aliasTargetAddressRawPlain }) => aliasTargetAddressRawPlain && aliasTargetAddressRawPlain === address)
      .map(({ name, namespaceIdHex }) => name || namespaceIdHex)
  }
}
