import { AccountHttp, Address, EncryptedMessage } from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";

export const accountInterface:SdkV0.account = {

  getAccountInfo: async (params) => {
    const address = Address.createFromRawAddress(params.address)
    const node:string = params.node
    const accountInfo = await new AccountHttp(node).getAccountInfo(address)
    return {
      result: {
        accountInfo: accountInfo
      }
    }
  },

  sign: async (params) => {
    const wallet = params.wallet
    const transaction = params.transaction
    const signature = await wallet.open(params.password).sign(transaction,params.generationHash)
    return {
      result: {
        signature: signature
      }
    }
  },

  getMultisigAccountInfo: async (params) => {
    const address = Address.createFromRawAddress(params.address)
    const node:string = params.node
    let multisigAccountInfo:any = {}
    try {
      multisigAccountInfo = await new AccountHttp(node).getMultisigAccountInfo(address)
    } catch (e) {
      multisigAccountInfo = 'no multisig'
    }

    return {
      result: {
        multisigAccountInfo: multisigAccountInfo
      }
    }
  },

  getMultisigAccountGraphInfo: async (params) => {
    const address = Address.createFromRawAddress(params.address)
    const node:string = params.node
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
    const decryptMessage = await EncryptedMessage.decrypt(encryptMessage,privateKey,senderPublicAccount)
    return {
      result: {
        decryptMessage: decryptMessage
      }
    }
  }
}
