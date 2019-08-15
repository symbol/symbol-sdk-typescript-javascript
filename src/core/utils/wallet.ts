import {localRead, localSave} from "@/core/utils/utils"

import {
    Account,
    AccountPropertyModification,
    Address,
    Crypto,
    NetworkType,
    PropertyType,
    Transaction,
    UInt64,
    PropertyModificationType,
    MosaicId
} from 'nem2-sdk'
import {walletApi} from "@/core/api/walletApi";
import {accountApi} from "@/core/api/accountApi";
import {namespaceApi} from "@/core/api/namespaceApi";
import {multisigApi} from "@/core/api/multisigApi";
import {filterApi} from "@/core/api/filterApi";

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
        ciphertext: encryptObj ? encryptObj.ciphertext : localData[index].ciphertext,
        iv: encryptObj ? encryptObj.iv : localData[index].iv,
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

export const getAccountDefault = async (name, account, netType, node?, currentXEM1?, currentXEM2?) => {
    let storeWallet = {}
    await walletApi.getWallet({
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
        if (!node) return storeWallet
        await setWalletMosaic(storeWallet, node, currentXEM1, currentXEM2).then((data) => {
            storeWallet = data
        })
        await setMultisigAccount(storeWallet, node).then((data) => {
            storeWallet = data
        })
    })
    return storeWallet
}

export const setWalletMosaic = async (storeWallet, node, currentXEM1, currentXEM2) => {
    let wallet = storeWallet
    await accountApi.getAccountInfo({
        node,
        address: wallet.address
    }).then(accountInfoResult => {
        accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
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

export const setMultisigAccount = async (storeWallet, node) => {
    let wallet = storeWallet
    await accountApi.getMultisigAccountInfo({
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

export const getNamespaces = async (address, node) => {
    let list = []
    let namespace = {}
    await namespaceApi.getNamespacesFromAccount({
        address: Address.createFromRawAddress(address),
        url: node
    }).then((namespacesFromAccount) => {
        namespacesFromAccount.result.namespaceList
            .sort((a, b) => {
                return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
            }).map((item, index) => {
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
    return namespaceApi.createdRootNamespace({
        namespaceName: namespaceName,
        duration: duration,
        networkType: networkType,
        maxFee: maxFee
    }).then((transaction) => {
        return transaction.result.rootNamespaceTransaction
    })
}

export const createSubNamespace = (rootNamespaceName, subNamespaceName, networkType, maxFee) => {
    return namespaceApi.createdSubNamespace({
        parentNamespace: rootNamespaceName,
        namespaceName: subNamespaceName,
        networkType: networkType,
        maxFee: maxFee
    }).then((transaction) => {
        return transaction.result.subNamespaceTransaction
    })
}
export const multisigAccountInfo = (address, node) => {
    return multisigApi.getMultisigAccountInfo({
        address,
        node
    }).then((result) => {
        return result.result.multisigInfo
    })
}

export const encryptKey = (data, password) => {
    return Crypto.encrypt(data, password)
}

export const decryptKey = (wallet, password) => {
    let encryptObj = {
        ciphertext: wallet.ciphertext,
        iv: wallet.iv.data ? wallet.iv.data : wallet.iv,
        key: password
    }
    return Crypto.decrypt(encryptObj)
}


export const createBondedMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, account: Account, fee: number) => {
    return multisigApi.bondedMultisigTransaction({
        transaction,
        multisigPublickey,
        networkType,
        account,
        fee
    }).then((result) => {
        return result.result.aggregateTransaction
    })
}

export const createCompleteMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, fee: number) => {
    return multisigApi.completeMultisigTransaction({
        transaction,
        multisigPublickey,
        networkType,
        fee
    }).then((result) => {
        return result.result.aggregateTransaction
    })
}

export const creatrModifyAccountPropertyTransaction = (propertyType: PropertyType, modifications: Array<any>, networkType: NetworkType, fee: number,) => {
    //address
    if (propertyType === PropertyType.BlockAddress || propertyType === PropertyType.AllowAddress) {
        modifications = modifications.map((item) => {
            return AccountPropertyModification.createForAddress(
                // TODO AFTER SDK COMPLETE  add PropertyModificationType
                PropertyModificationType.Remove,
                Address.createFromRawAddress(item.value)
            )
        })
        return filterApi.creatrModifyAccountPropertyAddressTransaction({
            propertyType,
            modifications,
            networkType,
            fee
        }).then((result) => {
            return result.result.modifyAccountPropertyAddressTransaction
        })
    }
    // entity type
    if (propertyType === PropertyType.BlockTransaction || propertyType === PropertyType.AllowTransaction) {
        modifications = modifications.map((item) => {
            return AccountPropertyModification.createForEntityType(
                // TODO AFTER SDK COMPLETE  add PropertyModificationType
                PropertyModificationType.Remove,
                item.value
            )
        })
        return filterApi.creatrModifyAccountPropertyEntityTypeTransaction({
            propertyType,
            modifications,
            networkType,
            fee
        }).then((result) => {
            return result.result.modifyAccountPropertyEntityTypeTransaction
        })
    }
    // mosaic
    if (propertyType === PropertyType.BlockMosaic || propertyType === PropertyType.AllowMosaic) {
        modifications = modifications.map((item) => {
            // TODO AFTER SDK COMPLETE  add PropertyModificationType
            return AccountPropertyModification.createForMosaic(
                PropertyModificationType.Remove,
                new MosaicId(item.value)
            )
        })
        return filterApi.creatrModifyAccountPropertyMosaicTransaction({
            propertyType,
            modifications,
            networkType,
            fee
        }).then((result) => {
            return result.result.modifyAccountPropertyMosaicTransaction
        })
    }


}

// export const getAccountProperties = (address: string, node: string) => {
//     // TODO sdk is not complete yet
//     // return accountInterface.getAccountProperties({
//     //     address,
//     //     node
//     // }).then((result) => {
//     //     return result.result.accountPropertiesInfo
//     // })
// }
