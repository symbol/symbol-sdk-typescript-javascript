import {SdkV0} from "./sdkDefine";
import {AccountHttp, Address, EncryptedMessage} from 'nem2-sdk'

export const accountInterface: SdkV0.account = {
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
    }
}
