var _this = this;
import * as tslib_1 from "tslib";
import { TransactionHttp, AccountHttp, TransferTransaction, Deadline, Address, UInt64, Message, AggregateTransaction, TransactionType, HashLockTransaction, Mosaic, MosaicId, ModifyAccountPropertyAddressTransaction } from 'nem2-sdk';
import { filter, mergeMap } from "rxjs/operators";
export var transactionInterface = {
    announce: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var signature, node, announceStatus;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signature = params.signature;
                    node = params.node;
                    return [4 /*yield*/, new TransactionHttp(node).announce(signature)];
                case 1:
                    announceStatus = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                announceStatus: announceStatus
                            }
                        }];
            }
        });
    }); },
    _announce: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var transaction, node, account, generationHash, signedTransaction, announceStatus;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transaction = params.transaction, node = params.node, account = params.account, generationHash = params.generationHash;
                    console.log(account, transaction);
                    signedTransaction = account.sign(transaction, generationHash);
                    return [4 /*yield*/, new TransactionHttp(node).announce(signedTransaction)];
                case 1:
                    announceStatus = _a.sent();
                    console.log(signedTransaction);
                    return [2 /*return*/, {
                            result: {
                                announceStatus: announceStatus
                            }
                        }];
            }
        });
    }); },
    // todo Account Restriction  after updating sdk
    accountAddressRestrictionModificationTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var propertyType, accountPropertyTransaction, networkType, fee, modifyAccountPropertyAddressTransaction;
        return tslib_1.__generator(this, function (_a) {
            propertyType = params.propertyType, accountPropertyTransaction = params.accountPropertyTransaction, networkType = params.networkType, fee = params.fee;
            modifyAccountPropertyAddressTransaction = ModifyAccountPropertyAddressTransaction.create(Deadline.create(), propertyType, accountPropertyTransaction, networkType, UInt64.fromUint(fee));
            return [2 /*return*/, {
                    result: {
                        modifyAccountPropertyAddressTransaction: modifyAccountPropertyAddressTransaction
                    }
                }];
        });
    }); },
    transferTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var network, transactionType, deadline, MaxFee, receive, mosaics, MessageType, message, transferTransaction;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = params.network;
                    transactionType = TransactionType.TRANSFER;
                    deadline = Deadline.create();
                    MaxFee = UInt64.fromUint(params.MaxFee);
                    receive = Address.createFromRawAddress(params.receive);
                    mosaics = params.mosaics;
                    MessageType = params.MessageType;
                    return [4 /*yield*/, new Message(MessageType, params.message)];
                case 1:
                    message = _a.sent();
                    return [4 /*yield*/, TransferTransaction.create(deadline, receive, mosaics, message, network, MaxFee)];
                case 2:
                    transferTransaction = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                transferTransaction: transferTransaction
                            }
                        }];
            }
        });
    }); },
    aggregateCompleteTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var network, deadline, maxFee, transactions, aggregateCompleteTransaction;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = params.network;
                    deadline = Deadline.create();
                    maxFee = UInt64.fromUint(params.MaxFee);
                    transactions = params.transactions;
                    return [4 /*yield*/, AggregateTransaction.createComplete(deadline, transactions, network, [], maxFee)];
                case 1:
                    aggregateCompleteTransaction = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                aggregateCompleteTransaction: aggregateCompleteTransaction
                            }
                        }];
            }
        });
    }); },
    aggregateBondedTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var network, deadline, transactions, aggregateBondedTransaction;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = params.network;
                    deadline = Deadline.create();
                    transactions = params.transactions;
                    return [4 /*yield*/, AggregateTransaction.createBonded(deadline, transactions, network)];
                case 1:
                    aggregateBondedTransaction = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                aggregateBondedTransaction: aggregateBondedTransaction
                            }
                        }];
            }
        });
    }); },
    getTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var id, node, transactionInfoThen;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = params.transactionId;
                    node = params.node;
                    return [4 /*yield*/, new TransactionHttp(node).getTransaction(id)];
                case 1:
                    transactionInfoThen = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                transactionInfoThen: transactionInfoThen
                            }
                        }];
            }
        });
    }); },
    getTransactionStatus: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var hash, node, transactionStatusThen;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hash = params.hash;
                    node = params.node;
                    return [4 /*yield*/, new TransactionHttp(node).getTransactionStatus(hash)];
                case 1:
                    transactionStatusThen = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                transactionStatus: transactionStatusThen
                            }
                        }];
            }
        });
    }); },
    transactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicAccount, queryParams, node, transactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicAccount = params.publicAccount;
                    queryParams = params.queryParams;
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).transactions(publicAccount, queryParams)];
                case 1:
                    transactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                transactions: transactions
                            }
                        }];
            }
        });
    }); },
    incomingTransactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicAccount, queryParams, node, incomingTransactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicAccount = params.publicAccount;
                    queryParams = params.queryParams;
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).incomingTransactions(publicAccount, queryParams)];
                case 1:
                    incomingTransactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                incomingTransactions: incomingTransactions
                            }
                        }];
            }
        });
    }); },
    outgoingTransactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicAccount, queryParams, node, outgoingTransactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicAccount = params.publicAccount;
                    queryParams = params.queryParams;
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).outgoingTransactions(publicAccount, queryParams)];
                case 1:
                    outgoingTransactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                outgoingTransactions: outgoingTransactions
                            }
                        }];
            }
        });
    }); },
    unconfirmedTransactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicAccount, queryParams, node, unconfirmedTransactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicAccount = params.publicAccount;
                    queryParams = params.queryParams;
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).unconfirmedTransactions(publicAccount, queryParams)];
                case 1:
                    unconfirmedTransactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                unconfirmedTransactions: unconfirmedTransactions
                            }
                        }];
            }
        });
    }); },
    getAggregateBondedTransactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var publicAccount, queryParams, node, aggregateBondedTransactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicAccount = params.publicAccount;
                    queryParams = params.queryParams;
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).aggregateBondedTransactions(publicAccount, queryParams)];
                case 1:
                    aggregateBondedTransactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                aggregateBondedTransactions: aggregateBondedTransactions
                            }
                        }];
            }
        });
    }); },
    announceAggregateBonded: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var signedTransaction, node, aggregateBondedTx;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signedTransaction = params.signedTransaction;
                    node = params.node;
                    return [4 /*yield*/, new TransactionHttp(node).announceAggregateBonded(signedTransaction)];
                case 1:
                    aggregateBondedTx = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                aggregateBondedTx: aggregateBondedTx
                            }
                        }];
            }
        });
    }); },
    announceBondedWithLock: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var aggregateTransaction, account, listener, node, generationHash, networkType, fee, transactionHttp, signedTransaction, hashLockTransaction, hashLockTransactionSigned;
        return tslib_1.__generator(this, function (_a) {
            aggregateTransaction = params.aggregateTransaction, account = params.account, listener = params.listener, node = params.node, generationHash = params.generationHash, networkType = params.networkType, fee = params.fee;
            transactionHttp = new TransactionHttp(node);
            signedTransaction = account.sign(aggregateTransaction, generationHash);
            hashLockTransaction = HashLockTransaction.create(Deadline.create(), 
            // todo repalce mosaic id
            new Mosaic(new MosaicId([853116887, 2007078553]), UInt64.fromUint(10000000)), UInt64.fromUint(480), signedTransaction, networkType, UInt64.fromUint(fee));
            hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash);
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
            console.log(hashLockTransactionSigned);
            console.log(signedTransaction);
            return [2 /*return*/, {
                    result: {
                        aggregateBondedTx: ''
                    }
                }];
        });
    }); },
};
//# sourceMappingURL=sdkTransaction.js.map