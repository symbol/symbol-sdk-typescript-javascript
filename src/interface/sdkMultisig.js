var _this = this;
import * as tslib_1 from "tslib";
import { Deadline, UInt64, PublicAccount, AggregateTransaction, ModifyMultisigAccountTransaction, TransactionHttp, AccountHttp, Address } from 'nem2-sdk';
export var multisigInterface = {
    /*
    multisign coversion
    * */
    // covertToBeMultisig: async (params) => {
    //     const {minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, fee} = params
    //
    //     const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    //         Deadline.create(),
    //         minApprovalDelta,
    //         minRemovalDelta,
    //         multisigCosignatoryModificationList,
    //         networkType,
    //         UInt64.fromUint(fee)
    //     );
    //     const aggregateTransaction = AggregateTransaction.createBonded(
    //         Deadline.create(),
    //         [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
    //         networkType,
    //         [],
    //         UInt64.fromUint(fee)
    //     );
    //
    //     return {
    //         result: {
    //             aggregateTransaction: aggregateTransaction
    //         }
    //     };
    // },
    // multisetCosignatoryModification: async (params) => {
    //     const {multisigPublickey, minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, fee} = params
    //     const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublickey, NetworkType.MIJIN_TEST)
    //     const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    //         Deadline.create(),
    //         Number(minApprovalDelta),
    //         Number(minRemovalDelta),
    //         multisigCosignatoryModificationList,
    //         networkType,
    //     );
    //     const aggregateTransaction = AggregateTransaction.createBonded(
    //         Deadline.create(),
    //         [modifyMultisigAccountTransaction.toAggregate(multisigPublicAccount)],
    //         networkType,
    //         [],
    //         UInt64.fromUint(fee)
    //     );
    //
    //     return {
    //         result: {
    //             aggregateTransaction: aggregateTransaction
    //         }
    //     }
    //
    // },
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
    bondedMultisigTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var transaction, multisigPublickey, networkType, account, fee, aggregateTransaction;
        return tslib_1.__generator(this, function (_a) {
            transaction = params.transaction, multisigPublickey = params.multisigPublickey, networkType = params.networkType, account = params.account, fee = params.fee;
            aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))], networkType, [], UInt64.fromUint(fee));
            return [2 /*return*/, {
                    result: {
                        aggregateTransaction: aggregateTransaction
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