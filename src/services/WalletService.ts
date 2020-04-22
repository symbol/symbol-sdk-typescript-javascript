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
import {Account, Address, EncryptedPrivateKey, NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {ExtendedKey, MnemonicPassPhrase, Wallet} from 'symbol-hd-wallets'
// internal dependencies
import {DerivationPathLevels, DerivationService} from './DerivationService'
import {DerivationPathValidator} from '@/core/validation/validators'
import {WalletModel, WalletType} from '@/core/database/entities/WalletModel'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'

export class WalletService {

  private readonly storage = new SimpleObjectStorage<Record<string, WalletModel>>('wallets')

  /**
   * Default wallet derivation path
   * @var {string}
   */
  public static readonly DEFAULT_WALLET_PATH = 'm/44\'/4343\'/0\'/0\'/0\''


  public getWallets(): WalletModel[] {
    return Object.values(this.getWalletsById())
  }

  public getWallet(id: string): WalletModel | undefined {
    return this.getWalletsById()[id]
  }

  public getWalletsById(): Record<string, WalletModel> {
    return this.storage.get() || {}
  }

  public saveWallet(wallet: WalletModel): WalletModel {
    const wallets = this.getWalletsById()
    wallets[wallet.id] = wallet
    this.storage.set(wallets)
    return wallet
  }


  public updateName(wallet: WalletModel, name: string): WalletModel {
    return this.saveWallet(Object.assign(wallet, {name}))
  }


  /**
   * Derive \a path using \a mnemonic pass phrase
   */
  public getAccountByPath(mnemonic: MnemonicPassPhrase, networkType: NetworkType,
    path: string = WalletService.DEFAULT_WALLET_PATH): Account {
    if (false === DerivationPathValidator.validate(path)) {
      const errorMessage = 'Invalid derivation path: ' + path
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    // create hd extended key
    const extendedKey = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'))

    // create wallet
    const wallet = new Wallet(extendedKey)
    return wallet.getChildAccount(path, networkType) as unknown as Account
  }

  /**
   * Get extended key around \a mnemonic for \a networkTypw
   * @param {MnemonicPassPhrase} mnemonic
   * @return {ExtendedKey}
   */
  public getExtendedKeyFromMnemonic(mnemonic: MnemonicPassPhrase): ExtendedKey {
    return ExtendedKey.createFromSeed(
      mnemonic.toSeed().toString('hex'),
    )
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
    count: number = 10,
  ): Account[] {
    const derivationService = new DerivationService()

    // create hd extended key
    const xkey = this.getExtendedKeyFromMnemonic(mnemonic)

    // increment derivation path \a count times
    const paths = [...Array(count).keys()].map(index => {
      if (index == 0) return WalletService.DEFAULT_WALLET_PATH

      return derivationService.incrementPathLevel(
        WalletService.DEFAULT_WALLET_PATH,
        DerivationPathLevels.Account,
        index,
      )
    })

    const wallets = paths.map(path => new Wallet(xkey.derivePath(path)))
    return wallets.map(wallet => wallet.getAccount(networkType) as unknown as Account)
  }

  /**
   * Generate accounts using a mnemonic and an array of paths
   * @param {MnemonicPassPhrase} mnemonic
   * @param {NetworkType} networkType
   * @param {string[]} paths
   * @returns {Account[]}
   */
  public generateAccountsFromPaths(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
    paths: string[],
  ): Account[] {
    // create hd extended key
    const xkey = this.getExtendedKeyFromMnemonic(mnemonic)
    const wallets = paths.map(path => new Wallet(xkey.derivePath(path)))

    return wallets.map(wallet => wallet.getAccount(networkType) as unknown as Account)
  }

  /**
   * Get list of addresses using \a mnemonic
   * @return {Address[]}
   */
  public getAddressesFromMnemonic(
    mnemonic: MnemonicPassPhrase,
    networkType: NetworkType,
    count: number = 10,
  ): Address[] {
    const accounts = this.generateAccountsFromMnemonic(mnemonic, networkType, count)
    return accounts.map(acct => acct.address)
  }


  public getKnownWallets(knownWallets: string[]): WalletModel[] {
    // search in known wallets
    return this.getWallets().filter(wlt => knownWallets.includes(wlt.id))
  }


  /**
   * Create a wallet instance from mnemonic
   * @return {WalletModel}
   */
  public getDefaultWallet(
    currentAccount: AccountModel,
    mnemonic: MnemonicPassPhrase,
    password: Password,
    networkType: NetworkType,
  ): WalletModel {
    const account = this.getAccountByPath(
      mnemonic,
      networkType,
      WalletService.DEFAULT_WALLET_PATH,
    )

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      'SeedWallet 1',
      password,
      account.privateKey,
      networkType,
    )


    return {
      id: SimpleObjectStorage.generateIdentifier(),
      accountName: currentAccount.accountName,
      name: 'Seed Account 1',
      node: '',
      type: WalletType.fromDescriptor('Seed'),
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encPrivate: simpleWallet.encryptedPrivateKey.encryptedKey,
      encIv: simpleWallet.encryptedPrivateKey.iv,
      path: WalletService.DEFAULT_WALLET_PATH,
      isMultisig: false,
    }

  }

  /**
   * Create a child wallet instance from mnemonic and path
   * @return {WalletModel}
   */
  public getChildWalletByPath(
    currentAccount: AccountModel,
    password: Password,
    mnemonic: MnemonicPassPhrase,
    nextPath: string,
    networkType: NetworkType,
    childWalletName: string,
  ): WalletModel {

    // - derive account
    const account = this.getAccountByPath(
      mnemonic,
      networkType,
      nextPath,
    )

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      childWalletName,
      password,
      account.privateKey,
      networkType,
    )

    return {
      id: SimpleObjectStorage.generateIdentifier(),
      accountName: currentAccount.accountName,
      name: childWalletName,
      node: '',
      type: WalletType.SEED,
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encPrivate: simpleWallet.encryptedPrivateKey.encryptedKey,
      encIv: simpleWallet.encryptedPrivateKey.iv,
      path: nextPath,
      isMultisig: false,
    }
  }

  /**
   * Create a sub wallet by private key
   * @param currentAccount
   * @param password
   * @param childWalletName
   * @param privateKey
   * @param networkType
   * @return {WalletModel}
   */
  public getSubWalletByPrivateKey(
    currentAccount: AccountModel,
    password: Password,
    childWalletName: string,
    privateKey: string,
    networkType: NetworkType,
  ): WalletModel {
    const account = Account.createFromPrivateKey(privateKey, networkType)
    const simpleWallet = SimpleWallet.createFromPrivateKey(
      childWalletName,
      password,
      account.privateKey,
      networkType,
    )

    return {
      id: SimpleObjectStorage.generateIdentifier(),
      accountName: currentAccount.accountName,
      name: childWalletName,
      node: '',
      type: WalletType.PRIVATE_KEY,
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encPrivate: simpleWallet.encryptedPrivateKey.encryptedKey,
      encIv: simpleWallet.encryptedPrivateKey.iv,
      path: '',
      isMultisig: false,
    }
  }


  /**
   * Returns a WalletsModel with an updated SimpleWallet
   * @param {string} walletIdentifier
   * @param {Password} oldPassword
   * @param {Password} newPassword
   */
  public updateWalletPassword(wallet: WalletModel, oldPassword: Password, newPassword: Password): WalletModel {
    // Password modification is not allowed for hardware wallets
    if (wallet.type !== WalletType.SEED
      && wallet.type !== WalletType.PRIVATE_KEY) {
      throw new Error('Hardware wallet password cannot be changed')
    }
    // Get the private key
    const encryptedPrivateKey = new EncryptedPrivateKey(wallet.encPrivate, wallet.encIv)

    const privateKey = encryptedPrivateKey.decrypt(oldPassword)

    // Encrypt the private key with the new password
    const newSimpleWallet = SimpleWallet.createFromPrivateKey(
      wallet.name,
      newPassword,
      privateKey,
      WalletModel.getObjects(wallet).address.networkType,
    )
    // Update the wallet model
    return {
      ...wallet, encPrivate: newSimpleWallet.encryptedPrivateKey.encryptedKey,
      encIv: newSimpleWallet.encryptedPrivateKey.iv,
    }
  }
}
