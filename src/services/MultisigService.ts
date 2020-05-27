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
import { Address, MultisigAccountGraphInfo, MultisigAccountInfo, NetworkType } from 'symbol-sdk'
// internal dependencies
import { AccountModel } from '@/core/database/entities/AccountModel'
import { Signer } from '@/store/Account'

export class MultisigService {
  /**
   * Returns all available multisig info from a multisig graph
   * @static
   * @param {MultisigAccountGraphInfo} multisig graph info
   * @returns {MultisigAccountInfo[]} multisig info
   */
  public static getMultisigInfoFromMultisigGraphInfo(graphInfo: MultisigAccountGraphInfo): MultisigAccountInfo[] {
    const { multisigAccounts } = graphInfo

    const multisigsInfo = [...multisigAccounts.keys()]
      .sort((a, b) => b - a) // Get addresses from top to bottom
      .map((key) => multisigAccounts.get(key) || [])
      .filter((x) => x.length > 0)

    return [].concat(...multisigsInfo).map((item) => item) // flatten
  }

  public getSigners(
    networkType: NetworkType,
    knownAccounts: AccountModel[],
    currentAccount: AccountModel,
    currentAccountMultisigInfo: MultisigAccountInfo | undefined,
  ): Signer[] {
    if (!currentAccount) return []
    const self: Signer[] = [
      {
        address: Address.createFromRawAddress(currentAccount.address),
        publicKey: currentAccount.publicKey,
        label: currentAccount.name,
        multisig: currentAccountMultisigInfo && currentAccountMultisigInfo.isMultisig(),
        requiredCosignatures: (currentAccountMultisigInfo && currentAccountMultisigInfo.minApproval) || 0,
      },
    ]

    if (!currentAccountMultisigInfo) {
      return self
    }

    return self.concat(
      ...currentAccountMultisigInfo.multisigAccounts.map(({ publicKey, address }) => ({
        address,
        publicKey,
        multisig: true,
        label: this.getAccountLabel(address, knownAccounts),
        requiredCosignatures: (currentAccountMultisigInfo && currentAccountMultisigInfo.minApproval) || 0,
      })),
    )
  }

  private getAccountLabel(address: Address, accounts: AccountModel[]): string {
    const account = accounts.find((wlt) => address.plain() === wlt.address)
    return (account && account.name) || address.plain()
  }
}
