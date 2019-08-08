var _this = this;
import * as tslib_1 from "tslib";
// @ts-ignore
import { BlockHttp, ChainHttp } from 'nem2-sdk';
export var blockchainInterface = {
    getBlockByHeight: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var node, height, blockchain;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = params.node;
                    height = params.height;
                    return [4 /*yield*/, new BlockHttp(node).getBlockByHeight(height)];
                case 1:
                    blockchain = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                Block: blockchain
                            }
                        }];
            }
        });
    }); },
    getBlocksByHeightWithLimit: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var node, firstHeight, limit, blocks;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = params.node;
                    firstHeight = params.height;
                    limit = params.limit;
                    return [4 /*yield*/, new BlockHttp(node).getBlocksByHeightWithLimit(firstHeight, limit)];
                case 1:
                    blocks = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                Blocks: blocks
                            }
                        }];
            }
        });
    }); },
    getBlockTransactions: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var node, height, queryParams, blockTransactions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = params.node;
                    height = params.height;
                    queryParams = params.queryParams;
                    return [4 /*yield*/, new BlockHttp(node).getBlockTransactions(height, queryParams)];
                case 1:
                    blockTransactions = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                blockTransactions: blockTransactions
                            }
                        }];
            }
        });
    }); },
    getBlockchainHeight: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var node, blockchainHeight;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = params.node;
                    return [4 /*yield*/, new ChainHttp(node).getBlockchainHeight()];
                case 1:
                    blockchainHeight = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                blockchainHeight: blockchainHeight
                            }
                        }];
            }
        });
    }); }
};
//# sourceMappingURL=sdkBlockchain.js.map