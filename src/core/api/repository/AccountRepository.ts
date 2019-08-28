import { Account, Address, EncryptedMessage, SignedTransaction, Transaction } from "nem2-sdk";
import { Observable } from "rxjs";

export interface AccountRepository {

    /**
     *  getAccountsNames
     * @param addressList
     * @param node
     */
    getAccountsNames(addressList: Array<Address>, node: string): Observable<any>;

    /**
     *  getAccountInfo
     * @param address
     * @param node
     */
    getAccountInfo(address: string, node: string): Observable<any>;

    /**
     *  sign
     * @param account
     * @param transaction
     * @param generationHash
     */
    sign(account: Account, transaction: Transaction, generationHash: any): SignedTransaction;


    /**
     *  getMultisigAccountInfo
     * @param address
     * @param node
     */
    getMultisigAccountInfo(address: string, node: string): Observable<any>;

    /**
     *  getMultisigAccountInfo
     * @param address
     * @param node
     */
    getMultisigAccountGraphInfo(address: string, node: string): Observable<any>;


    /**
     *  encryptMessage
     * @param message
     * @param recipientPublicAccount
     * @param privateKey
     */
    encryptMessage(message: string, recipientPublicAccount: any, privateKey: string): EncryptedMessage;

    /**
     *  decryptMessage
     * @param encryptMessage
     * @param senderPublicAccount
     * @param privateKey
     */
    decryptMessage(encryptMessage: any, senderPublicAccount: any, privateKey: string): EncryptedMessage;

    /**
     *  getLinkedPublickey
     * @param node
     * @param address
     */
    getLinkedPublickey(node: string, address: string): Observable<any>;
}
