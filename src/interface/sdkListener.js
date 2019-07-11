var _this = this;
import * as tslib_1 from "tslib";
import { TransactionHttp } from 'nem2-sdk';
// @ts-ignore
import { filter, mergeMap } from 'rxjs/operators';
export var wsInterface = {
    openWs: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var Observable;
        return tslib_1.__generator(this, function (_a) {
            Observable = params.listener.open();
            return [2 /*return*/, {
                    result: {
                        ws: Observable
                    }
                }];
        });
    }); },
    sendMultisigWs: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var listener, transactionHttp;
        return tslib_1.__generator(this, function (_a) {
            listener = params.listener;
            transactionHttp = new TransactionHttp(params.node);
            listener.open().then(function () {
                transactionHttp
                    .announce(params.signedLockTx);
                listener
                    .confirmed(params.account.address)
                    .pipe(filter(function (transaction) { return transaction.transactionInfo !== undefined
                    && transaction.transactionInfo.hash === params.signedLockTx.hash; }), mergeMap(function (ignored) { return transactionHttp.announceAggregateBonded(params.signedBondedTx); }))
                    .subscribe(function (announcedAggregateBonded) {
                }, function (err) { return console.error(err); });
            });
            return [2 /*return*/, {
                    result: {
                        ws: 'hellow'
                    }
                }];
        });
    }); },
};
//# sourceMappingURL=sdkListener.js.map