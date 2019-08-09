var _this = this;
import * as tslib_1 from "tslib";
import { Deadline, UInt64, PublicAccount, AggregateTransaction, AccountHttp, Address } from 'nem2-sdk';
export var multisigInterface = {
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
            transaction = transaction.map(function (item) {
                item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType));
                return item;
            });
            aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), transaction, networkType, [], UInt64.fromUint(fee));
            return [2 /*return*/, {
                    result: {
                        aggregateTransaction: aggregateTransaction
                    }
                }];
        });
    }); },
    completeMultisigTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var transaction, multisigPublickey, networkType, fee, aggregateTransaction;
        return tslib_1.__generator(this, function (_a) {
            transaction = params.transaction, multisigPublickey = params.multisigPublickey, networkType = params.networkType, fee = params.fee;
            transaction = transaction.map(function (item) {
                item = item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType));
                return item;
            });
            aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(), transaction, networkType, [], UInt64.fromUint(fee));
            return [2 /*return*/, {
                    result: {
                        aggregateTransaction: aggregateTransaction
                    }
                }];
        });
    }); },
};
//# sourceMappingURL=sdkMultisig.js.map