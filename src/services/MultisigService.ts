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
import {Address, MultisigAccountGraphInfo, MultisigAccountInfo, NetworkType} from 'symbol-sdk'
// internal dependencies
import {WalletModel} from '@/core/database/entities/WalletModel'
import {Signer} from '@/store/Wallet'

export class MultisigService {

  /**
   * Returns all available multisig info from a multisig graph
   * @static
   * @param {MultisigAccountGraphInfo} multisig graph info
   * @returns {MultisigAccountInfo[]} multisig info
   */
  public static getMultisigInfoFromMultisigGraphInfo(graphInfo: MultisigAccountGraphInfo): MultisigAccountInfo[] {
    const {multisigAccounts} = graphInfo

    const multisigsInfo = [...multisigAccounts.keys()]
      .sort((a, b) => b - a) // Get addresses from top to bottom
      .map((key) => multisigAccounts.get(key) || [])
      .filter((x) => x.length > 0)

    return [].concat(...multisigsInfo).map(item => item) // flatten
  }


  public getSigners(networkType: NetworkType,
    knownWallets: WalletModel[],
    currentWallet: WalletModel,
    currentWalletMultisigInfo: MultisigAccountInfo | undefined): Signer[] {
    if (!currentWallet) return []
    const self: Signer[] = [
      {
        address: Address.createFromRawAddress(currentWallet.address),
        publicKey: currentWallet.publicKey,
        label: currentWallet.name,
        multisig: currentWalletMultisigInfo && currentWalletMultisigInfo.isMultisig(),
      },
    ]

    if (!currentWalletMultisigInfo) {
      return self
    }

    return self.concat(...currentWalletMultisigInfo.multisigAccounts.map(
      ({publicKey, address}) => ({
        address,
        publicKey,
        multisig: true,
        label: this.getWalletLabel(address, knownWallets),
      })))

  }


  private getWalletLabel(address: Address, wallets: WalletModel[]): string {
    const wallet = wallets.find(wlt => address.plain() === wlt.address)
    return wallet && wallet.name || address.plain()
  }
}
