import {
    Deadline,
    UInt64,
    NetworkType,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    PublicAccount,
    MosaicId,
    Mosaic,
    AggregateTransaction,
    ModifyMultisigAccountTransaction, HashLockTransaction, NetworkCurrencyMosaic, TransactionHttp, AccountHttp, Address
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";
import {filter} from "rxjs/operators";
import {mergeMap} from "rxjs/internal/operators/mergeMap";

export const multisigInterface: SdkV0.multisig = {
    /*
    multisign coversion
    * */
    covertToBeMultisig: async (params) => {
        const {minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, generationHash, node, listener, fee} = params
        const transactionHttp = new TransactionHttp(node);

        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            minApprovalDelta,
            minRemovalDelta,
            multisigCosignatoryModificationList,
            networkType,
            UInt64.fromUint(fee)
        );
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)),
            UInt64.fromUint(480),
            signedTransaction,
            networkType,
            UInt64.fromUint(fee)
        );
        const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);

        console.log('hashLockTransactionSigned', hashLockTransactionSigned)
        console.log('signedTransaction', signedTransaction)
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
        });

        return {
            result: {
                result: ''
            }
        };
    },

    getMultisigAccountInfo: async (params) => {
        const {address, node} = params
        const accountHttp = new AccountHttp(node)
        const multisigInfo = await accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(address)).toPromise();
        return {
            result: {
                multisigInfo: multisigInfo
            }
        }
    },


    multisetCosignatoryModification: async (params) => {
        const {multisigPublickey, minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, generationHash, node, listener, fee} = params
        const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublickey, NetworkType.MIJIN_TEST)
        const transactionHttp = new TransactionHttp(node)
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            Number(minApprovalDelta),
            Number(minRemovalDelta),
            multisigCosignatoryModificationList,
            networkType,
        );
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [modifyMultisigAccountTransaction.toAggregate(multisigPublicAccount)],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        const signedTransaction = account.sign(
            aggregateTransaction,
            generationHash,
        );
        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)),
            UInt64.fromUint(480),
            signedTransaction,
            networkType,
            UInt64.fromUint(fee)
        );
        const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
        console.log('hashLockTransactionSigned', hashLockTransactionSigned)
        console.log('signedTransaction', signedTransaction)
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
        });
        return {
            result: {
                result: ''
            }
        }

    },

    bondedMultisigTransaction: async (params) => {
        const {transaction, multisigPublickey, networkType, account, generationHash, node, listener, fee} = params
        const transactionHttp = new TransactionHttp(node);

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)),
            UInt64.fromUint(480),
            signedTransaction,
            networkType,
            UInt64.fromUint(fee)
        );
        const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);

        console.log('hashLockTransactionSigned', hashLockTransactionSigned)
        console.log('signedTransaction', signedTransaction)
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
        });
        console.log(signedTransaction)
        return {
            result: {
                result: ''
            }
        }
    },

    completeMultisigTransaction: async (params) => {
        const {transaction, multisigPublickey, networkType, account, generationHash, node, fee} = params
        const transactionHttp = new TransactionHttp(node);

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        console.log(signedTransaction)
        transactionHttp.announce(signedTransaction).subscribe(x => console.log(x), err => console.error(err));
        return {
            result: {
                result: ''
            }
        }
    },


    completeCosignatoryModification: async (params) => {
        const {multisigPublickey, minApprovalDelta, minRemovalDelta, networkType, account, generationHash, node, fee} = params
        const multisigPublicAccount = PublicAccount.createFromPublicKey(
            multisigPublickey, networkType,
        );
        const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            Number(minApprovalDelta),
            Number(minRemovalDelta),
            [],
            networkType,
            UInt64.fromUint(fee)
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [modifyMultisigAccountTx.toAggregate(multisigPublicAccount)],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash)
        console.log(signedTransaction)
        const announceStatus = await new TransactionHttp(node).announce(signedTransaction);

        return {
            result: {
                result: ''
            }
        }
    }
}
