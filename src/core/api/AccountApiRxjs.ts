import {Account, AccountHttp, Address, EncryptedMessage, Transaction} from 'nem2-sdk'
import {WebClient} from "@/core/utils/web.ts"
import {Observable, from as observableFrom} from 'rxjs'

export class AccountApiRxjs {

    /**
     *  getAccountsNames
     * @param addressList
     * @param node
     */
    public getAccountsNames(addressList: Array<Address>, node: string): Observable<any> {
        return observableFrom(
            new AccountHttp(node).getAccountsNames(addressList)
        )
    }

    /**
     *  getAccountInfo
     * @param address
     * @param node
     */
    public getAccountInfo(address: string, node: string) {
        const accountAddress = Address.createFromRawAddress(address)
        return observableFrom(new AccountHttp(node).getAccountInfo(accountAddress))
    }

    /**
     *  sign
     * @param account
     * @param transaction
     * @param generationHash
     */
    public sign(account: Account, transaction: Transaction, generationHash: any) {
        return account.sign(transaction, generationHash)
    }

    /**
     *  getMultisigAccountInfo
     * @param address
     * @param node
     */
    public getMultisigAccountInfo(address: string, node: string) {
        const accountAddress = Address.createFromRawAddress(address)
        return new AccountHttp(node).getMultisigAccountInfo(accountAddress)
    }


    /**
     *  getMultisigAccountInfo
     * @param address
     * @param node
     */
    getMultisigAccountGraphInfo(address: string, node: string) {
        const accountAddress = Address.createFromRawAddress(address)
        return observableFrom(new AccountHttp(node).getMultisigAccountGraphInfo(accountAddress))

    }

    /**
     *  encryptMessage
     * @param message
     * @param recipientPublicAccount
     * @param privateKey
     */
    encryptMessage(message: string, recipientPublicAccount: any, privateKey: string) {
        return EncryptedMessage.create(message, recipientPublicAccount, privateKey)
    }


    decryptMessage(encryptMessage: any, senderPublicAccount: any, privateKey: string) {
        return EncryptedMessage.decrypt(encryptMessage, privateKey, senderPublicAccount)

    }

    getLinkedPublickey(node: string, address: string) {
        const url = `${node}/account/${address}`
        WebClient.request('', {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return observableFrom(WebClient.request('', {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }))
    }

}
