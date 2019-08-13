import * as tslib_1 from "tslib";
import { Component, Vue, Watch } from 'vue-property-decorator';
import dashboardBlockTime from '@/common/img/monitor/dash-board/dashboardBlockTime.png';
import dashboardPublickey from '@/common/img/monitor/dash-board/dashboardPublickey.png';
import dashboardBlockHeight from '@/common/img/monitor/dash-board/dashboardBlockHeight.png';
import dashboardPointAmount from '@/common/img/monitor/dash-board/dashboardPointAmount.png';
import dashboardTransactionAmount from '@/common/img/monitor/dash-board/dashboardTransactionAmount.png';
import { market } from "@/interface/restLogic";
import { PublicAccount, NetworkType } from 'nem2-sdk';
import { blockchainInterface } from '@/interface/sdkBlockchain';
import LineChart from '@/common/vue/line-chart/LineChart.vue';
import { transactionInterface } from '@/interface/sdkTransaction';
import numberGrow from '@/common/vue/number-grow/NumberGrow.vue';
import { isRefreshData, localSave, localRead, formatTransactions } from '@/help/help.ts';
var MonitorDashBoardTs = /** @class */ (function (_super) {
    tslib_1.__extends(MonitorDashBoardTs, _super);
    function MonitorDashBoardTs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.node = '';
        _this.currentXem = '';
        _this.accountAddress = '';
        _this.updateAnimation = '';
        _this.isShowDialog = false;
        _this.accountPublicKey = '';
        _this.currentDataAmount = 0;
        _this.currentPrice = 0;
        _this.accountPrivateKey = '';
        _this.confirmedDataAmount = 0;
        _this.unconfirmedDataAmount = 0;
        _this.currentTransactionList = [];
        _this.xemNum = 8999999999;
        _this.isLoadingConfirmedTx = true;
        _this.confirmedTransactionList = [];
        _this.isLoadingUnconfirmedTx = false;
        _this.unconfirmedTransactionList = [];
        _this.showConfirmedTransactions = true;
        _this.networkStatusList = [
            {
                icon: dashboardBlockHeight,
                descript: 'block_height',
                data: 1978365,
                variable: 'currentHeight'
            }, {
                icon: dashboardBlockTime,
                descript: 'average_block_time',
                data: 12,
                variable: 'currentGenerateTime'
            }, {
                icon: dashboardPointAmount,
                descript: 'point',
                data: 4,
                variable: 'nodeAmount'
            }, {
                icon: dashboardTransactionAmount,
                descript: 'number_of_transactions',
                data: 0,
                variable: 'numTransactions'
            }, {
                icon: dashboardPublickey,
                descript: 'Harvester',
                data: 0,
                variable: 'signerPublicKey'
            }
        ];
        _this.transactionDetails = [
            {
                key: 'transfer_type',
                value: 'gathering'
            },
            {
                key: 'from',
                value: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                key: 'aims',
                value: 'Test wallet'
            },
            {
                key: 'the_amount',
                value: '10.000000XEM'
            },
            {
                key: 'fee',
                value: '0.050000000XEM'
            },
            {
                key: 'block',
                value: '1951249'
            },
            {
                key: 'hash',
                value: '9BBCAECDD5E2D04317DE9873DC99255A9F8A33FA5BB570D1353F65CB31A44151'
            },
            {
                key: 'message',
                value: 'message test this'
            }
        ];
        return _this;
    }
    Object.defineProperty(MonitorDashBoardTs.prototype, "getWallet", {
        get: function () {
            return this.$store.state.account.wallet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonitorDashBoardTs.prototype, "ConfirmedTxList", {
        get: function () {
            return this.$store.state.account.ConfirmedTx;
        },
        enumerable: true,
        configurable: true
    });
    MonitorDashBoardTs.prototype.showDialog = function (transaction) {
        this.isShowDialog = true;
        this.transactionDetails = [
            {
                key: 'transfer_type',
                value: transaction.isReceipt ? 'gathering' : 'payment'
            },
            {
                key: 'from',
                value: transaction.signerAddress
            },
            {
                key: 'aims',
                value: transaction.recipientAddress
            },
            {
                key: 'mosaic',
                value: transaction.mosaic ? transaction.mosaic.id.toHex().toUpperCase() : null
            },
            {
                key: 'the_amount',
                value: transaction.mosaic ? transaction.mosaic.amount.compact() : 0
            },
            {
                key: 'fee',
                value: transaction.maxFee.compact()
            },
            {
                key: 'block',
                value: transaction.transactionInfo.height.compact()
            },
            {
                key: 'hash',
                value: transaction.transactionInfo.hash
            },
            {
                key: 'message',
                value: transaction.message.payload
            }
        ];
    };
    MonitorDashBoardTs.prototype.getMarketOpenPrice = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var openPriceOneMinute_1, that, rstStr, rstQuery, result, openPriceOneMinute;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isRefreshData('openPriceOneMinute', 1000 * 60, new Date().getSeconds())) {
                            openPriceOneMinute_1 = JSON.parse(localRead('openPriceOneMinute'));
                            this.currentPrice = openPriceOneMinute_1.openPrice * this.xemNum;
                            return [2 /*return*/];
                        }
                        that = this;
                        return [4 /*yield*/, market.kline({ period: "1min", symbol: "xemusdt", size: "1" })];
                    case 1:
                        rstStr = _a.sent();
                        rstQuery = JSON.parse(rstStr.rst);
                        result = rstQuery.data[0].close;
                        that.currentPrice = result * that.xemNum;
                        openPriceOneMinute = {
                            timestamp: new Date().getTime(),
                            openPrice: result
                        };
                        localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute));
                        return [2 /*return*/];
                }
            });
        });
    };
    MonitorDashBoardTs.prototype.switchTransactionPanel = function (flag) {
        this.showConfirmedTransactions = flag;
        this.currentDataAmount = flag ? this.confirmedDataAmount : this.unconfirmedDataAmount;
        this.changePage(1);
    };
    MonitorDashBoardTs.prototype.getPointInfo = function () {
        var that = this;
        var node = this.$store.state.account.node;
        var _a = this.$store.state.app.chainStatus, currentBlockInfo = _a.currentBlockInfo, preBlockInfo = _a.preBlockInfo;
        blockchainInterface.getBlockchainHeight({
            node: node
        }).then(function (result) {
            result.result.blockchainHeight.subscribe(function (res) {
                var height = Number.parseInt(res.toHex(), 16);
                that.$store.state.app.chainStatus.currentHeight = height;
                blockchainInterface.getBlockByHeight({
                    node: node,
                    height: height
                }).then(function (blockInfo) {
                    blockInfo.result.Block.subscribe(function (block) {
                        that.$store.state.app.chainStatus.numTransactions = block.numTransactions ? block.numTransactions : 0; //num
                        that.$store.state.app.chainStatus.signerPublicKey = block.signer.publicKey;
                        that.$store.state.app.chainStatus.currentHeight = block.height.compact(); //height
                        that.$store.state.app.chainStatus.currentBlockInfo = block;
                        that.$store.state.app.chainStatus.currentGenerateTime = 12;
                    });
                });
            });
        });
    };
    MonitorDashBoardTs.prototype.getConfirmedTransactions = function () {
        var that = this;
        var _a = this, accountPrivateKey = _a.accountPrivateKey, accountPublicKey = _a.accountPublicKey, currentXem = _a.currentXem, accountAddress = _a.accountAddress, node = _a.node;
        var publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST);
        transactionInterface.transactions({
            publicAccount: publicAccount,
            node: node,
            queryParams: {
                pageSize: 100
            }
        }).then(function (transactionsResult) {
            transactionsResult.result.transactions.subscribe(function (transactionsInfo) {
                var transferTransaction = formatTransactions(transactionsInfo, accountAddress);
                that.changeCurrentTransactionList(transferTransaction.slice(0, 10));
                that.confirmedDataAmount = transferTransaction.length;
                that.currentDataAmount = transferTransaction.length;
                that.confirmedTransactionList = transferTransaction;
                that.isLoadingConfirmedTx = false;
            });
        });
    };
    MonitorDashBoardTs.prototype.getUnconfirmedTransactions = function () {
        var that = this;
        var _a = this, accountPrivateKey = _a.accountPrivateKey, accountPublicKey = _a.accountPublicKey, currentXem = _a.currentXem, accountAddress = _a.accountAddress, node = _a.node;
        var publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST);
        transactionInterface.unconfirmedTransactions({
            publicAccount: publicAccount,
            node: node,
            queryParams: {
                pageSize: 100
            }
        }).then(function (transactionsResult) {
            transactionsResult.result.unconfirmedTransactions.subscribe(function (unconfirmedtransactionsInfo) {
                var transferTransaction = formatTransactions(unconfirmedtransactionsInfo, accountAddress);
                that.changeCurrentTransactionList(transferTransaction.slice(0, 10));
                that.currentDataAmount = transferTransaction.length;
                that.unconfirmedDataAmount = transferTransaction.length;
                that.unconfirmedTransactionList = transferTransaction;
                that.isLoadingUnconfirmedTx = false;
            });
        });
    };
    MonitorDashBoardTs.prototype.initData = function () {
        this.accountPrivateKey = this.getWallet.privateKey;
        this.accountPublicKey = this.getWallet.publicKey;
        this.accountAddress = this.getWallet.address;
        this.node = this.$store.state.account.node;
        this.currentXem = this.$store.state.account.currentXem;
    };
    MonitorDashBoardTs.prototype.changeCurrentTransactionList = function (list) {
        this.currentTransactionList = list;
    };
    MonitorDashBoardTs.prototype.changePage = function (page) {
        var pageSize = 10;
        var showConfirmedTransactions = this.showConfirmedTransactions;
        var start = (page - 1) * pageSize;
        var end = page * pageSize;
        if (showConfirmedTransactions) {
            //confirmed
            this.changeCurrentTransactionList(this.confirmedTransactionList.slice(start, end));
            return;
        }
        this.changeCurrentTransactionList(this.unconfirmedTransactionList.slice(start, end));
    };
    MonitorDashBoardTs.prototype.onGetWalletChange = function () {
        this.initData();
        this.getUnconfirmedTransactions();
        this.getConfirmedTransactions();
        this.getMarketOpenPrice();
        this.getPointInfo();
    };
    MonitorDashBoardTs.prototype.onConfirmedTxChange = function () {
        this.getUnconfirmedTransactions();
        this.getConfirmedTransactions();
    };
    Object.defineProperty(MonitorDashBoardTs.prototype, "currentHeight", {
        get: function () {
            return this.$store.state.app.chainStatus.currentHeight;
        },
        enumerable: true,
        configurable: true
    });
    MonitorDashBoardTs.prototype.onChainStatus = function () {
        var _this = this;
        this.updateAnimation = 'appear';
        setTimeout(function () {
            _this.updateAnimation = 'appear';
        }, 500);
    };
    MonitorDashBoardTs.prototype.created = function () {
        this.initData();
        this.getMarketOpenPrice();
        this.getConfirmedTransactions();
        this.getUnconfirmedTransactions();
        this.getPointInfo();
    };
    tslib_1.__decorate([
        Watch('getWallet')
    ], MonitorDashBoardTs.prototype, "onGetWalletChange", null);
    tslib_1.__decorate([
        Watch('ConfirmedTxList')
    ], MonitorDashBoardTs.prototype, "onConfirmedTxChange", null);
    tslib_1.__decorate([
        Watch('currentHeight')
    ], MonitorDashBoardTs.prototype, "onChainStatus", null);
    MonitorDashBoardTs = tslib_1.__decorate([
        Component({
            components: {
                LineChart: LineChart,
                numberGrow: numberGrow
            }
        })
    ], MonitorDashBoardTs);
    return MonitorDashBoardTs;
}(Vue));
export { MonitorDashBoardTs };
//# sourceMappingURL=MonitorDashBoardTs.js.map