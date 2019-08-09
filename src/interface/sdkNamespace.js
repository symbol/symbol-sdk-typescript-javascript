var _this = this;
import * as tslib_1 from "tslib";
import { Deadline, NamespaceId, RegisterNamespaceTransaction, UInt64, MosaicAliasTransaction, AddressAliasTransaction, NamespaceHttp, } from 'nem2-sdk';
export var aliasInterface = {
    createNamespaceId: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var name, namespaceId;
        return tslib_1.__generator(this, function (_a) {
            name = params.name;
            namespaceId = new NamespaceId(name);
            return [2 /*return*/, {
                    result: {
                        namespacetransactionId: namespaceId
                    }
                }];
        });
    }); },
    createdRootNamespace: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deadline, namespaceName, duration, networkType, maxFee, rootNamespaceTransaction;
        return tslib_1.__generator(this, function (_a) {
            deadline = Deadline.create();
            namespaceName = params.namespaceName;
            duration = UInt64.fromUint(params.duration);
            networkType = params.networkType;
            maxFee = params.maxFee;
            rootNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(deadline, namespaceName, duration, networkType, maxFee ? UInt64.fromUint(maxFee) : undefined);
            return [2 /*return*/, {
                    result: {
                        rootNamespaceTransaction: rootNamespaceTransaction
                    }
                }];
        });
    }); },
    createdSubNamespace: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deadline, namespaceName, parentNamespace, networkType, maxFee, subNamespaceTransaction;
        return tslib_1.__generator(this, function (_a) {
            deadline = Deadline.create();
            namespaceName = params.namespaceName;
            parentNamespace = params.parentNamespace;
            networkType = params.networkType;
            maxFee = params.maxFee;
            subNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(deadline, namespaceName, parentNamespace, networkType, maxFee ? UInt64.fromUint(maxFee) : undefined);
            return [2 /*return*/, {
                    result: {
                        subNamespaceTransaction: subNamespaceTransaction
                    }
                }];
        });
    }); },
    mosaicAliasTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deadline, actionType, namespaceId, mosaicId, networkType, maxFee, aliasMosaicTransaction;
        return tslib_1.__generator(this, function (_a) {
            deadline = Deadline.create();
            actionType = params.actionType;
            namespaceId = params.namespaceId;
            mosaicId = params.mosaicId;
            networkType = params.networkType;
            maxFee = params.maxFee;
            aliasMosaicTransaction = MosaicAliasTransaction.create(deadline, actionType, namespaceId, mosaicId, networkType, maxFee ? UInt64.fromUint(maxFee) : undefined);
            return [2 /*return*/, {
                    result: {
                        aliasMosaicTransaction: aliasMosaicTransaction
                    }
                }];
        });
    }); },
    addressAliasTransaction: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deadline, actionType, namespaceId, address, networkType, maxFee, aliasAddressTransaction;
        return tslib_1.__generator(this, function (_a) {
            deadline = Deadline.create();
            actionType = params.actionType;
            namespaceId = params.namespaceId;
            address = params.address;
            networkType = params.networkType;
            maxFee = params.maxFee;
            aliasAddressTransaction = AddressAliasTransaction.create(deadline, actionType, namespaceId, address, networkType, maxFee ? UInt64.fromUint(maxFee) : undefined);
            return [2 /*return*/, {
                    result: {
                        aliasAddressTransaction: aliasAddressTransaction
                    }
                }];
        });
    }); },
    getLinkedMosaicId: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var namespaceId, url, namespaceHttp, mosaicId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    namespaceId = params.namespaceId;
                    url = params.url;
                    namespaceHttp = new NamespaceHttp(url);
                    return [4 /*yield*/, namespaceHttp.getLinkedMosaicId(namespaceId).toPromise()];
                case 1:
                    mosaicId = _a.sent();
                    return [2 /*return*/, {
                            result: {
                                mosaicId: mosaicId
                            }
                        }];
            }
        });
    }); },
    getNamespacesFromAccount: function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var address, url, namespaces, namespaceHttp, namespaceInfo, namespaceIds, namespaceName;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = params.address;
                    url = params.url;
                    namespaces = [];
                    namespaceHttp = new NamespaceHttp(url);
                    return [4 /*yield*/, namespaceHttp.getNamespacesFromAccount(address).toPromise()];
                case 1:
                    namespaceInfo = _a.sent();
                    namespaceIds = namespaceInfo.map(function (item, index, arr) {
                        namespaces[item.id.toHex().toUpperCase()] = { namespaceInfo: item }; // 传出去的对象
                        return item.id;
                    });
                    return [4 /*yield*/, namespaceHttp.getNamespacesName(namespaceIds).toPromise()];
                case 2:
                    namespaceName = _a.sent();
                    namespaces = namespaceName.map(function (item, index, arr) {
                        var namespace = namespaces[item.namespaceId.toHex().toUpperCase()];
                        namespace.namespaceName = item.name;
                        return namespace;
                    });
                    return [2 /*return*/, {
                            result: {
                                namespaceList: namespaces
                            }
                        }];
            }
        });
    }); }
};
//# sourceMappingURL=sdkNamespace.js.map