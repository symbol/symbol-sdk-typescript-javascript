var _this = this;
import * as tslib_1 from "tslib";
import { AccountHttp, Address, EncryptedMessage } from 'nem2-sdk';
export var accountInterface = {
    getAccountsNames: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var addressList, node, namespaceList;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addressList = params.addressList;
                    node = params.node;
                    return [4 /*yield*/, (new AccountHttp(node)).getAccountsNames(addressList)];
                case 1:
                    namespaceList = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                namespaceList: namespaceList
                            }
                        }];
            }
        });
    }); },
    getAccountInfo: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var address, node, accountInfo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = Address.createFromRawAddress(params.address);
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).getAccountInfo(address)];
                case 1:
                    accountInfo = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                accountInfo: accountInfo
                            }
                        }];
            }
        });
    }); },
    sign: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var account, transaction, signature;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account;
                    transaction = params.transaction;
                    return [4 /*yield*/, account.sign(transaction, params.generationHash)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                signature: signature
                            }
                        }];
            }
        });
    }); },
    getMultisigAccountInfo: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var address, node, multisigAccountInfo, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = Address.createFromRawAddress(params.address);
                    node = params.node;
                    multisigAccountInfo = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new AccountHttp(node).getMultisigAccountInfo(address)];
                case 2:
                    multisigAccountInfo = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, {
                        result: {
                            multisigAccountInfo: multisigAccountInfo
                        }
                    }];
            }
        });
    }); },
    getMultisigAccountGraphInfo: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var address, node, multisigAccountGraphInfo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = Address.createFromRawAddress(params.address);
                    node = params.node;
                    return [4 /*yield*/, new AccountHttp(node).getMultisigAccountGraphInfo(address)];
                case 1:
                    multisigAccountGraphInfo = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                multisigAccountGraphInfo: multisigAccountGraphInfo
                            }
                        }];
            }
        });
    }); },
    encryptMessage: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var message, recipientPublicAccount, privateKey, encryptMessage;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = params.message;
                    recipientPublicAccount = params.recipientPublicAccount;
                    privateKey = params.privateKey;
                    return [4 /*yield*/, EncryptedMessage.create(message, recipientPublicAccount, privateKey)];
                case 1:
                    encryptMessage = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                encryptMessage: encryptMessage
                            }
                        }];
            }
        });
    }); },
    decryptMessage: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var encryptMessage, senderPublicAccount, privateKey, decryptMessage;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encryptMessage = params.encryptMessage;
                    senderPublicAccount = params.senderPublicAccount;
                    privateKey = params.privateKey;
                    return [4 /*yield*/, EncryptedMessage.decrypt(encryptMessage, privateKey, senderPublicAccount)];
                case 1:
                    decryptMessage = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                decryptMessage: decryptMessage
                            }
                        }];
            }
        });
    }); }
};
//# sourceMappingURL=sdkAccount.js.map