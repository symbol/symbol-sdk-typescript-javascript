import {
    Deadline,
    NamespaceId,
    RegisterNamespaceTransaction,
    UInt64,
    MosaicAliasTransaction,
    AddressAliasTransaction,
    NamespaceHttp, NetworkType, AliasActionType, MosaicId, Address, Namespace,
} from 'nem2-sdk'
import {NamespaceRepository} from "@/core/api/repository/NamespaceRepository.ts";
import {from as observableFrom, Observable} from "rxjs";

export class NamespaceApiRxjs implements NamespaceRepository {

    createNamespaceId(name: string | number[]) {
        return new NamespaceId(name);

    }

    createdRootNamespace(namespaceName: string, duration: number, networkType: NetworkType, maxFee?: number) {
        const deadline = Deadline.create();
        const durationUint = UInt64.fromUint(duration);
        return RegisterNamespaceTransaction.createRootNamespace(
            deadline,
            namespaceName,
            durationUint,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
    }

    createdSubNamespace(namespaceName: string,
                        parentNamespace: string | NamespaceId,
                        networkType: NetworkType,
                        maxFee?: number) {
        const deadline = Deadline.create();

        return RegisterNamespaceTransaction.createSubNamespace(
            deadline,
            namespaceName,
            parentNamespace,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )

    }

    mosaicAliasTransaction(actionType: AliasActionType,
                           namespaceId: NamespaceId,
                           mosaicId: MosaicId,
                           networkType: NetworkType,
                           maxFee?: number) {
        const deadline = Deadline.create();
        return MosaicAliasTransaction.create(
            deadline,
            actionType,
            namespaceId,
            mosaicId,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
    }

    addressAliasTransaction(actionType: AliasActionType,
                            namespaceId: NamespaceId,
                            address: Address,
                            networkType: NetworkType,
                            maxFee?: number) {
        const deadline = Deadline.create();
        return AddressAliasTransaction.create(
            deadline,
            actionType,
            namespaceId,
            address,
            networkType,
            maxFee ? UInt64.fromUint(maxFee) : undefined
        )
    }

    getLinkedMosaicId(
        namespaceId: NamespaceId,
        url: string) {
        const namespaceHttp = new NamespaceHttp(url)
        return namespaceHttp.getLinkedMosaicId(namespaceId)

    }

    async getNamespacesFromAccount(address: Address, url: string) {
        let namespaces: any = []
        const namespaceHttp = new NamespaceHttp(url)
        let namespaceInfo = await namespaceHttp.getNamespacesFromAccount(address).toPromise()
        let namespaceIds = namespaceInfo.map((item, index, arr) => {
            namespaces[item.id.toHex().toUpperCase()] = {namespaceInfo: item};
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
