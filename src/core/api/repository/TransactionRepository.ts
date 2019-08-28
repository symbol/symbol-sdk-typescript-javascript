import {
    Account,
    AggregateTransaction,
    Listener,
    PublicAccount, Transaction, TransferTransaction,
} from "nem2-sdk";
import { Observable, Subscribable, Subscription } from "rxjs";

export interface TransactionRepository {
    announce(
        signature: any,
        node: string): Observable<any>;

    _announce(
        transaction: Transaction,
        node: string,
        account: Account,
        generationHash: string): Observable<any>;

    transferTransaction(
        network: number,
        MaxFee: number,
        receive: any,
        mosaics: any,
        MessageType: number,
        message: string,
    ): TransferTransaction;


    aggregateCompleteTransaction(
        network: number,
        MaxFee: number,
        transactions: any,
    ): AggregateTransaction;


    aggregateBondedTransaction(
        network: number,
        transactions: any,
    ): AggregateTransaction;


    getTransaction(
        transactionId: string,
        node: string
    ): Observable<any>;


    getTransactionStatus(
        hash: string,
        node: string
    ): Observable<any>;

    transactions(
        publicAccount: PublicAccount,
        queryParams: any,
        node: string
    ): Observable<any>;

    incomingTransactions(
        publicAccount: PublicAccount,
        queryParams: any,
        node: string
    ): Observable<any>;

    outgoingTransactions(
        publicAccount: PublicAccount,
        queryParams: any,
        node: string
    ): Observable<any>;


    unconfirmedTransactions(
        publicAccount: PublicAccount,
        queryParams: any,
        node: string
    ): Observable<any>;


    getAggregateBondedTransactions(
        publicAccount: any,
        queryParams: any,
        node: string
    ): Observable<any>;


    announceAggregateBonded(
        signedTransaction: any,
        node: string
    ): Observable<any>;


    announceBondedWithLock(
        aggregateTransaction: AggregateTransaction,
        account: Account,
        listener: Listener,
        node: string,
        generationHash: string,
        networkType,
        fee,
        mosaicHex: string
    ): void;


    getTransactionEffectiveFee(
        node: string,
        hash: string
    ): Observable<any>;

}
