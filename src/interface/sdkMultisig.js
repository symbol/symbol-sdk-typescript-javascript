var _this = this;
import * as tslib_1 from "tslib";
import { Deadline, UInt64, NetworkType, PublicAccount, MosaicId, Mosaic, AggregateTransaction, ModifyMultisigAccountTransaction, HashLockTransaction, TransactionHttp, AccountHttp, Address } from 'nem2-sdk';
import { filter } from "rxjs/operators";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
export var multisigInterface = {
    /*
    multisign coversion
    * */
    covertToBeMultisig: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, generationHash, node, listener, fee, transactionHttp, modifyMultisigAccountTransaction, aggregateTransaction, signedTransaction, hashLockTransaction, hashLockTransactionSigned;
        return tslib_1.__generator(this, function (_a) {
            minApprovalDelta = params.minApprovalDelta, minRemovalDelta = params.minRemovalDelta, multisigCosignatoryModificationList = params.multisigCosignatoryModificationList, networkType = params.networkType, account = params.account, generationHash = params.generationHash, node = params.node, listener = params.listener, fee = params.fee;
            transactionHttp = new TransactionHttp(node);
            modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(Deadline.create(), minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, UInt64.fromUint(fee));
            aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)], networkType, [], UInt64.fromUint(fee));
            signedTransaction = account.sign(aggregateTransaction, generationHash);
            hashLockTransaction = HashLockTransaction.create(Deadline.create(), 
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)), UInt64.fromUint(480), signedTransaction, networkType, UInt64.fromUint(fee));
            hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
            console.log('hashLockTransactionSigned', hashLockTransactionSigned);
            console.log('signedTransaction', signedTransaction);
            listener.open().then(function () {
                transactionHttp
                    .announce(hashLockTransactionSigned)
                    .subscribe(function (x) { return console.log(x); }, function (err) { return console.error(err); });
                listener
                    .confirmed(account.address)
                    .pipe(filter(function (transaction) { return transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === hashLockTransactionSigned.hash; }), mergeMap(function (ignored) { return transactionHttp.announceAggregateBonded(signedTransaction); }))
                    .subscribe(function (announcedAggregateBonded) { return console.log(announcedAggregateBonded); }, function (err) { return console.error(err); });
            });
            return [2 /*return*/, {
                    result: {
                        result: ''
                    }
                }];
        });
    }); },
    getMultisigAccountInfo: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var address, node, accountHttp, multisigInfo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = params.address, node = params.node;
                    accountHttp = new AccountHttp(node);
                    return [4 /*yield*/, accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(address)).toPromise()];
                case 1:
                    multisigInfo = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                multisigInfo: multisigInfo
                            }
                        }];
            }
        });
    }); },
    multisetCosignatoryModification: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var multisigPublickey, minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, generationHash, node, listener, fee, multisigPublicAccount, transactionHttp, modifyMultisigAccountTransaction, aggregateTransaction, signedTransaction, hashLockTransaction, hashLockTransactionSigned;
        return tslib_1.__generator(this, function (_a) {
            multisigPublickey = params.multisigPublickey, minApprovalDelta = params.minApprovalDelta, minRemovalDelta = params.minRemovalDelta, multisigCosignatoryModificationList = params.multisigCosignatoryModificationList, networkType = params.networkType, account = params.account, generationHash = params.generationHash, node = params.node, listener = params.listener, fee = params.fee;
            multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublickey, NetworkType.MIJIN_TEST);
            transactionHttp = new TransactionHttp(node);
            modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(Deadline.create(), Number(minApprovalDelta), Number(minRemovalDelta), multisigCosignatoryModificationList, networkType);
            aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), [modifyMultisigAccountTransaction.toAggregate(multisigPublicAccount)], networkType, [], UInt64.fromUint(fee));
            signedTransaction = account.sign(aggregateTransaction, generationHash);
            hashLockTransaction = HashLockTransaction.create(Deadline.create(), 
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)), UInt64.fromUint(480), signedTransaction, networkType, UInt64.fromUint(fee));
            hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
            console.log('hashLockTransactionSigned', hashLockTransactionSigned);
            console.log('signedTransaction', signedTransaction);
            listener.open().then(function () {
                transactionHttp
                    .announce(hashLockTransactionSigned)
                    .subscribe(function (x) { return console.log(x); }, function (err) { return console.error(err); });
                listener
                    .confirmed(account.address)
                    .pipe(filter(function (transaction) { return transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === hashLockTransactionSigned.hash; }), mergeMap(function (ignored) { return transactionHttp.announceAggregateBonded(signedTransaction); }))
                    .subscribe(function (announcedAggregateBonded) { return console.log(announcedAggregateBonded); }, function (err) { return console.error(err); });
            });
            return [2 /*return*/, {
                    result: {
                        result: ''
                    }
                }];
        });
    }); },
    bondedMultisigTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var transaction, multisigPublickey, networkType, account, generationHash, node, listener, fee, transactionHttp, aggregateTransaction, signedTransaction, hashLockTransaction, hashLockTransactionSigned;
        return tslib_1.__generator(this, function (_a) {
            transaction = params.transaction, multisigPublickey = params.multisigPublickey, networkType = params.networkType, account = params.account, generationHash = params.generationHash, node = params.node, listener = params.listener, fee = params.fee;
            transactionHttp = new TransactionHttp(node);
            aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))], networkType, [], UInt64.fromUint(fee));
            signedTransaction = account.sign(aggregateTransaction, generationHash);
            hashLockTransaction = HashLockTransaction.create(Deadline.create(), 
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)), UInt64.fromUint(480), signedTransaction, networkType, UInt64.fromUint(fee));
            hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
            console.log('hashLockTransactionSigned', hashLockTransactionSigned);
            console.log('signedTransaction', signedTransaction);
            listener.open().then(function () {
                transactionHttp
                    .announce(hashLockTransactionSigned)
                    .subscribe(function (x) { return console.log(x); }, function (err) { return console.error(err); });
                listener
                    .confirmed(account.address)
                    .pipe(filter(function (transaction) { return transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === hashLockTransactionSigned.hash; }), mergeMap(function (ignored) { return transactionHttp.announceAggregateBonded(signedTransaction); }))
                    .subscribe(function (announcedAggregateBonded) { return console.log(announcedAggregateBonded); }, function (err) { return console.error(err); });
            });
            console.log(signedTransaction);
            return [2 /*return*/, {
                    result: {
                        result: ''
                    }
                }];
        });
    }); },
    completeMultisigTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var transaction, multisigPublickey, networkType, account, generationHash, node, fee, transactionHttp, aggregateTransaction, signedTransaction;
        return tslib_1.__generator(this, function (_a) {
            transaction = params.transaction, multisigPublickey = params.multisigPublickey, networkType = params.networkType, account = params.account, generationHash = params.generationHash, node = params.node, fee = params.fee;
            transactionHttp = new TransactionHttp(node);
            aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))], networkType, [], UInt64.fromUint(fee));
            signedTransaction = account.sign(aggregateTransaction, generationHash);
            console.log(signedTransaction);
            transactionHttp.announce(signedTransaction).subscribe(function (x) { return console.log(x); }, function (err) { return console.error(err); });
            return [2 /*return*/, {
                    result: {
                        result: ''
                    }
                }];
        });
    }); },
    completeCosignatoryModification: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var multisigPublickey, minApprovalDelta, minRemovalDelta, networkType, account, generationHash, node, fee, multisigCosignatoryModificationList, multisigPublicAccount, modifyMultisigAccountTx, aggregateTransaction, signedTransaction, announceStatus;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    multisigPublickey = params.multisigPublickey, minApprovalDelta = params.minApprovalDelta, minRemovalDelta = params.minRemovalDelta, networkType = params.networkType, account = params.account, generationHash = params.generationHash, node = params.node, fee = params.fee, multisigCosignatoryModificationList = params.multisigCosignatoryModificationList;
                    multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublickey, networkType);
                    modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(Deadline.create(), Number(minApprovalDelta), Number(minRemovalDelta), multisigCosignatoryModificationList, networkType, UInt64.fromUint(fee));
                    aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), [modifyMultisigAccountTx.toAggregate(multisigPublicAccount)], networkType, [], UInt64.fromUint(fee));
                    signedTransaction = account.sign(aggregateTransaction, generationHash);
                    console.log(signedTransaction, 'completeCosignatoryModification');
                    return [4 /*yield*/, new TransactionHttp(node).announce(signedTransaction)];
                case 1:
                    announceStatus = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                result: ''
                            }
                        }];
            }
        });
    }); }
};
//# sourceMappingURL=sdkMultisig.js.map