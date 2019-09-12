import {Message} from "@/config/index.ts"
import {localRead, localSave} from "@/core/utils/utils.ts"
import {
    Account,
    Address,
    Crypto,
    NetworkType,
    Transaction,
    SimpleWallet,
    Password,
    WalletAlgorithm,
    Listener, Mosaic, MosaicInfo
} from 'nem2-sdk'
import CryptoJS from 'crypto-js'
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs.ts"
import {BlockApiRxjs} from "@/core/api/BlockApiRxjs.ts"
import {formateNemTimestamp} from "@/core/utils/utils.ts"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs"
import {createAccount} from "@/core/utils/hdWallet.ts"
import {AppLock} from "@/core/utils/appLock"

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
    style: string | undefined
    balance: number | 0
    isMultisig: boolean | undefined
    encryptedMnemonic: string | undefined

    createFromPrivateKey(name: string,
                         password: Password,
                         privateKey: string,
                         networkType: NetworkType,
                         store: any): AppWallet {
        try {
            this.simpleWallet = SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType)
            this.name = name
            this.address = this.simpleWallet.address.plain()
            this.publicKey = Account.createFromPrivateKey(privateKey, networkType).publicKey
            this.networkType = networkType
            this.active = true

            this.addNewWalletToList(store)
            return this
        } catch (error) {
            throw new Error(error)
        }
    }

    createFromMnemonic(name: string,
                       password: Password,
                       mnemonic: string,
                       networkType: NetworkType,
                       store: any): AppWallet {
        try {
            const account = createAccount(mnemonic)
            this.simpleWallet = SimpleWallet
                .createFromPrivateKey(name, password, account.privateKey, networkType)
            this.name = name
            this.address = this.simpleWallet.address.plain()
            this.publicKey = account.publicKey
            this.networkType = networkType
            this.active = true
            this.encryptedMnemonic = AppLock.encryptString(mnemonic, password.value)
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
                       store: any): AppWallet {
        try {
            this.name = name
            this.networkType = networkType
            const words = CryptoJS.enc.Base64.parse(keystoreStr)
            const keystore = words.toString(CryptoJS.enc.Utf8)
            this.simpleWallet = JSON.parse(keystore)
            const {privateKey} = this.getAccount(password)
            this.createFromPrivateKey(name, password, privateKey, networkType, store)
            return this
        } catch (error) {
            throw new Error(error)
        }
    }

    getAccount(password: Password): Account {
        // @TODO: update after nem2-sdk EncryptedPrivateKey constructor definition is fixed
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

    updatePassword(oldPassword: Password, newPassword: Password, store: any): void {
        const account = this.getAccount(oldPassword)
        this.createFromPrivateKey(this.name,
            newPassword,
            account.privateKey,
            this.networkType,
            store)
    }

    addNewWalletToList(store: any): void {
        const localData: any[] = localRead('wallets') === ''
            ? [] : JSON.parse(localRead('wallets'))

        this.style = this.style || `walletItem_bg_${String(Number(localData.length) % 3)}`

        if (!localData.length) {
            AppWallet.switchWallet(this.address, [this], store)
            return
        }

        let dataToStore = [...localData]
        const walletIndex = dataToStore.findIndex(({address}) => address === this.address)
        if (walletIndex > -1) dataToStore.splice(walletIndex, 1)

        AppWallet.switchWallet(this.address, [this, ...dataToStore], store)
    }

    delete(store: any, that: any) {
        const list = [...store.state.app.walletList]
        const walletIndex = list.findIndex(({address}) => address === this.address)
        if (walletIndex === -1) throw new Error('The wallet was not found in the list')
        list.splice(walletIndex, 1)
        store.commit('SET_WALLET_LIST', list)
        localSave('wallets', JSON.stringify(list))

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

    // storeWalletList(store: any, walletList: AppWallet[]) {
    //   store.commit('SET_WALLET_LIST', walletList)
    //   localSave('wallets', JSON.stringify(walletList))
    // }

    static switchWallet(newActiveWalletAddress: string, walletList: any, store: any) {
        const newWalletIndex = walletList.findIndex(({address}) => address === newActiveWalletAddress)
        if (newWalletIndex === -1) throw new Error('wallet not found when switching')

        let newWallet = walletList[newWalletIndex]
        newWallet.active = true

        let newWalletList = [...walletList]
        newWalletList
            .filter(wallet => wallet.address !== newActiveWalletAddress)
            .map(wallet => wallet.active = false)

        newWalletList.splice(newWalletIndex, 1)
        const walletListToStore = [newWallet, ...newWalletList]

        store.commit('SET_WALLET_LIST', walletListToStore)
        store.commit('SET_WALLET', newWallet)
        localSave('wallets', JSON.stringify(walletListToStore))
    }

    async getAccountBalance(networkCurrencies: any, node: string): Promise<number> {
        try {
            const accountInfo = await new AccountApiRxjs()
                .getAccountInfo(this.address, node)
                .toPromise()
            if (!accountInfo.mosaics.length) return 0
            const xemIndex = accountInfo.mosaics
                .findIndex(mosaic => networkCurrencies.indexOf(mosaic.id.toHex()) > -1)


            if (xemIndex === -1) return 0
            // @TODO: handle divisibility
            return accountInfo.mosaics[xemIndex].amount.compact() / 1000000
        } catch (error) {
            return 0
        }
    }

    async updateAccountBalance(networkCurrencies: any, node: string, store: any) {
        try {
            const balance = await this.getAccountBalance(networkCurrencies, node)
            this.balance = balance
            this.updateWallet(store)
        } catch (error) {
            // do nothing
        }
    }

    updateWallet(store: any) {
        const localData: any[] = localRead('wallets') === ''
            ? [] : JSON.parse(localRead('wallets'))

        if (!localData.length) throw new Error('error at update wallet, no wallets in storage')

        let newWalletList = [...localData]
        const newWalletIndex = localData.findIndex(({address}) => address === this.address)

        if (newWalletIndex === -1) throw new Error('wallet not found when updating')

        newWalletList[newWalletIndex] = this

        store.commit('SET_WALLET_LIST', newWalletList)
        store.commit('SET_WALLET', this)
        localSave('wallets', JSON.stringify(newWalletList))
    }

    async setMultisigStatus(node: string): Promise<boolean> {
        try {
            await new AccountApiRxjs().getMultisigAccountInfo(this.address, node).toPromise()
            this.isMultisig = true
            return true
        } catch (error) {
            return false
        }
    }

    signAndAnnounceNormal(password: Password, node: string, generationHash: string, transactionList: Array<any>, that: any): void {
        try {
            const account = this.getAccount(password)
            const signature = account.sign(transactionList[0], generationHash)
            console.log(signature)
            new TransactionApiRxjs().announce(signature, node).subscribe(() => {
                that.$Notice.success({title: that.$t(Message.SUCCESS) + ''})
            })
        } catch (err) {
            console.error(err)
        }
    }

    signAndAnnounceBonded = (
        password: Password,
        lockFee: number,
        node: string,
        generationHash: string,
        transactionList: Array<any>,
        currentXEM1: string,
        networkType: NetworkType,
    ) => {
        const account = this.getAccount(password)
        const aggregateTransaction = transactionList[0]
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        new TransactionApiRxjs().announceBondedWithLock(
            aggregateTransaction,
            account,
            listener,
            node,
            generationHash,
            networkType,
            lockFee,
            currentXEM1,
        )
    }
}

export const saveLocalWallet = (wallet: any): void => {
    const localData: any[] = localRead('wallets') === ''
        ? [] : JSON.parse(localRead('wallets'))

    if (!localData.length) {
        localSave('wallets', JSON.stringify([wallet]))
        return
    }

    let dataToStore = [...localData]
    const walletIndex = localData.find(({address}) => address === wallet.address)

    if (walletIndex > -1) {
        localSave('wallets', JSON.stringify(dataToStore[walletIndex].assign(wallet)))
        return
    }

    localSave('wallets', JSON.stringify([wallet, ...dataToStore]))
}

export const getNamespaces = async (address: string, node: string) => {
    let list = []
    let namespace = {}
    await new NamespaceApiRxjs().getNamespacesFromAccount(
        Address.createFromRawAddress(address),
        node
    ).then((namespacesFromAccount) => {
        namespacesFromAccount.result.namespaceList
            .sort((a, b) => {
                return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
            }).map((item, index) => {
            if (!item) {
                return
            }
            if (!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())) {
                namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
            } else {
                return
            }
            let namespaceName = ''
            item.namespaceInfo.levels.map((item, index) => {
                namespaceName += namespace[item.id.toHex()] + '.'
            })
            namespaceName = namespaceName.slice(0, namespaceName.length - 1)
            const newObj = {
                value: namespaceName,
                label: namespaceName,
                isActive: item.namespaceInfo.active,
                alias: item.namespaceInfo.alias,
                levels: item.namespaceInfo.levels.length,
                name: namespaceName,
                duration: item.namespaceInfo.endHeight.compact(),
            }
            list.push(newObj)
        })
    })
    return list
}

export const createRootNamespace = (namespaceName, duration, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdRootNamespace(namespaceName, duration, networkType, maxFee)
}

export const createSubNamespace = (rootNamespaceName, subNamespaceName, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdSubNamespace(subNamespaceName, rootNamespaceName, networkType, maxFee)
}
export const multisigAccountInfo = (address, node) => {
    return new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
        return multisigInfo
    })
}

export const createBondedMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, fee: number) => {
    return new MultisigApiRxjs().bondedMultisigTransaction(networkType, fee, multisigPublickey, transaction)
}

export const createCompleteMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, fee: number) => {
    return new MultisigApiRxjs().completeMultisigTransaction(networkType, fee, multisigPublickey, transaction)
}

export const getBlockInfoByTransactionList = (transactionList: Array<any>, node: string, offset: number) => {
    const blockHeightList = transactionList.map((item) => {
        const height = item.transactionInfo.height.compact()
        new BlockApiRxjs().getBlockByHeight(node, height).subscribe((info) => {
            if (info) {
                item.time = formateNemTimestamp(info.timestamp.compact(), offset)
            }
            if (item.dialogDetailMap) {
                item.dialogDetailMap.timestamp = formateNemTimestamp(info.timestamp.compact(), offset)
            }
            return
        })
        return item.transactionInfo.height.compact()
    })
}

export const getMosaicList = async (address: string, node: string) => {
    let mosaicList: Mosaic[] = []
    await new AccountApiRxjs().getAccountInfo(address, node).toPromise().then(accountInfo => {
        mosaicList = accountInfo.mosaics
    }).catch((_) => {
        return
    })
    return mosaicList
}

export const getMosaicInfoList = async (node: string, mosaicList: Mosaic[],currentHeight:any,isShowExpired: boolean = true) => {
    let mosaicInfoList: MosaicInfo[] = []
    let mosaicIds: any = mosaicList.map((item) => {
        return item.id
    })
    await new MosaicApiRxjs().getMosaics(node, mosaicIds).toPromise().then(mosaics => {
        if (!isShowExpired) {
            let s = 0;
            mosaics.map((mosaic) => {
                const duration = mosaic['properties'].duration.compact();
                const createHeight = mosaic.height.compact();
                if (duration ===0 || duration + createHeight > Number(currentHeight)) {
                    s++;
                    mosaicInfoList.push(mosaic);
                }
            })
            return
        }else{
            mosaicInfoList = mosaics;
        }
    }).catch((_) => {
        return
    })
    return mosaicInfoList
}

export const buildMosaicList = (mosaicList: Mosaic[], coin1: string, coin2: string,currentXem:string): any => {
    const mosaicListRst = mosaicList.map((mosaic: any) => {
        mosaic._amount = mosaic.amount.compact()
        mosaic.value = mosaic.id.toHex()
        if (mosaic.value == coin1 || mosaic.value == coin2) {
            mosaic.label = currentXem + ' (' + mosaic._amount + ')'
        } else {
            mosaic.label = mosaic.id.toHex() + ' (' + mosaic._amount + ')'
        }
        return mosaic
    })
    let isCoinExist = mosaicListRst.every((mosaic) => {
        if (mosaic.value == coin1 || mosaic.value == coin2) {
            return false
        }
        return true
    })
    if (isCoinExist) {
        mosaicListRst.unshift({
            value: coin1,
            label: 'nem.xem'
        })
    }
    return mosaicListRst
}

