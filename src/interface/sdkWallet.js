var _this = this;
import * as tslib_1 from "tslib";
import { Password, SimpleWallet, Account, PublicAccount, AccountHttp } from 'nem2-sdk';
import generator from 'generate-password';
export var walletInterface = {
    loginWallet: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var name, privateKey, networkType, password, wallet, account, publicAccount, mosaics, accountHttp, accountInfo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = params.name;
                    privateKey = params.privateKey;
                    networkType = params.networkType;
                    password = new Password(generator.generate({ length: 50, numbers: true, symbols: true, }));
                    return [4 /*yield*/, SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType)];
                case 1:
                    wallet = _a.sent();
                    account = Account.createFromPrivateKey(privateKey, networkType);
                    publicAccount = PublicAccount.createFromPublicKey(account.publicKey, networkType);
                    mosaics = [];
                    if (!params.node) return [3 /*break*/, 3];
                    accountHttp = new AccountHttp(params.node);
                    return [4 /*yield*/, accountHttp.getAccountInfo(account.address).toPromise()];
                case 2:
                    accountInfo = _a.sent();
                    mosaics = accountInfo.mosaics;
                    _a.label = 3;
                case 3: return [2 /*return*/, {
                        result: {
                            wallet: wallet,
                            password: password,
                            publicAccount: publicAccount,
                            account: account,
                            mosaics: mosaics
                        }
                    }];
            }
        });
    }); },
    createWallet: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var name, networkType, privateKey, password, wallet;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = params.name;
                    networkType = params.networkType;
                    privateKey = Account.generateNewAccount(networkType).privateKey;
                    password = new Password(generator.generate({ length: 50, numbers: true, symbols: true, }));
                    return [4 /*yield*/, SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType)];
                case 1:
                    wallet = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                wallet: wallet,
                                privateKey: privateKey,
                                password: password
                            }
                        }];
            }
        });
    }); },
    getWallet: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var name, privateKey, networkType, password, wallet;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = params.name;
                    privateKey = params.privateKey;
                    networkType = params.networkType;
                    password = new Password(generator.generate({ length: 50, numbers: true, symbols: true, }));
                    return [4 /*yield*/, SimpleWallet.createFromPrivateKey(name, password, privateKey, networkType)];
                case 1:
                    wallet = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                wallet: wallet,
                                privateKey: privateKey,
                                password: password
                            }
                        }];
            }
        });
    }); },
    getKeys: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var password, wallet, account;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = params.password;
                    wallet = params.wallet;
                    return [4 /*yield*/, wallet.open(password)];
                case 1:
                    account = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                account: account
                            }
                        }];
            }
        });
    }); },
};
//# sourceMappingURL=sdkWallet.js.map