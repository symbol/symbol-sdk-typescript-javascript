import {AppWallet, AppState} from '@/core/model'
import {
  Account, Password, Deadline, UInt64,
  PersistentDelegationRequestTransaction,
  AccountHttp, AccountInfo, AccountType,
} from 'nem2-sdk'
import {CreateWalletType, AppAccounts, HdWallet} from '@/core/model'
import {APP_PARAMS} from '@/config'
import {Store} from 'vuex'

const {MAX_REMOTE_ACCOUNT_CHECKS} = APP_PARAMS

export class RemoteAccountService {
  numberOfCheckedRemoteAccounts = 0
  constructor(private readonly wallet: AppWallet) {}

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


  getPersistentDelegationRequestTransaction(
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
}
