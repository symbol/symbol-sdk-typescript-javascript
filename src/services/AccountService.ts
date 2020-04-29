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
import {Account, Address, NetworkType, Password, SimpleWallet, Crypto} from 'symbol-sdk'
import {ExtendedKey, MnemonicPassPhrase, Wallet} from 'symbol-hd-wallets'
// internal dependencies
import {DerivationPathLevels, DerivationService} from './DerivationService'
import {DerivationPathValidator} from '@/core/validation/validators'
import {AccountModel, AccountType} from '@/core/database/entities/AccountModel'
import {ProfileModel} from '@/core/database/entities/ProfileModel'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'
import {AccountModelStorage} from '@/core/database/storage/AccountModelStorage'

export class AccountService {

  private readonly storage = AccountModelStorage.INSTANCE

  /**
   * Default account derivation path
   * @var {string}
   */
  public static readonly DEFAULT_ACCOUNT_PATH = 'm/44\'/4343\'/0\'/0\'/0\''


  public getAccounts(): AccountModel[] {
    return Object.values(this.getAccountsById())
  }

  public getAccount(id: string): AccountModel | undefined {
    return this.getAccountsById()[id]
  }

  public getAccountsById(): Record<string, AccountModel> {
    return this.storage.get() || {}
  }

  public saveAccount(account: AccountModel): AccountModel {
    const accounts = this.getAccountsById()
    accounts[account.id] = account
    this.storage.set(accounts)
    return account
  }


  public updateName(account: AccountModel, name: string): AccountModel {
    return this.saveAccount(Object.assign(account, {name}))
  }


  /**
   * Derive \a path using \a mnemonic pass phrase
   */
  public getAccountByPath(mnemonic: MnemonicPassPhrase, networkType: NetworkType,
    path: string = AccountService.DEFAULT_ACCOUNT_PATH): Account {
    if (false === DerivationPathValidator.validate(path)) {
      const errorMessage = 'Invalid derivation path: ' + path
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    // create hd extended key
    const extendedKey = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'))

    // create account
    const account = new Wallet(extendedKey)
    return account.getChildAccount(path, networkType) as unknown as Account
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
      if (index == 0) return AccountService.DEFAULT_ACCOUNT_PATH

      return derivationService.incrementPathLevel(
        AccountService.DEFAULT_ACCOUNT_PATH,
        DerivationPathLevels.Profile,
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


  public getKnownAccounts(knownAccounts: string[]): AccountModel[] {
    // search in known accounts
    return this.getAccounts().filter(wlt => knownAccounts.includes(wlt.id))
  }


  /**
   * Create a account instance from mnemonic
   * @return {AccountModel}
   */
  public getDefaultAccount(
    currentProfile: ProfileModel,
    mnemonic: MnemonicPassPhrase,
    password: Password,
    networkType: NetworkType,
  ): AccountModel {
    const account = this.getAccountByPath(
      mnemonic,
      networkType,
      AccountService.DEFAULT_ACCOUNT_PATH,
    )

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      'Seed Account 1',
      password,
      account.privateKey,
      networkType,
    )


    return {
      id: SimpleObjectStorage.generateIdentifier(),
      profileName: currentProfile.profileName,
      name: simpleWallet.name,
      node: '',
      type: AccountType.SEED,
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
      path: AccountService.DEFAULT_ACCOUNT_PATH,
      isMultisig: false,
    }

  }

  /**
   * Create a child account instance from mnemonic and path
   * @return {AccountModel}
   */
  public getChildAccountByPath(
    currentProfile: ProfileModel,
    password: Password,
    mnemonic: MnemonicPassPhrase,
    nextPath: string,
    networkType: NetworkType,
    childAccountName: string,
  ): AccountModel {

    // - derive account
    const account = this.getAccountByPath(
      mnemonic,
      networkType,
      nextPath,
    )

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      childAccountName,
      password,
      account.privateKey,
      networkType,
    )

    return {
      id: SimpleObjectStorage.generateIdentifier(),
      profileName: currentProfile.profileName,
      name: childAccountName,
      node: '',
      type: AccountType.SEED,
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
      path: nextPath,
      isMultisig: false,
    }
  }

  /**
   * Create a sub account by private key
   * @param currentProfile
   * @param password
   * @param childAccountName
   * @param privateKey
   * @param networkType
   * @return {AccountModel}
   */
  public getSubAccountByPrivateKey(
    currentProfile: ProfileModel,
    password: Password,
    childAccountName: string,
    privateKey: string,
    networkType: NetworkType,
  ): AccountModel {
    const account = Account.createFromPrivateKey(privateKey, networkType)
    const simpleWallet = SimpleWallet.createFromPrivateKey(
      childAccountName,
      password,
      account.privateKey,
      networkType,
    )

    return {
      id: SimpleObjectStorage.generateIdentifier(),
      profileName: currentProfile.profileName,
      name: childAccountName,
      node: '',
      type: AccountType.PRIVATE_KEY,
      address: simpleWallet.address.plain(),
      publicKey: account.publicKey,
      encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
      path: '',
      isMultisig: false,
    }
  }


  /**
   * Returns a AccountModel with an updated SimpleWallet
   * @param {AccountModel} account
   * @param {Password} oldPassword
   * @param {Password} newPassword
   */
  public updateWalletPassword(account: AccountModel, oldPassword: Password, newPassword: Password): AccountModel {
    // Password modification is not allowed for hardware wallets
    if (account.type !== AccountType.SEED
      && account.type !== AccountType.PRIVATE_KEY) {
      throw new Error('Hardware account password cannot be changed')
    }

    const privateKey = Crypto.decrypt(account.encryptedPrivateKey, oldPassword.value)

    // Encrypt the private key with the new password
    const newSimpleWallet = SimpleWallet.createFromPrivateKey(
      account.name,
      newPassword,
      privateKey,
      AccountModel.getObjects(account).address.networkType,
    )
    // Update the account model
    return {
      ...account,
      encryptedPrivateKey: newSimpleWallet.encryptedPrivateKey,
    }
  }
}
