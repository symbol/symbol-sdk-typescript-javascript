import {
    Deadline,
    NamespaceId,
    RegisterNamespaceTransaction,
    UInt64,
    MosaicAliasTransaction,
    AddressAliasTransaction,
    NamespaceHttp,
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";

export const aliasInterface: SdkV0.alias = {

    createNamespaceId: async (params) => {
        const name = params.name
        const namespaceId = new NamespaceId(name);
        return {
            result: {
                namespacetransactionId: namespaceId
            }
        }
    },

    createdRootNamespace: async (params) => {
        const deadline = Deadline.create();
        const namespaceName = params.namespaceName;
        const duration = UInt64.fromUint(params.duration);
        const networkType = params.networkType;
        const maxFee = params.maxFee;
        const rootNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            deadline,
            namespaceName,
            duration,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        return {
            result: {
                rootNamespaceTransaction: rootNamespaceTransaction
            }
        }
    },

    createdSubNamespace: async (params) => {
        const deadline = Deadline.create();
        const namespaceName = params.namespaceName;
        const parentNamespace = params.parentNamespace;
        const networkType = params.networkType;
        const maxFee = params.maxFee;
        const subNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
            deadline,
            namespaceName,
            parentNamespace,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        return {
            result: {
                subNamespaceTransaction: subNamespaceTransaction
            }
        }
    },

    mosaicAliasTransaction: async (params) => {
        const deadline = Deadline.create();
        const actionType = params.actionType;
        const namespaceId = params.namespaceId;
        const mosaicId = params.mosaicId;
        const networkType = params.networkType;
        const maxFee = params.maxFee;
        const aliasMosaicTransaction = MosaicAliasTransaction.create(
            deadline,
            actionType,
            namespaceId,
            mosaicId,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        return {
            result: {
                aliasMosaicTransaction: aliasMosaicTransaction
            }
        }
    },

    addressAliasTransaction: async (params) => {
        const deadline = Deadline.create();
        const actionType = params.actionType;
        const namespaceId = params.namespaceId;
        const address = params.address;
        const networkType = params.networkType;
        const maxFee = params.maxFee;
        const aliasAddressTransaction = AddressAliasTransaction.create(
            deadline,
            actionType,
            namespaceId,
            address,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
        return {
            result: {
                aliasAddressTransaction: aliasAddressTransaction
            }
        }
    },

    getLinkedMosaicId: async (params) => {
        const namespaceId = params.namespaceId;
        const url = params.url;

        const namespaceHttp = new NamespaceHttp(url)
        const mosaicId = await namespaceHttp.getLinkedMosaicId(namespaceId).toPromise()
        return {
            result: {
                mosaicId: mosaicId
            }
        }
    },

    getNamespacesFromAccount: async (params) => {
        const address = params.address;
        const url = params.url;
        let namespaces: any = []
        const namespaceHttp = new NamespaceHttp(url)
        let namespaceInfo = await namespaceHttp.getNamespacesFromAccount(address).toPromise()
        let namespaceIds = namespaceInfo.map((item, index, arr) => {
            namespaces[item.id.toHex().toUpperCase()] = {namespaceInfo: item};   // 传出去的对象
            return item.id
        })
        const namespaceName = await namespaceHttp.getNamespacesName(namespaceIds).toPromise()
        namespaces = namespaceName.map((item, index, arr) => {
            const namespace = namespaces[item.namespaceId.toHex().toUpperCase()];
            namespace.namespaceName = item.name;
            return namespace
        })
        return {
            result: {
                namespaceList: namespaces
            }
        }
    }
}
