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
import {
  Account, Password, Deadline, UInt64,
  PersistentDelegationRequestTransaction,
  AccountHttp, AccountInfo, AccountType,
} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from '@/services/AbstractService'

//XXX app config store getter
import appConfig from '../../config/app.conf.json'
const {MAX_REMOTE_ACCOUNT_CHECKS} = appConfig

export class RemoteAccountService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  name: string = 'remote-account'

  /**
   * 
   */
  numberOfCheckedRemoteAccounts: number = 0

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

  async getAvailableRemotePublicKey(
    password: Password,
    store: Store<AppState>,
  ): Promise<string> {
    try {
      const {node} = store.state.account
      const availableRemoteAccount = await this.getAvailableRemoteAccount(password, node)
      return availableRemoteAccount.publicKey
    } catch (error) {
      throw new Error(error)
    }
  }

  private async getAvailableRemoteAccount(
    password: Password,
    node: string,
    batchSize = 1,
  ): Promise<Account> {

    try {
      this.numberOfCheckedRemoteAccounts += batchSize
      const someRemoteAccounts = this.getRemoteAccounts(password, this.baseSeedIndex, batchSize)
      const someRemoteAccountsAddresses = someRemoteAccounts.map(({address}) => address)

      const accountsInfo = await new AccountHttp(node)
        .getAccountsInfo(someRemoteAccountsAddresses)
        .toPromise()

      return this.getFirstFreeRemoteAccount(someRemoteAccounts, accountsInfo)
    } catch (error) {
      if (this.numberOfCheckedRemoteAccounts < MAX_REMOTE_ACCOUNT_CHECKS) {
        return this.getAvailableRemoteAccount(password, node, MAX_REMOTE_ACCOUNT_CHECKS - 1)
      }

      throw new Error('Could not find a linkable remote account')
    }
  }

  private get baseSeedIndex(): number {
    if (this.numberOfCheckedRemoteAccounts === 1) return 1
    return 2
  }

  private getRemoteAccounts(
    password: Password,
    remoteAccountFirstIndex: number,
    numberOfAccounts: number,
  ): Account[] {
    switch (this.wallet.sourceType) {
      case CreateWalletType.seed:
        return HdWallet.getSeedWalletRemoteAccounts(
          AppAccounts().decryptString(this.wallet.encryptedMnemonic, password.value),
          this.wallet.path,
          remoteAccountFirstIndex,
          this.wallet.networkType,
          numberOfAccounts,
        )

      case CreateWalletType.privateKey:
      case CreateWalletType.keyStore:
        return HdWallet.getRemoteAccountsFromPrivateKey(
          this.wallet.getAccount(password).privateKey.toString(),
          remoteAccountFirstIndex,
          this.wallet.networkType,
          numberOfAccounts,
        )

      case CreateWalletType.trezor:
        throw new Error('remote account generation from Trezor wallet is not supported')

      default:
        throw new Error('Something went wrong at getRemoteAccounts')
    }
  }

  private getFirstFreeRemoteAccount(remoteAccounts: Account[], accountsInfo: AccountInfo[]) {
    if (!accountsInfo.length) return remoteAccounts[0]

    const linkableRemoteAccounts = remoteAccounts.filter(({address}) => {
      const matchedAccountInfo = accountsInfo.find(ai => ai.address.plain() === address.plain())
      return matchedAccountInfo === undefined || RemoteAccountService.isLinkable(matchedAccountInfo)
    })

    if (!linkableRemoteAccounts.length) {
      throw new Error('Could not find a free remote account')
    }

    return linkableRemoteAccounts[0]
  }

  public getPersistentDelegationRequestTransaction(
    deadline: Deadline,
    recipientPublicKey: string,
    feeAmount: UInt64,
    password: Password,
  ): PersistentDelegationRequestTransaction {
    try {
      const delegatedPrivateKey = this
        .getRemoteAccountFromLinkedAccountKey(password)
        .privateKey

      const accountPrivateKey = this.wallet.getAccount(password).privateKey

      return PersistentDelegationRequestTransaction
        .createPersistentDelegationRequestTransaction(
          deadline,
          delegatedPrivateKey,
          recipientPublicKey,
          accountPrivateKey,
          this.wallet.networkType,
          feeAmount,
        )
    } catch (error) {
      throw new Error(error)
    }
  }

  private getRemoteAccountFromLinkedAccountKey(password: Password, index = 1) {
    if (index > MAX_REMOTE_ACCOUNT_CHECKS) {
      throw new Error('Could not find a remote account that corresponds to the linked account key')
    }

    const accountsToMatch = this.getRemoteAccounts(password, index, MAX_REMOTE_ACCOUNT_CHECKS)
    return accountsToMatch.find(({publicKey}) => publicKey === this.wallet.linkedAccountKey)
  }

  static isLinkable(accountInfo: AccountInfo): boolean {
    return accountInfo.accountType && accountInfo.accountType === AccountType.Remote_Unlinked
  }

  public getHarvestingDelegationRequests(transactionList: FormattedTransaction[]): FormattedTransaction[] {

    
    transactionList.filter((tx: any) => tx.rawTx instanceof TransferTransaction)
                   .filter((tx: any) => tx.rawTx.message instanceof PersistentHarvestingDelegationMessage)
  }
}
