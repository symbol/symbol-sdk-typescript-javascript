var _this = this;
import * as tslib_1 from "tslib";
import { localRead, localSave } from "@/help/help";
import { walletInterface } from "@/interface/sdkWallet";
import { accountInterface } from "@/interface/sdkAccount";
import { Crypto } from 'nem2-sdk';
export var saveLocalWallet = function (wallet, encryptObj, index, mnemonicEnCodeObj) {
    var localData = [];
    var isExist = false;
    try {
        localData = JSON.parse(localRead('wallets'));
    }
    catch (e) {
        localData = [];
    }
    var saveData = {
        name: wallet.name,
        ciphertext: encryptObj ? encryptObj.ciphertext : localData[index].ciphertext,
        iv: encryptObj ? encryptObj.iv : localData[index].iv,
        networkType: wallet.networkType,
        address: wallet.address,
        publicKey: wallet.publicKey,
        mnemonicEnCodeObj: mnemonicEnCodeObj || wallet.mnemonicEnCodeObj
    };
    var account = wallet;
    account = Object.assign(account, saveData);
    for (var i in localData) {
        if (localData[i].address === account.address) {
            localData[i] = saveData;
            isExist = true;
        }
    }
    if (!isExist)
        localData.unshift(saveData);
    localSave('wallets', JSON.stringify(localData));
    return account;
};
export var getAccountDefault = function (name, account, netType, node, currentXEM1, currentXEM2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var storeWallet;
    var _this = this;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storeWallet = {};
                return [4 /*yield*/, walletInterface.getWallet({
                        name: name,
                        networkType: netType,
                        privateKey: account.privateKey
                    }).then(function (Wallet) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    storeWallet = {
                                        name: Wallet.result.wallet.name,
                                        address: Wallet.result.wallet.address['address'],
                                        networkType: Wallet.result.wallet.address['networkType'],
                                        privateKey: Wallet.result.privateKey,
                                        publicKey: account.publicKey,
                                        publicAccount: account.publicAccount,
                                        mosaics: [],
                                        wallet: Wallet.result.wallet,
                                        password: Wallet.result.password,
                                        balance: 0
                                    };
                                    return [4 /*yield*/, setWalletMosaic(storeWallet, node, currentXEM1, currentXEM2).then(function (data) {
                                            storeWallet = data;
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, setMultisigAccount(storeWallet, node).then(function (data) {
                                            storeWallet = data;
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/, storeWallet];
        }
    });
}); };
export var setWalletMosaic = function (storeWallet, node, currentXEM1, currentXEM2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var wallet;
    var _this = this;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wallet = storeWallet;
                return [4 /*yield*/, accountInterface.getAccountInfo({
                        node: node,
                        address: wallet.address
                    }).then(function (accountInfoResult) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, accountInfoResult.result.accountInfo.subscribe(function (accountInfo) {
                                        var mosaicList = accountInfo.mosaics;
                                        mosaicList.map(function (item) {
                                            item.hex = item.id.toHex();
                                            if (item.id.toHex() == currentXEM2 || item.id.toHex() == currentXEM1) {
                                                wallet.balance = item.amount.compact() / 1000000;
                                            }
                                        });
                                        wallet.mosaics = mosaicList;
                                    }, function () {
                                        wallet.balance = 0;
                                        wallet.mosaics = [];
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
export var setMultisigAccount = function (storeWallet, node) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var wallet;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wallet = storeWallet;
                return [4 /*yield*/, accountInterface.getMultisigAccountInfo({
                        node: node,
                        address: wallet.address
                    }).then(function (multisigAccountInfo) {
                        if (typeof (multisigAccountInfo.result.multisigAccountInfo) == 'object') {
                            multisigAccountInfo.result.multisigAccountInfo['subscribe'](function (accountInfo) {
                                wallet.isMultisig = true;
                            }, function () {
                                wallet.isMultisig = false;
                            });
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
export var encryptKey = function (data, password) {
    return Crypto.encrypt(data, password);
};
export var decryptKey = function (wallet, password) {
    var encryptObj = {
        ciphertext: wallet.ciphertext,
        iv: wallet.iv.data ? wallet.iv.data : wallet.iv,
        key: password
    };
    return Crypto.decrypt(encryptObj);
};
//# sourceMappingURL=appUtil.js.map