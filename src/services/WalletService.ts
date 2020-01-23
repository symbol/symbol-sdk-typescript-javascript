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
import {Account, Address, NetworkType} from 'nem2-sdk'
import {
  ExtendedKey,
  MnemonicPassPhrase,
  Network,
  NodeEd25519,
  Wallet,
} from 'nem2-hd-wallets'

// internal dependencies
import {AbstractService} from './AbstractService'
import {DerivationService, DerivationPathLevels} from './DerivationService'
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
   * Default wallet derivation path
   * @var {string}
   */
  public static readonly DEFAULT_WALLET_PATH = 'm/44\'/43\'/0\'/0\'/0\''

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
  public getAccountByPath(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
    path: string = WalletService.DEFAULT_WALLET_PATH,
  ): Account {
    if (! new DerivationPathValidator().validate(path)) {
      const errorMessage = 'Invalid derivation path: ' + path
      this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
    }

    // create hd extended key
    const network = getNetworkFromNetworkType(networkType)
    const extendedKey = ExtendedKey.createFromSeed(mnemonic.toSeed().toString(), network)

    // create wallet
    const wallet = new Wallet(extendedKey)
    return wallet.getChildAccount(path, networkType)
  }

  /**
   * Get extended key around \a mnemonic for \a networkTypw
   * @param {MnemonicPassPhrase} mnemonic 
   * @param {NetworkType} networkType 
   * @return {ExtendedKey}
   */
  public getExtendedKeyFromMnemonic(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
  ): ExtendedKey {
    return ExtendedKey.createFromSeed(
      mnemonic.toSeed().toString(),
      getNetworkFromNetworkType(networkType)
    )
  }

  /**
   * Get extended key around \a account for \a networkTypw
   * @param {MnemonicPassPhrase} mnemonic 
   * @param {NetworkType} networkType 
   * @return {ExtendedKey}
   */
  public getExtendedKeyFromAccount(
    account: Account,
    networkType: NetworkType,
  ): ExtendedKey {
    // create HD node using curve ED25519
    const nodeEd25519 = new NodeEd25519(
      Buffer.from(account.privateKey),
      undefined, // publicKey
      Buffer.from(''), // chainCode
      getNetworkFromNetworkType(networkType)
    )
    return new ExtendedKey(nodeEd25519, nodeEd25519.network)
  }

  /**
   * Generate \a count accounts using \a mnemonic
   * @param {MnemonicPassPhrase} mnemonic
   * @param {NetworkType} networkType
   * @param {string} startPath
   * @param {number} count
   * @return {Account[]}
   */
  public generateAccountsFromMnemonic(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
    startPath: string = WalletService.DEFAULT_WALLET_PATH,
    count: number = 10,
  ): Account[] {
    const helpers = new DerivationService(this.$store)

    // create hd extended key
    const xkey = this.getExtendedKeyFromMnemonic(mnemonic, networkType)

    // increment derivation path \a count times
    let current = startPath
    const paths = [...Array(count).keys()].map(
      index => count === 0 ? current : (current = helpers.incrementPathLevel(current, DerivationPathLevels.Account))
    )

    const wallets = paths.map(path => new Wallet(xkey.derivePath(path)))
    return wallets.map(wallet => wallet.getAccount(networkType))
  }

  /**
   * Get list of addresses using \a mnemonic
   * @return {Address[]}
   */
  public getAddressesFromMnemonic(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
    startPath: string = WalletService.DEFAULT_WALLET_PATH,
    count: number = 10,
  ): Address[] {
    const accounts = this.generateAccountsFromMnemonic(mnemonic, networkType, startPath, count)
    return accounts.map(acct => acct.address)
  }
}
