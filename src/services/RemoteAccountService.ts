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
  Account,
  AccountType,
  Address,
  PublicAccount,
} from 'nem2-sdk'
import {Wallet} from 'nem2-hd-wallets'

// internal dependencies
import {AbstractService} from '@/services/AbstractService'
import {WalletService} from '@/services/WalletService'
import {RESTService} from '@/services/RESTService'
import {DerivationService, DerivationPathLevels} from '@/services/DerivationService'
import {DerivationPathValidator} from '@/core/validators/DerivationPathValidator'

export class RemoteAccountService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'remote-account'

  /**
   * Default remote account derivation path
   * @var {string}
   */
  public static readonly DEFAULT_PATH = 'm/44\'/43\'/0\'/1\'/0\''
  
  /**
   * Wallets service
   * @var {WalletService}
   */
  protected wallets: WalletService
  
  /**
   * Derivation service
   * @var {DerivationService}
   */
  protected paths: DerivationService

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
    this.wallets = new WalletService(store)
    this.paths = new DerivationService(store)
  }

  /**
   * Get next available remote account public key
   * @param {Wallet} wallet 
   * @param {string} path
   * @return {Promise<PublicAccount>}
   */
  async getNextRemoteAccountPublicKey(
    wallet: Wallet,
    path: string = RemoteAccountService.DEFAULT_PATH,
  ): Promise<PublicAccount> {
    if (!new DerivationPathValidator().validate(path)) {
      throw new Error('Invalid derivation path for remote account: ' + path)
    }

    try {
      // prepare discovery process
      const currentPeer = this.$store.getters['network/currentPeer'].url
      const networkType = this.$store.getters['network/networkType']
      const accountHttp = RESTService.create('AccountHttp', currentPeer)

      // generate 10 remote accounts
      let nextPath: string = path
      const remoteAccounts: Map<string, Account> = new Map<string, Account>()
      const remoteAddresses: Address[] = []
      for (let i = 0; i < 10; i++) {
        // derive child account and store
        const remoteAccount = wallet.getChildAccount(nextPath, networkType)
        remoteAccounts.set(remoteAccount.address.plain(), remoteAccount)
        remoteAddresses.push(remoteAccount.address)

        // increment derivation path
        nextPath = this.paths.incrementPathLevel(nextPath, DerivationPathLevels.Remote)
      }

      // read account infos
      const remoteInfos = await accountHttp.getAccountsInfo(remoteAddresses).toPromise()
      const firstLinkable = remoteInfos.filter((remoteInfo) => {
        return remoteInfo.accountType && remoteInfo.accountType === AccountType.Remote_Unlinked
      }).shift()

      // instantiate with first available remote account
      return PublicAccount.createFromPublicKey(firstLinkable.publicKey, networkType)
    }
    catch (error) {
      throw new Error('Could not get remote account public key: ' + error)
    }
  }
/*
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

  public getHarvestingDelegationRequests(transactionList: FormattedTransaction[]): FormattedTransaction[] {

    
    transactionList.filter((tx: any) => tx.rawTx instanceof TransferTransaction)
                   .filter((tx: any) => tx.rawTx.message instanceof PersistentHarvestingDelegationMessage)
  }
  */
}
