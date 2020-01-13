import {Store} from 'vuex'
import {
  Account,
  NetworkType,
  SimpleWallet,
  Password,
  Listener,
  AccountHttp,
  Address,
  AggregateTransaction,
  TransactionHttp,
  SignedTransaction,
  CosignatureSignedTransaction,
  HashLockTransaction,
  Deadline,
  Mosaic,
  MosaicId,
  UInt64,
  MultisigHttp,
  PublicAccount,
  PersistentHarvestingDelegationMessage,
  TransferTransaction,
} from 'nem2-sdk'
import CryptoJS from 'crypto-js'
import {filter, mergeMap} from 'rxjs/operators'
import {Message, networkConfig, defaultNetworkConfig} from '@/config'
import {
  localRead, localSave, 
} from '@/core/utils'
import {
  AppState, RemoteAccount, CreateWalletType,
  AppAccounts, FormattedTransaction, NoticeType,
  Path, HdWallet,
} from '@/core/model'
import {setTransactionList, setPartialTransactions} from '@/core/services'
import {Log} from './Log'
import {Notice} from './Notice'

const {DEFAULT_LOCK_AMOUNT} = defaultNetworkConfig
const {EMPTY_PUBLIC_KEY} = networkConfig

export class AppWallet {
  name: string
  simpleWallet: SimpleWallet
  address: string
  publicKey: string
  path: string
  sourceType: string

  // Should use AppAccount
  networkType: NetworkType
  active: boolean
  encryptedMnemonic: string

  // Should use store
  importance: number
  linkedAccountKey: string
  remoteAccount: RemoteAccount | null
  numberOfMosaics: number

  // Remove
  temporaryRemoteNodeConfig: {
    publicKey: string
    node: string
  } | null

  constructor(wallet?: {
    name?: string
    simpleWallet?: SimpleWallet
  }) {
    Object.assign(this, wallet)
  }

  get publicAccount(): PublicAccount {
    return PublicAccount.createFromPublicKey(this.publicKey, this.networkType)
  }

  static createFromDTO(wallet) {
    return Object.assign(new AppWallet(wallet), {
      simpleWallet: SimpleWallet.createFromDTO(wallet.simpleWallet),
    })
  }

  createFromPrivateKey(name: string,
    password: Password,
    privateKey: string,
    networkType: NetworkType,
    store: Store<AppState>): AppWallet {
    try {
      this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType)
      this.name = name
      this.address = this.simpleWallet.address.plain()
      this.publicKey = Account.createFromPrivateKey(privateKey, networkType).publicKey
      this.networkType = networkType
      this.active = true
      this.sourceType = CreateWalletType.privateKey
      this.addNewWalletToList(store)
      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  createFromPath(
    name: string,
    password: Password,
    pathNumber: number,
    networkType: NetworkType,
    store: Store<AppState>,
  ): AppWallet {
    try {
      const accountName = store.state.account.currentAccount.name
      const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
      const mnemonic = AppAccounts().decryptString(accountMap[accountName].seed, password.value)
      const account = HdWallet.getAccountFromPathNumber(mnemonic, pathNumber, networkType)
      this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, account.privateKey, networkType)
      this.name = name
      this.address = this.simpleWallet.address.plain()
      this.publicKey = account.publicKey
      this.networkType = networkType
      this.active = true
      this.path = Path.getFromSeedIndex(pathNumber)
      this.sourceType = CreateWalletType.seed
      this.encryptedMnemonic = AppAccounts().encryptString(mnemonic, password.value)
      this.addNewWalletToList(store)
      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  createFromMnemonic(
    name: string,
    password: Password,
    mnemonic: string,
    networkType: NetworkType,
    store: Store<AppState>): AppWallet {
    try {
      const accountName = store.state.account.currentAccount.name
      const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
      const account = HdWallet.getAccountFromPathNumber(mnemonic, 0, networkType)
      this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, account.privateKey, networkType)
      this.name = name
      this.address = this.simpleWallet.address.plain()
      this.publicKey = account.publicKey
      this.networkType = networkType
      this.active = true
      this.path = Path.getFromSeedIndex(0)
      this.sourceType = CreateWalletType.seed
      this.encryptedMnemonic = AppAccounts().encryptString(mnemonic, password.value)
      accountMap[accountName].seed = this.encryptedMnemonic
      localSave('accountMap', JSON.stringify(accountMap))
      this.addNewWalletToList(store)
      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  createAccountFromMnemonic(
    password: Password,
    mnemonic: string,
    store: Store<AppState>) {
    try {
      const accountName = store.state.account.currentAccount.name
      const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
      accountMap[accountName].seed = AppAccounts().encryptString(mnemonic, password.value)
      localSave('accountMap', JSON.stringify(accountMap))
    } catch (error) {
      throw new Error(error)
    }
  }

  createFromTrezor(
    name: string,
    networkType: NetworkType,
    path: string,
    publicKey: string,
    address: string,
    store: Store<AppState>): AppWallet {
    try {
      const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
      this.name = name
      this.address = address
      this.publicKey = publicKey
      this.networkType = networkType
      this.active = true
      this.path = path
      this.sourceType = CreateWalletType.trezor
      localSave('accountMap', JSON.stringify(accountMap))
      this.addNewWalletToList(store)
      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  createFromKeystore(name: string,
    password: Password,
    keystorePassword: Password,
    keystoreStr: string,
    networkType: NetworkType,
    store: Store<AppState>): AppWallet {
    try {
      this.name = name
      this.networkType = networkType
      const words = CryptoJS.enc.Base64.parse(keystoreStr)
      const keystore = words.toString(CryptoJS.enc.Utf8)
      this.simpleWallet = JSON.parse(keystore)
      this.sourceType = CreateWalletType.keyStore
      const {privateKey} = this.getAccount(keystorePassword)
      this.createFromPrivateKey(name, password, privateKey, networkType, store)
      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  getAccount(password: Password): Account {
    return this.simpleWallet.open(password)
  }

  getKeystore(): string {
    const parsed = CryptoJS.enc.Utf8.parse(JSON.stringify(this.simpleWallet))
    return CryptoJS.enc.Base64.stringify(parsed)
  }

  checkPassword(password: string): boolean {
    try {
      this.getAccount(new Password(password))
      return true
    } catch (error) {
      return false
    }
  }

  updatePassword(oldPassword: Password, newPassword: Password, store: Store<AppState>): void {
    const account = this.getAccount(oldPassword)
    this.createFromPrivateKey(this.name,
      newPassword,
      account.privateKey,
      this.networkType,
      store)
  }

  addNewWalletToList(store: Store<AppState>): void {
    const accountName = store.state.account.currentAccount.name
    const accountMap = localRead('accountMap') === ''
      ? {} : JSON.parse(localRead('accountMap'))
    const newActiveWalletAddress = this.address
    const localData = accountMap[accountName].wallets
    accountMap[accountName].activeWalletAddress = newActiveWalletAddress
    const flagWallet = localData.find(item => newActiveWalletAddress === item.address) // find wallet in wallet list
    if (flagWallet) {
      store.commit('SET_WALLET', AppWallet.createFromDTO(flagWallet))
      localSave('accountMap', JSON.stringify(accountMap))
      return
    }
    const updateWalletList = localData.length ? [ ...localData, this ] : [this]
    accountMap[accountName].wallets = updateWalletList

    store.commit('SET_WALLET_LIST', updateWalletList)
    store.commit('SET_WALLET', this)
    localSave('accountMap', JSON.stringify(accountMap))
  }

  delete(store: Store<AppState>, that: any) {
    const list = [...store.state.app.walletList]
    const accountName = store.state.account.currentAccount.name
    const accountMap = localRead('accountMap') === ''
      ? {} : JSON.parse(localRead('accountMap'))

    const walletIndex = list.findIndex(({address}) => address === this.address)
    if (walletIndex === -1) throw new Error('The wallet was not found in the list')
    list.splice(walletIndex, 1)
    store.commit('SET_WALLET_LIST', list)
    accountMap[accountName].wallets = list
    localSave('accountMap', JSON.stringify(accountMap))

    if (list.length < 1) {
      store.commit('SET_WALLET', {})
    }

    if (store.state.account.wallet.address === this.address) {
      list[0].active = true
      store.commit('SET_WALLET', AppWallet.createFromDTO(list[0]))
    }

    that.$Notice.success({
      title: `${that['$t']('Delete_wallet_successfully')}`,
    })
  }


  static updateActiveWalletAddress(
    newActiveWalletAddress: string,
    currentAccountName: string,
  ) {
    const accountMap = localRead('accountMap') === ''
      ? {} : JSON.parse(localRead('accountMap'))

    if (!accountMap[currentAccountName]) return

    accountMap[currentAccountName].activeWalletAddress = newActiveWalletAddress
    localSave('accountMap', JSON.stringify(accountMap))
  }

  async setAccountInfo(store: Store<AppState>): Promise<{walletKnownByNetwork: boolean}> {
    const {EMPTY_PUBLIC_KEY} = networkConfig
    const [accountInfo] = await new AccountHttp(store.state.account.node)
      .getAccountsInfo([Address.createFromRawAddress(store.state.account.wallet.address)])
      .toPromise()

    if(!accountInfo){
      this.updateWallet(store)
      return {walletKnownByNetwork: false}
    }

    this.numberOfMosaics = accountInfo.mosaics ? accountInfo.mosaics.length : 0
    this.importance = accountInfo.importance.compact()
    this.linkedAccountKey = accountInfo.linkedAccountKey === EMPTY_PUBLIC_KEY
      ? null : accountInfo.linkedAccountKey
    this.updateWallet(store)
    return {walletKnownByNetwork: true}
  }

  updateWalletName(newWalletName: string, store: Store<AppState>) {
    this.name = newWalletName
    this.updateWallet(store)
  }

  updateWallet(store: Store<AppState>) {
    const accountName = store.state.account.currentAccount.name
    const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
    const localData: any[] = accountMap[accountName].wallets
    if (!localData.length) throw new Error('error at update wallet, no wallets in storage')

    const newWalletList = [...localData]
    const newWalletIndex = newWalletList.findIndex(({address}) => address === this.address)
    if (newWalletIndex === -1) throw new Error('wallet not found when updating')

    const updatedList = Object.assign([], newWalletList, {[newWalletIndex]: this})
    store.commit('SET_WALLET_LIST', updatedList)
    if (store.state.account.wallet.address === this.address) {
      store.commit('SET_WALLET', this)
    }
    accountMap[accountName].wallets = updatedList
    localSave('accountMap', JSON.stringify(accountMap))
  }

  async setMultisigStatus(node: string, store: Store<AppState>): Promise<void> {
    try {
      const multisigAccountInfo = await new MultisigHttp(node)
        .getMultisigAccountInfo(Address.createFromRawAddress(this.address)).toPromise()
      store.commit('SET_MULTISIG_ACCOUNT_INFO', {address: this.address, multisigAccountInfo})
      store.commit('SET_MULTISIG_LOADING', false)
    } catch (error) {
      store.commit('SET_MULTISIG_ACCOUNT_INFO', {address: this.address, multisigAccountInfo: null})
      store.commit('SET_MULTISIG_LOADING', false)
    }
  }

  isLinked(): boolean {
    return this.linkedAccountKey && this.linkedAccountKey !== EMPTY_PUBLIC_KEY
  }

  /**
     * Routes a signedTransaction to the relevant announce method
     * @param signedTransaction
     * @param store
     * @param signedLock
     */
  announceTransaction(
    signedTransaction: SignedTransaction | CosignatureSignedTransaction,
    store: Store<AppState>,
    signedLock?: SignedTransaction,
  ): void {
    if (signedTransaction instanceof CosignatureSignedTransaction) {
      this.announceCosignature(signedTransaction, store)
      return
    }

    if (signedLock) {
      this.announceBonded(signedTransaction, signedLock, store)
      return
    }

    this.announceNormal(signedTransaction, store)
  }

  announceCosignature(signedTransaction: CosignatureSignedTransaction, store: Store<AppState>): void {
    const {node} = store.state.account
    Log.create('announceCosignature', signedTransaction, store)

    new TransactionHttp(node).announceAggregateBondedCosignature(signedTransaction).subscribe(
      () => {
        store.commit('POP_TRANSACTION_TO_COSIGN_BY_HASH', signedTransaction.parentHash)
        Notice.trigger(Message.SUCCESS, NoticeType.success, store)
      },
      error => Log.create('announceCosignature -> error', error, store),
    )
  }

  announceNormal(signedTransaction: SignedTransaction, store: Store<AppState>): void {
    const {node} = store.state.account
    Log.create('announceNormal', signedTransaction, store)

    new TransactionHttp(node).announce(signedTransaction).subscribe(
      () => Notice.trigger(Message.SUCCESS, NoticeType.success, store),
      error => Log.create('announceNormal -> error', error, store),
    )
  }


  getPersistentAccountRequests(store: Store<AppState>): FormattedTransaction[] {
    const persistentAccountRequests = store.state.account.transactionList
      .filter((tx: any) => tx.rawTx instanceof TransferTransaction)
      .filter((tx: any) => tx.rawTx.message instanceof PersistentHarvestingDelegationMessage)
    if (!this.isLinked) return null
    if (!persistentAccountRequests.length) return null
    return persistentAccountRequests
  }


  announceBonded(
    signedTransaction: SignedTransaction,
    signedLock: SignedTransaction,
    store: Store<AppState>,
  ): void {
    const {node} = store.state.account
    const transactionHttp = new TransactionHttp(node)
    const listener = new Listener(node.replace('http', 'ws'), WebSocket)
    Log.create('announceBonded', {signedTransaction, signedLock}, store)

    listener.open().then(() => new Promise((resolve, reject) => {
      transactionHttp
        .announce(signedLock)
        .subscribe(
          () => Notice.trigger(Message.SUCCESS, NoticeType.success, store),
          error => reject(error),
        )

      listener
        .confirmed(Address.createFromRawAddress(this.address))
        .pipe(
          filter((transaction) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === signedLock.hash),
          mergeMap(() => transactionHttp.announceAggregateBonded(signedTransaction)),
        )
        .subscribe(
          () => Notice.trigger(Message.SUCCESS, NoticeType.success, store),
          error => reject(error),
        )
    })).catch((error) => {
      Log.create('announceBonded -> error', error, store)
    })
  }

  getSignedLockAndAggregateTransaction(
    aggregateTransaction: AggregateTransaction,
    fee: number,
    password: string,
    store: Store<AppState>): {
      signedTransaction: SignedTransaction
      signedLock: SignedTransaction
    } {
    const account = this.getAccount(new Password(password))
    const {networkCurrency} = store.state.account
    const {generationHash} = store.state.app.networkProperties
    const signedTransaction = account.sign(aggregateTransaction, generationHash)

    const hashLockTransaction = HashLockTransaction
      .create(
        Deadline.create(),
        new Mosaic(new MosaicId(networkCurrency.hex), UInt64.fromUint(DEFAULT_LOCK_AMOUNT)),
        UInt64.fromUint(480),
        signedTransaction,
        this.networkType,
        UInt64.fromUint(fee),
      )
    return {
      signedTransaction,
      signedLock: account.sign(hashLockTransaction, generationHash),
    }
  }

  async setTransactionList(store: Store<AppState>): Promise<void> {
    await setTransactionList(
      Address.createFromRawAddress(this.address),
      store,
    )
  }
  setPartialTransactions(store: Store<AppState>): void {
    setPartialTransactions(
      Address.createFromRawAddress(this.address), store,
    )
  }
}
