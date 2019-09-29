import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs"
import {NamespaceHttp, Address} from 'nem2-sdk'
import {AppNamespace} from '@/core/model'
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType"

export const getNamespacesFromAddress = async (address: string,
                                               node: string): Promise<AppNamespace[]> => {
    try {
        const namespaceHttp = new NamespaceHttp(node)
        const accountAddress = Address.createFromRawAddress(address)
        const namespaceInfo = await namespaceHttp.getNamespacesFromAccount(accountAddress).toPromise()
        const namespaceIds = namespaceInfo.map(nsInfo => nsInfo.id)
        const namespaceNames = await namespaceHttp.getNamespacesName(namespaceIds).toPromise()
        return namespaceInfo.map(nsInfo => AppNamespace.fromNamespaceInfo(nsInfo, namespaceNames))
    } catch (error) {
        throw new Error(error)
    }
}

export const createRootNamespace = (namespaceName, duration, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdRootNamespace(namespaceName, duration, networkType, maxFee)
}

export const createSubNamespace = (rootNamespaceName, subNamespaceName, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdSubNamespace(subNamespaceName, rootNamespaceName, networkType, maxFee)
}

export const sortByduration = (list) => {
    return list.sort((a, b) => {
        return b.endHeight - a.endHeight
    })
}
export const sortByName = (list) => {
    let namespaceMap = {}
    let nameList = []
    list.forEach(item => {
        namespaceMap[item.label] = item
    })
    nameList = list.map(item => item.label).sort()
    return nameList.map((item) => {
        return namespaceMap[item]
    })
}

export const sortByOwnerShip = (list) => {
    return list.sort((a, b) => {
        return b.isLinked
    })
}

export const sortByBindType = (list) => {
    return list.sort((a, b) => {
        return b.alias.type - a.alias.type
    })
}

export const sortByBindInfo = (list) => {
    return list.sort((a, b) => {
        return b.alias.type - a.alias.type
    })
}
