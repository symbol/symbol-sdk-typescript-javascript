import {AccountHttp, Address, EncryptedMessage} from 'nem2-sdk'
import {WebClient} from "@/core/utils/web"
import {sdkApi} from "@/core/api/apis";

export const accountApi: sdkApi.account = {
    getAccountsNames: async (params) => {
        const addressList = params.addressList
        const node = params.node
        const namespaceList = await (new AccountHttp(node)).getAccountsNames(addressList)
        return {
            result: {
                namespaceList: namespaceList
            }
        }
    },

    getAccountInfo: async (params) => {
        const address = Address.createFromRawAddress(params.address)
        const node: string = params.node
        const accountInfo = await new AccountHttp(node).getAccountInfo(address)
        return {
            result: {
                accountInfo: accountInfo
            }
        }
    },

    sign: async (params) => {
        const account = params.account
        const transaction = params.transaction
        const signature = await account.sign(transaction, params.generationHash)
        return {
            result: {
                signature: signature
            }
        }
    },

    getMultisigAccountInfo: async (params) => {
        const address = Address.createFromRawAddress(params.address)
        const node: string = params.node
        let multisigAccountInfo: any = {}
        try {
            multisigAccountInfo = await new AccountHttp(node).getMultisigAccountInfo(address)
        } catch (e) {
            console.log(e)
        }

        return {
            result: {
                multisigAccountInfo: multisigAccountInfo
            }
        }
    },

    getMultisigAccountGraphInfo: async (params) => {
        const address = Address.createFromRawAddress(params.address)
        const node: string = params.node
        const multisigAccountGraphInfo = await new AccountHttp(node).getMultisigAccountGraphInfo(address)
        return {
            result: {
                multisigAccountGraphInfo: multisigAccountGraphInfo
            }
        };
    },

    encryptMessage: async (params) => {
        const message = params.message
        const recipientPublicAccount = params.recipientPublicAccount
        const privateKey = params.privateKey
        const encryptMessage = await EncryptedMessage.create(message, recipientPublicAccount, privateKey)
        return {
            result: {
                encryptMessage: encryptMessage
            }
        }
    },

    decryptMessage: async (params) => {
        const encryptMessage = params.encryptMessage
        const senderPublicAccount = params.senderPublicAccount
        const privateKey = params.privateKey
        const decryptMessage = await EncryptedMessage.decrypt(encryptMessage, privateKey, senderPublicAccount)
        return {
            result: {
                decryptMessage: decryptMessage
            }
        }
    },

    getLinkedPublickey: async (params) => {
        const {node, address} = params
        const url = `${node}/account/${address}`
        const resStr: any = await WebClient.request('', {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (JSON.parse(resStr) && JSON.parse(resStr).account && JSON.parse(resStr).account.linkedAccountKey) {
            let linkedPublicKey = JSON.parse(resStr).account.linkedAccountKey
            linkedPublicKey = Buffer.from(linkedPublicKey, 'base64').toString('hex').toUpperCase()
            return {
                result: {
                    linkedPublicKey: linkedPublicKey
                }
            }
        }

        return {
            result: {
                linkedPublicKey: ''
            }
        }
    },

    // getAccountProperties: async (params) => {
    //     const {node, address} = params
    //
    //     const accountHttp = new AccountHttp(node)
    //     const accountPropertiesInfo = await accountHttp.getAccountProperties(Address.createFromRawAddress(address.trim()))
    //     return {
    //         result: {
    //             accountPropertiesInfo: ''
    //         }
    //     }
    // }
}
