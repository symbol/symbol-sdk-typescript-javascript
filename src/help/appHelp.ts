import {localRead, localSave} from "@/help/help";
import {walletInterface} from "@/interface/sdkWallet";
import {accountInterface} from "@/interface/sdkAccount";
import {Address, Crypto} from 'nem2-sdk'
import {aliasInterface} from "@/interface/sdkNamespace";
import {multisigInterface} from "@/interface/sdkMultisig";

export const saveLocalWallet = (wallet, encryptObj, index, mnemonicEnCodeObj?) => {
    let localData: any[] = []
    let isExist: boolean = false
    try {
        localData = JSON.parse(localRead('wallets'))
    } catch (e) {
        localData = []
    }
    let saveData = {
        name: wallet.name,
        ciphertext: encryptObj?  encryptObj.ciphertext : localData[index].ciphertext,
        iv: encryptObj? encryptObj.iv : localData[index].iv,
        networkType: wallet.networkType,
        address: wallet.address,
        publicKey: wallet.publicKey,
        mnemonicEnCodeObj: mnemonicEnCodeObj || wallet.mnemonicEnCodeObj
    }
    let account = wallet
    account = Object.assign(account, saveData)
    for (let i in localData) {
        if (localData[i].address === account.address) {
            localData[i] = saveData
            isExist = true
        }
    }
    if (!isExist) localData.unshift(saveData)
    localSave('wallets', JSON.stringify(localData))
    return account
}

export const getAccountDefault = async (name, account, netType, node, currentXEM1, currentXEM2) => {
    let storeWallet = {}
    await walletInterface.getWallet({
        name: name,
        networkType: netType,
        privateKey: account.privateKey
    }).then(async (Wallet: any) => {
        storeWallet = {
            name: Wallet.result.wallet.name,
            address: Wallet.result.wallet.address['address'],
            networkType: Wallet.result.wallet.address['networkType'],
            privateKey: Wallet.result.privateKey,
            publicKey: account.publicKey,
            publicAccount: account.publicAccount,
            mosaics: [],
            wallet: Wallet.result.wallet,
            password: Wallet.result.password,
            balance: 0
        }
        await setWalletMosaic(storeWallet, node, currentXEM1, currentXEM2).then((data) => {
            storeWallet = data
        })
        await setMultisigAccount(storeWallet, node).then((data) => {
            storeWallet = data
        })
    })
    return storeWallet
}

export const setWalletMosaic = async(storeWallet, node, currentXEM1, currentXEM2) => {
    let wallet = storeWallet
    await accountInterface.getAccountInfo({
        node,
        address: wallet.address
    }).then(async accountInfoResult => {
        await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
            let mosaicList = accountInfo.mosaics
            mosaicList.map((item) => {
                item.hex = item.id.toHex()
                if (item.id.toHex() == currentXEM2 || item.id.toHex() == currentXEM1) {
                    wallet.balance = item.amount.compact() / 1000000
                }
            })
            wallet.mosaics = mosaicList
        }, () => {
            wallet.balance = 0
            wallet.mosaics = []
        })
    })
    return wallet
}

export const setMultisigAccount = async(storeWallet, node) => {
    let wallet = storeWallet
    await accountInterface.getMultisigAccountInfo({
        node: node,
        address: wallet.address
    }).then((multisigAccountInfo) => {
        if (typeof (multisigAccountInfo.result.multisigAccountInfo) == 'object') {
            multisigAccountInfo.result.multisigAccountInfo['subscribe']((accountInfo) => {
                wallet.isMultisig = true
            }, () => {
                wallet.isMultisig = false
            })
        }
    })
    return wallet
}

export const getNamespaces = async (address, node) =>{
    await aliasInterface.getNamespacesFromAccount({
        address: Address.createFromRawAddress(address),
        url: node
    }).then((namespacesFromAccount)=>{
        let list = []
        let namespace = {}
        namespacesFromAccount.result.namespaceList
            .sort((a,b)=>{
                return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
            }).map((item, index)=>{
            if(!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())){
                namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
            }else {
                return
            }
            let namespaceName = ''
            item.namespaceInfo.levels.map((item, index)=>{
                namespaceName += namespace[item.id.toHex()] +'.'
            })
            namespaceName = namespaceName.slice(0, namespaceName.length - 1)
            const newObj ={
                value: namespaceName,
                label: namespaceName,
                alias: item.namespaceInfo.alias,
                levels: item.namespaceInfo.levels.length,
                name: namespaceName,
                duration: item.namespaceInfo.endHeight.compact(),
            }
            list.push(newObj)
        })
        return list
    })
}

export const createRootNamespace = (namespaceName, duration, networkType, maxFee) => {
    return aliasInterface.createdRootNamespace({
        namespaceName: namespaceName,
        duration: duration,
        networkType: networkType,
        maxFee: maxFee
    }).then((transaction)=>{
        return transaction.result.rootNamespaceTransaction
    })
}

export const  createSubNamespace = (rootNamespaceName, subNamespaceName, networkType, maxFee) => {
    return aliasInterface.createdSubNamespace({
        parentNamespace: rootNamespaceName,
        namespaceName: subNamespaceName,
        networkType: networkType,
        maxFee: maxFee
    }).then((transaction) => {
        return transaction.result.subNamespaceTransaction
    })
}
export const multisigAccountInfo = (address, node) => {
    return multisigInterface.getMultisigAccountInfo({
        address,
        node
    }).then((result) => {
        return result.result.multisigInfo
    })
}

export const encryptKey = (data, password) => {
    return Crypto.encrypt(data, password)
}

export const decryptKey = (wallet, password)=> {
    let encryptObj = {
        ciphertext: wallet.ciphertext,
        iv: wallet.iv.data ? wallet.iv.data : wallet.iv,
        key: password
    }
    return Crypto.decrypt(encryptObj)
}
