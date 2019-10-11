import {Store} from 'vuex'
import {
    Account,
    Crypto,
    NetworkType,
    SimpleWallet,
    Password,
    WalletAlgorithm,
    Listener,
    AccountHttp, Address, AggregateTransaction, TransactionHttp,
} from 'nem2-sdk'
import CryptoJS from 'crypto-js'
import {Message, networkConfig} from "@/config"
import {AppLock, localRead, localSave, createSubWalletByPath} from "@/core/utils"
import {CreateWalletType} from "@/core/model"
import {AppState} from './types'
import {announceBondedWithLock} from '@/core/services'

export class AppWallet {
    constructor(wallet?: {
        name?: string,
        simpleWallet?: SimpleWallet
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
            const mnemonic = AppLock.decryptString(accountMap[accountName].seed, password.value)
            const account = createSubWalletByPath(mnemonic, path)
            this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, account.privateKey, networkType)
            this.name = name
            this.address = this.simpleWallet.address.plain()
            this.publicKey = account.publicKey
            this.networkType = networkType
            this.active = true
            this.path = path
            this.sourceType = CreateWalletType.seed
            this.encryptedMnemonic = AppLock.encryptString(mnemonic, password.value)
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
            const path = `m/44'/43'/0'/0'/0`
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
            this.encryptedMnemonic = AppLock.encryptString(mnemonic, password.value)
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
            const {privateKey} =  this.getAccount(password)
            this.createFromPrivateKey(name, password, privateKey, networkType, store)
            this.addNewWalletToList(store)
            return this
        } catch (error) {
            throw new Error(error)
        }
    }

    getAccount(password: Password): Account {
        // @WALLETS: update after nem2-sdk EncryptedPrivateKey constructor definition is fixed
        // https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/241
        const {encryptedKey, iv} = this.simpleWallet.encryptedPrivateKey

        const common = {password: password.value, privateKey: ''}
        const wallet = {encrypted: encryptedKey, iv}
        Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32)
        const privateKey = common.privateKey
        return Account.createFromPrivateKey(privateKey, this.networkType)
    }

    getMnemonic(password: Password): string {
        if (this.encryptedMnemonic === undefined) throw new Error('This wallet has no encrypted mnemonic')
        try {
            return AppLock.decryptString(this.encryptedMnemonic, password.value)
        } catch (error) {
            throw new Error('Could not decrypt the mnemonic')
        }
    }

    getKeystore(): string {
        const parsed = CryptoJS.enc.Utf8.parse(JSON.stringify(this.simpleWallet))
        return CryptoJS.enc.Base64.stringify(parsed)
    }

    checkPassword(password: Password): boolean {
        try {
            this.getAccount(password)
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

    // @WALLETS: Hard to understand what this function is doing, rename / review
    addNewWalletToList(store: Store<AppState>): void {
        const accountName = store.state.account.accountName
        const accountMap = localRead('accountMap') === ''
            ? {} : JSON.parse(localRead('accountMap'))

        const localData = accountMap[accountName].wallets
        const updateWalletList = localData.length ? [...localData, this] : [this]
        const newActiveWalletAddress = this.address

        accountMap[accountName].activeWalletAddress = newActiveWalletAddress
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
            store.commit('SET_HAS_WALLET', false)
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

    async getAccountBalance(store: Store<AppState>): Promise<AppWallet> {
        try {
            const {node, networkCurrency} = store.state.account

            const accountInfo = await new AccountHttp(node)
                .getAccountInfo(Address.createFromRawAddress(this.address))
                .toPromise()

            if (!accountInfo.mosaics.length) {
                this.balance = 0
                return this
            }

            const xemIndex = accountInfo.mosaics
                .findIndex(mosaic => mosaic.id.toHex() === networkCurrency.hex)

            if (xemIndex === -1) {
                this.balance = 0
                return this
            }

            this.balance = accountInfo.mosaics[xemIndex].amount.compact() / Math.pow(10, networkCurrency.divisibility)
            return this
        } catch (error) {
            this.balance = 0
            return this
        }
    }

    signAndAnnounceNormal(password: Password, node: string, generationHash: string, transactionList: Array<any>, that: any): void {
        const account = this.getAccount(password)
        const signature = account.sign(transactionList[0], generationHash)
        const message = that.$t(Message.SUCCESS)
        console.log(transactionList)
        console.log(signature)
        new TransactionHttp(node).announce(signature).subscribe(
            _ => that.$Notice.success({title: message}),
            error => {
                throw new Error(error)
            }
        )
    }

    // @TODO: review
    signAndAnnounceBonded = (password: Password,
                             lockFee: number,
                             transactions: AggregateTransaction[],
                             store: Store<AppState>) => {
        const {node} = store.state.account

        const account = this.getAccount(password)
        const aggregateTransaction = transactions[0]
        // @TODO: review listener management
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        announceBondedWithLock(aggregateTransaction,
            account,
            listener,
            node,
            lockFee,
            store)
    }
}

export const saveLocalAlias = (
    address: string,
    aliasObject: {
        tag: string,
        alias: string,
        address: string
    }) => {
    const addressBookData = localRead('addressBook')
    let addressBook = addressBookData ? JSON.parse(addressBookData) : {}
    addressBook[address] = addressBook[address] || {}
    addressBook[address]['aliasMap'] = addressBook[address]['aliasMap'] || {}
    addressBook[address]['aliasMap'][aliasObject.alias] = aliasObject

    addressBook[address]['tagMap'] = addressBook[address]['tagMap'] || {}
    addressBook[address]['tagMap'][aliasObject.tag] = addressBook[address]['tagMap'][aliasObject.tag] || []
    addressBook[address]['tagMap'][aliasObject.tag].push(aliasObject.alias)

    localSave('addressBook', JSON.stringify(addressBook))
}


export const readLocalAlias = (address: string) => {
    const addressBookData = localRead('addressBook')
    if (!addressBookData) return {}
    return JSON.parse(addressBookData)[address]
}
export const removeLink = (aliasObject, address) => {
    const {alias, tag} = aliasObject
    const addressBook = JSON.parse(localRead('addressBook'))
    delete addressBook[address].aliasMap[alias]
    addressBook[address].tagMap[tag].splice(addressBook[address].tagMap[tag].indexOf(alias), 1)
    localSave('addressBook', JSON.stringify(addressBook))
}
