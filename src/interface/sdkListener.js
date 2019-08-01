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
    newBlock: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var listener, pointer;
        return tslib_1.__generator(this, function (_a) {
            listener = params.listener;
            pointer = params.pointer;
            listener.open().then(function () {
                listener
                    .newBlock()
                    .subscribe(function (block) {
                    // console.log(block)
                    var _a = pointer.$store.state.app.chainStatus, currentBlockInfo = _a.currentBlockInfo, preBlockInfo = _a.preBlockInfo;
                    // console.log(pointer.$store.state.app.chainStatus)
                    // console.log(block.timestamp.compact())
                    pointer.$store.state.app.chainStatus.preBlockInfo = currentBlockInfo; //pre
                    pointer.$store.state.app.chainStatus.numTransactions = block.numTransactions ? block.numTransactions : 0; //num
                    pointer.$store.state.app.chainStatus.signerPublicKey = block.signer.publicKey;
                    pointer.$store.state.app.chainStatus.currentHeight = block.height.compact(); //height
                    pointer.$store.state.app.chainStatus.currentBlockInfo = block;
                    if (preBlockInfo.timestamp) {
                        var currentGenerateTime = (block.timestamp.compact() - preBlockInfo.timestamp.compact()) / 1000; //time
                        pointer.$store.state.app.chainStatus.currentGenerateTime = currentGenerateTime.toFixed(0);
                        return;
                    }
                    pointer.$store.state.app.chainStatus.currentGenerateTime = 12;
                }, function (err) {
                    console.log(err);
                });
            });
            return [2 /*return*/, {
                    result: {
                        blockInfo: ''
                    }
                }];
        });
    }); }
};
//# sourceMappingURL=sdkListener.js.map