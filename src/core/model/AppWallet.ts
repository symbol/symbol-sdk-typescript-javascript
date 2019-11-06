import {Store} from 'vuex'
import {
    Account,
    Crypto,
    NetworkType,
    SimpleWallet,
    Password,
    WalletAlgorithm,
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
} from 'nem2-sdk'
import CryptoJS from 'crypto-js'
import {filter, mergeMap} from 'rxjs/operators'
import {Message, networkConfig, defaultNetworkConfig} from "@/config"
import {localRead, localSave, createSubWalletByPath, getPath} from "@/core/utils"
import {AppAccounts, CreateWalletType} from "@/core/model"
import {AppState} from './types'
import {Log} from './Log'
const {DEFAULT_LOCK_AMOUNT} = defaultNetworkConfig

export class AppWallet {
    constructor(wallet?: {
        name?: string,
        simpleWallet?: SimpleWallet,
    }) {
        Object.assign(this, wallet)
    }

    name: string | undefined
    simpleWallet: SimpleWallet | undefined
    address: string | undefined
    publicKey: string | undefined
    networkType: NetworkType | undefined
    active: boolean | undefined
    balance: number | 0
    encryptedMnemonic: string | undefined
    path: string
    sourceType: string
    importance: number
    linkedAccountKey: string

    generateWalletTitle(createType: string, coinType: string, netType: string) {
        return `${createType}-${coinType}-${netType}`
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
        path: string,
        networkType: NetworkType,
        store: Store<AppState>): AppWallet {
        try {
            const accountName = store.state.account.accountName
            let accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
            const mnemonic = AppAccounts().decryptString(accountMap[accountName].seed, password.value)
            const account = createSubWalletByPath(mnemonic, path)
            this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, account.privateKey, networkType)
            this.name = name
            this.address = this.simpleWallet.address.plain()
            this.publicKey = account.publicKey
            this.networkType = networkType
            this.active = true
            this.path = path
            this.sourceType = CreateWalletType.seed
            this.encryptedMnemonic = AppAccounts().encryptString(mnemonic, password.value)
            this.addNewWalletToList(store)
            return this
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    // TODO USE ACCOUNT NETWORK TYPE
    createFromMnemonic(
        name: string,
        password: Password,
        mnemonic: string,
        networkType: NetworkType,
        store: Store<AppState>): AppWallet {
        try {
            const path = getPath(0)
            const accountName = store.state.account.accountName
            const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
            const account = createSubWalletByPath(mnemonic, path)  // need put in configure
            this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, account.privateKey, networkType)
            this.name = name
            this.address = this.simpleWallet.address.plain()
            this.publicKey = account.publicKey
            this.networkType = networkType
            this.active = true
            this.path = path
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
        // @WALLETS: update after nem2-sdk EncryptedPrivateKey constructor definition is fixed
        // https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/241
        const {encryptedKey, iv} = this.simpleWallet.encryptedPrivateKey
        const {network} = this.simpleWallet

        const common = {password: password.value, privateKey: ''}
        const wallet = {encrypted: encryptedKey, iv}
        Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32)
        const privateKey = common.privateKey
        return Account.createFromPrivateKey(privateKey, network)
    }

    getMnemonic(password: Password): string {
        if (this.encryptedMnemonic === undefined) throw new Error('This wallet has no encrypted mnemonic')
        try {
            return AppAccounts().decryptString(this.encryptedMnemonic, password.value)
        } catch (error) {
            throw new Error('Could not decrypt the mnemonic')
        }
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
        const accountName = store.state.account.accountName
        const accountMap = localRead('accountMap') === ''
            ? {} : JSON.parse(localRead('accountMap'))
        const newActiveWalletAddress = this.address
        // if wallet exists ,switch to this wallet
        const localData = accountMap[accountName].wallets
        accountMap[accountName].activeWalletAddress = newActiveWalletAddress
        const flagWallet = localData.find(item => newActiveWalletAddress == item.address)  // find wallet in wallet list
        if (flagWallet) {  // if wallet existed ,switch to this wallet
            store.commit('SET_WALLET', flagWallet)
            localSave('accountMap', JSON.stringify(accountMap))
            return
        }
        const updateWalletList = localData.length ? [...localData, this] : [this]
        accountMap[accountName].wallets = updateWalletList

        store.commit('SET_WALLET_LIST', updateWalletList)
        store.commit('SET_WALLET', this)
        localSave('accountMap', JSON.stringify(accountMap))
    }

    delete(store: Store<AppState>, that: any) {
        const list = [...store.state.app.walletList]
        const accountName = store.state.account.accountName
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
            store.commit('SET_WALLET', list[0])
        }

        that.$Notice.success({
            title: that['$t']('Delete_wallet_successfully') + '',
        })
        // this.$emit('hasWallet')
    }


    static updateActiveWalletAddress(newActiveWalletAddress: string, store: Store<AppState>) {
        const walletList = store.state.app.walletList
        const accountName = store.state.account.accountName
        const accountMap = localRead('accountMap') === ''
            ? {} : JSON.parse(localRead('accountMap'))

        accountMap[accountName].activeWalletAddress = newActiveWalletAddress
        localSave('accountMap', JSON.stringify(accountMap))
        store.commit('SET_WALLET', walletList.find(item => item.address == newActiveWalletAddress) || walletList[0])
    }

    async setAccountInfo(store: Store<AppState>): Promise<void> {
        try {
            const {EMPTY_LINKED_ACCOUNT_KEY} = networkConfig
            const accountInfo = await new AccountHttp(store.state.account.node)
                .getAccountInfo(Address.createFromRawAddress(store.state.account.wallet.address))
                .toPromise()
            this.importance = accountInfo.importance.compact()
            this.linkedAccountKey = accountInfo.linkedAccountKey === EMPTY_LINKED_ACCOUNT_KEY
                ? null : accountInfo.linkedAccountKey
            this.updateWallet(store)
        } catch (error) {
            console.error("AppWallet -> setAccountInfo -> error", error)
        }
    }

    async updateAccountBalance(balance: number, store: Store<AppState>): Promise<void> {
        try {

            this.balance = balance
            this.updateWallet(store)
        } catch (error) {
            console.error("AppWallet -> error", error)
        }
    }

    updateWalletName(
        accountName: string,
        newWalletName: string,
        walletAddress: string,
        store: Store<AppState>
    ) {
        let accountMap = JSON.parse(localRead('accountMap'))
        accountMap[accountName]['wallets'].every((item, index) => {
            if (item.address == walletAddress) {
                accountMap[accountName]['wallets'][index].name = newWalletName
                return false
            }
            return true
        })

        localSave('accountMap', JSON.stringify(accountMap))
        store.commit('SET_WALLET_LIST', accountMap[accountName]['wallets'])
    }


    updateWallet(store: Store<AppState>) {
        const accountName = store.state.account.accountName
        const accountMap = localRead('accountMap') === '' ? {} : JSON.parse(localRead('accountMap'))
        const localData: any[] = accountMap[accountName].wallets
        if (!localData.length) throw new Error('error at update wallet, no wallets in storage')

        const newWalletList = [...localData]
        const newWalletIndex = newWalletList.findIndex(({address}) => address === this.address)
        if (newWalletIndex === -1) throw new Error('wallet not found when updating')

        const updatedList = Object.assign([], newWalletList, {[newWalletIndex]: this})
        store.commit('SET_WALLET_LIST', updatedList)
        if (store.state.account.wallet.address === this.address) store.commit('SET_WALLET', this)
        accountMap[accountName].wallets = updatedList
        localSave('accountMap', JSON.stringify(accountMap))
    }

    async setMultisigStatus(node: string, store: Store<AppState>): Promise<void> {
        try {
            const multisigAccountInfo = await new AccountHttp(node)
                .getMultisigAccountInfo(Address.createFromRawAddress(this.address)).toPromise()
            store.commit('SET_MULTISIG_ACCOUNT_INFO', {address: this.address, multisigAccountInfo})
            store.commit('SET_MULTISIG_LOADING', false)
        } catch (error) {
            store.commit('SET_MULTISIG_ACCOUNT_INFO', {address: this.address, multisigAccountInfo: null})
            store.commit('SET_MULTISIG_LOADING', false)
        }
    }

    announceTransaction(
        signedTransaction: SignedTransaction | CosignatureSignedTransaction,
        node: string,
        that: any,
        signedLock?: SignedTransaction,
    ): void {
        if (signedTransaction instanceof CosignatureSignedTransaction) {
            this.announceCosignature(signedTransaction, node, that)
            return
        }

        if (signedLock) {
            this.announceBonded(signedTransaction, signedLock, node, that)
            return
        }

        this.announceNormal(signedTransaction, node, that)
    }

    announceCosignature(signedTransaction: CosignatureSignedTransaction, node: string, that: any): void {
        const message = that.$t(Message.SUCCESS)
        new Log('announceCosignature', signedTransaction).create(that.$store)

        new TransactionHttp(node).announceAggregateBondedCosignature(signedTransaction).subscribe(
            _ => {
                that.$store.commit('POP_TRANSACTION_TO_COSIGN_BY_HASH', {
                    publicKey: signedTransaction.signerPublicKey,
                    hash: signedTransaction.parentHash,
                })
                that.$Notice.success({title: message})
            },
            (error) => {
                new Log('announceNormal -> error', error).create(that.$store)
                console.error('announceNormal -> error', error)
            },
        )
    }

    announceNormal(signedTransaction: SignedTransaction, node: string, that: any): void {
        const message = that.$t(Message.SUCCESS)
        new TransactionHttp(node).announce(signedTransaction).subscribe(
            _ => that.$Notice.success({title: message}),
            error => console.error('announceNormal -> error', error),
        )
    }

    signAndAnnounceNormal(password: Password, node: string, generationHash: string, transactionList: Array<any>, that: any): void {
        const account = this.getAccount(password)
        const signature = account.sign(transactionList[0], generationHash)
        const message = that.$t(Message.SUCCESS)
        new Log('signAndAnnounceNormal', signature).create(that.$store)

        new TransactionHttp(node).announce(signature).subscribe(
            _ => that.$Notice.success({title: message}),
            (error) => {
                new Log('signAndAnnounceNormal -> error', error).create(that.$store)
                console.error('signAndAnnounceNormal -> error', error)
            }
        )
    }

    announceBonded(signedTransaction: SignedTransaction, signedLock: SignedTransaction, node: string, that): void {
        const transactionHttp = new TransactionHttp(node)
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const message = that.$t(Message.SUCCESS)
        new Log('signedTransaction', { signedTransaction, signedLock }).create(that.$store)

        listener.open().then(() => {
            transactionHttp
                .announce(signedLock)
                .subscribe(x => console.log(x), error => {
                    throw new Error(error)
                })

            listener
                .confirmed(Address.createFromRawAddress(this.address))
                .pipe(
                    filter((transaction) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === signedLock.hash),
                    mergeMap(_ => transactionHttp.announceAggregateBonded(signedTransaction)),
                )
                .subscribe(
                    (_) => {
                        that.$Notice.success({title: message})
                    },
                    error => {
                        throw new Error(error)
                    },
                )
        }).catch((error) => {
            new Log('announceBonded -> error', { signedTransaction, signedLock }).create(that.$store)
            console.error('announceBonded -> error', error)
        })
    }

    // @TODO: review
    // Remove if CheckPasswordDialog is made redundant
    signAndAnnounceBonded = (password: Password,
                             lockFee: number,
                             transactions: AggregateTransaction[],
                             store: Store<AppState>,
                             that,) => {
        const {node} = store.state.account

        const {signedTransaction, signedLock} = this.getSignedLockAndAggregateTransaction(
            transactions[0],
            lockFee,
            password.value,
            store,
        )

        this.announceBonded(signedTransaction, signedLock, node, that)
    }

    getSignedLockAndAggregateTransaction(
        aggregateTransaction: AggregateTransaction,
        fee: number,
        password: string,
        store: Store<AppState>):
        {
            signedTransaction: SignedTransaction,
            signedLock: SignedTransaction,
        } {
        const account = this.getAccount(new Password(password))
        const {wallet, networkCurrency, generationHash} = store.state.account
        const {networkType} = wallet

        const signedTransaction = account.sign(aggregateTransaction, generationHash)
        const hashLockTransaction = HashLockTransaction
            .create(
                Deadline.create(),
                new Mosaic(new MosaicId(networkCurrency.hex), UInt64.fromUint(DEFAULT_LOCK_AMOUNT)),
                UInt64.fromUint(480),
                signedTransaction,
                networkType,
                UInt64.fromUint(fee)
            )
        return {
            signedTransaction,
            signedLock: account.sign(hashLockTransaction, generationHash),
        }
    }
}
