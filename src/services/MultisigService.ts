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
import {Store} from 'vuex'
import {MultisigAccountGraphInfo, MultisigAccountInfo} from 'symbol-sdk'
import VueI18n from 'vue-i18n'

// internal dependencies
import {AbstractService} from './AbstractService'
import {WalletService} from './WalletService'

export class MultisigService extends AbstractService {

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>, i18n?: VueI18n) {
    super()
    this.name = 'multisig'
    this.$store = store
    this.$i18n = i18n
  }

  /**
   * Returns all available multisig info from a multisig graph
   * @static
   * @param {MultisigAccountGraphInfo} multisig graph info
   * @returns {MultisigAccountInfo[]} multisig info
   */
  public static getMultisigInfoFromMultisigGraphInfo(
    graphInfo: MultisigAccountGraphInfo,
  ): MultisigAccountInfo[] {
    const {multisigAccounts} = graphInfo

    const multisigsInfo = [...multisigAccounts.keys()]
      .sort((a, b) => b - a) // Get addresses from top to bottom
      .map((key) => multisigAccounts.get(key) || [])
      .filter((x) => x.length > 0)

    return [].concat(...multisigsInfo).map(item => item) // flatten
  }

  /**
   * Returns self and signer to be injected in SignerSelector
   * @param {string} label_postfix_multisig
   * @returns {{publicKey: any; label: any;}[]}
   */
  public getSigners(): {publicKey: any, label: any}[] {
    if (!this.$store || !this.$i18n) {
      throw new Error('multisig service getSigners method needs the store and i18n')
    }

    // get the current wallet from the store
    const currentWallet = this.$store.getters['wallet/currentWallet']

    if (!currentWallet) return []

    const self = [
      {
        publicKey: currentWallet.values.get('publicKey'),
        label: currentWallet.values.get('name'),
      },
    ]

    const multisigInfo = this.$store.getters['wallet/currentWalletMultisigInfo']
    if (!multisigInfo) return self

    // in case "self" is a multi-signature account
    if (multisigInfo && multisigInfo.isMultisig()) {
      self[0].label = `${self[0].label}${this.$i18n.t('label_postfix_multisig')}`
    }

    // add multisig accounts of which "self" is a cosignatory
    if (multisigInfo) {
      const service = new WalletService(this.$store)
      const networkType = this.$store.getters['network/networkType']
      return self.concat(...multisigInfo.multisigAccounts.map(
        ({publicKey}) => ({
          publicKey,
          label: `${service.getWalletLabel(publicKey, networkType)}${this.$i18n.t('label_postfix_multisig')}`,
        })))
    }

    return self
  }
}
