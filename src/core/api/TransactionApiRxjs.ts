import {
    TransactionHttp,
    AccountHttp,
    TransferTransaction,
    Deadline,
    Address,
    UInt64,
    Message,
    AggregateTransaction,
    TransactionType,
    HashLockTransaction,
    Mosaic,
    MosaicId,
    Transaction, Account, PublicAccount, Listener
} from 'nem2-sdk'
import {filter, mergeMap} from "rxjs/operators"
import {from as observableFrom, Observable} from "rxjs";

export class TransactionApiRxjs  {

    announce(signature: any,
             node: string) {
        return observableFrom(new TransactionHttp(node).announce(signature))

    }

    _announce(
        transaction: Transaction,
        node: string,
        account: Account,
        generationHash: string
    ) {
        const signedTransaction = account.sign(transaction, generationHash);
        return observableFrom(new TransactionHttp(node).announce(signedTransaction))

    }


    transferTransaction(
        network: number,
        MaxFee: number,
        receive: any,
        mosaics: any,
        MessageType: number,
        message: string
    ) {
        const transactionType = TransactionType.TRANSFER;
        const deadline = Deadline.create();
        const MaxFeeUInt = UInt64.fromUint(MaxFee);
        receive = Address.createFromRawAddress(receive);
        // @ts-ignore
        const msg = new Message(MessageType, message);
        return TransferTransaction.create(deadline, receive, mosaics, msg, network, MaxFeeUInt)
    }

    aggregateCompleteTransaction(network: number,
                                 MaxFee: number,
                                 transactions: any) {
        return AggregateTransaction.createComplete(
            Deadline.create(),
            transactions,
            network,
            [],
            UInt64.fromUint(MaxFee),
        );

    }


    aggregateBondedTransaction(network: number,
                               transactions: any) {
        const deadline = Deadline.create()
        return AggregateTransaction.createBonded(
            deadline,
            transactions,
            network,
        );
    }


    getTransaction(transactionId: string,
                   node: string) {
        return observableFrom(new TransactionHttp(node).getTransaction(transactionId))
    }

    getTransactionStatus(hash: string,
                         node: string) {
        return observableFrom(new TransactionHttp(node).getTransactionStatus(hash))

    }

    transactions(publicAccount: PublicAccount,
                 queryParams: any,
                 node: string) {
        return observableFrom(new AccountHttp(node).transactions(publicAccount, queryParams))
    }

    incomingTransactions(publicAccount: PublicAccount,
                         queryParams: any,
                         node: string) {
        return observableFrom(new AccountHttp(node).incomingTransactions(publicAccount, queryParams))
    }

    outgoingTransactions(publicAccount: PublicAccount,
                         queryParams: any,
                         node: string) {

        return observableFrom(new AccountHttp(node).outgoingTransactions(publicAccount, queryParams))
    }

    unconfirmedTransactions(publicAccount: PublicAccount,
                            queryParams: any,
                            node: string) {

        return observableFrom(new AccountHttp(node).unconfirmedTransactions(publicAccount, queryParams))
    }

    getAggregateBondedTransactions(publicAccount: any,
                                   queryParams: any,
                                   node: string) {
        return observableFrom(new AccountHttp(node).aggregateBondedTransactions(publicAccount, queryParams))
    }

    announceAggregateBonded(signedTransaction: any,
                            node: string) {
        return observableFrom(new TransactionHttp(node).announceAggregateBonded(signedTransaction))

    }

    announceBondedWithLock(aggregateTransaction: AggregateTransaction,
                           account: Account,
                           listener: Listener,
                           node: string,
                           generationHash: string,
                           networkType,
                           fee,
                           mosaicHex: string) {
        const transactionHttp = new TransactionHttp(node);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            new Mosaic(new MosaicId(mosaicHex), UInt64.fromUint(10000000)),
            UInt64.fromUint(480),
            signedTransaction,
            networkType,
            UInt64.fromUint(fee)
        );
        const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
        listener.open().then(() => {
            transactionHttp
                .announce(hashLockTransactionSigned)
                .subscribe(x => console.log(x), err => console.error(err));
            listener
                .confirmed(account.address)
                .pipe(
                    filter((transaction) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === hashLockTransactionSigned.hash),
                    mergeMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction)),
                )
                .subscribe(announcedAggregateBonded => console.log(announcedAggregateBonded),
                    err => console.error(err));
        }).catch((error) => {
            console.log(error)
        })
    }

    getTransactionEffectiveFee(node: string,
                               hash: string) {
        const transactionHttp = new TransactionHttp(node)
        return observableFrom(transactionHttp.getTransactionEffectiveFee(hash))

    }
}
