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
import {Account, NetworkType} from 'nem2-sdk'
import {Network, MnemonicPassPhrase, ExtendedKey, Wallet} from 'nem2-hd-wallets'

// internal dependencies
import {AbstractService} from './AbstractService'
import {DerivationPathValidator} from '@/core/validators/DerivationPathValidator'

const getNetworkFromNetworkType = (networkType: NetworkType): Network => {
  if (undefined !== [NetworkType.MIJIN, NetworkType.MIJIN_TEST].find(type => networkType === type)) {
      return Network.CATAPULT
  }

  return Network.CATAPULT_PUBLIC
}

export class WalletService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'wallet'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
  }

  /**
   * Derive \a path using \a mnemonic pass phrase
   * @param {MnemonicPassPhrase} mnemonic 
   * @param {string} path 
   * @param {NetworkType} networkType 
   * @return {Account}
   */
  static getAccountByPath(
    mnemonic: MnemonicPassPhrase,
    path: string,
    networkType: NetworkType,
  ): Account {
    if (! new DerivationPathValidator().validate(path)) {
      throw new Error('Invalid derivation path: ' + path)
    }

    // create hd extended key
    const network = getNetworkFromNetworkType(networkType)
    const extendedKey = ExtendedKey.createFromSeed(mnemonic.toSeed().toString(), network)

    // create wallet
    const wallet = new Wallet(extendedKey)
    return wallet.getChildAccount(path, networkType)
  }
}
