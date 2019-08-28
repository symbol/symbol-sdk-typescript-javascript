import {
    Address, AddressAliasTransaction,
    AliasActionType, MosaicAliasTransaction,
    MosaicId,
    NamespaceId,
    NetworkType, RegisterNamespaceTransaction,
} from "nem2-sdk";
import {Observable, Subscribable, Subscription} from "rxjs";

export interface NamespaceRepository {
    createNamespaceId(name: string | number[]): NamespaceId;

    createdRootNamespace(namespaceName: string, duration: number, networkType: NetworkType, maxFee?: number): RegisterNamespaceTransaction;

    createdSubNamespace(
        namespaceName: string,
        parentNamespace: string | NamespaceId,
        networkType: NetworkType,
        maxFee?: number
    ): RegisterNamespaceTransaction;


    mosaicAliasTransaction(
        actionType: AliasActionType,
        namespaceId: NamespaceId,
        mosaicId: MosaicId,
        networkType: NetworkType,
        maxFee?: number
    ): MosaicAliasTransaction;


    addressAliasTransaction(
        actionType: AliasActionType,
        namespaceId: NamespaceId,
        address: Address,
        networkType: NetworkType,
        maxFee?: number
    ): AddressAliasTransaction;


    getLinkedMosaicId(
        namespaceId: NamespaceId,
        url: string
    ): Observable<any>;

    // getNamespacesFromAccount(
    //     address: Address,
    //     url: string
    // ): Observable<any>;

    // getNamespacesName(
    //     url: string,
    //     namespaceIds: Array<NamespaceId>
    // ): Observable<any>;
}
