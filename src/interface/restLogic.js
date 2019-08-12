var _this = this;
import * as tslib_1 from "tslib";
import { WebClient } from "@/help/webHelp";
import { AppConfig } from "config/config";
export var market = {
    kline: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var symbol, period, size, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    symbol = params.symbol;
                    period = params.period;
                    size = params.size;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.marketUrl + "/rest/market/kline/" + symbol + "/" + period + "/" + size + "/",
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
    detail: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var symbol, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    symbol = params.symbol;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.marketUrl + "/rest/market/detail/" + symbol,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
    trade: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var symbol, size, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    symbol = params.symbol;
                    size = params.size;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.marketUrl + "/rest/market/trade/" + symbol + "/" + size,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
};
export var blog = {
    commentList: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var cid, limit, offset, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cid = params.cid;
                    limit = params.limit;
                    offset = params.offset;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.apiUrl + "/rest/blog/comment/list?cid=" + cid + "&limit=" + limit + "&offset=" + offset,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
    commentSave: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var cid, address, comment, gtmCreate, nickName, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cid = params.cid;
                    address = params.address;
                    comment = params.comment;
                    gtmCreate = params.gtmCreate;
                    nickName = params.nickName;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.apiUrl + "/rest/blog/comment/save?cid=" + cid + "&comment=" + comment + "&address=" + address + "&nickName=" + nickName + "&gtmCreate=" + gtmCreate,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
    list: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var offset, limit, language, resStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = params.offset;
                    limit = params.limit;
                    language = params.language;
                    return [4 /*yield*/, WebClient.request('', {
                            url: AppConfig.apiUrl + "/rest/blog/list?limit=" + limit + "&offset=" + offset + "&language=" + language,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    resStr = _a.sent();
                    return [2 /*return*/, {
                            rst: resStr
                        }];
            }
        });
    }); },
};
//# sourceMappingURL=restLogic.js.map