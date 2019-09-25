import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs"
import {Address} from "nem2-sdk"
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType"

export const getNamespaces = async (address: string, node: string) => {
    let list = []
    let namespace = {}
    await new NamespaceApiRxjs().getNamespacesFromAccount(
        Address.createFromRawAddress(address),
        node
    ).then((namespacesFromAccount) => {
        namespacesFromAccount.result.namespaceList
            .sort((a, b) => {
                return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
            }).map((item, index) => {
            if (!item) {
                return
            }
            if (!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())) {
                namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
            } else {
                return
            }
            let namespaceName = ''
            item.namespaceInfo.levels.map((item, index) => {
                namespaceName += namespace[item.id.toHex()] + '.'
            })
            namespaceName = namespaceName.slice(0, namespaceName.length - 1)
            const newObj = {
                id: item.namespaceInfo.id,
                hex: item.namespaceInfo.id.toHex(),
                value: namespaceName,
                label: namespaceName,
                namespaceInfo: item.namespaceInfo,
                isActive: item.namespaceInfo.active,
                alias: item.namespaceInfo.alias,
                levels: item.namespaceInfo.levels.length,
                endHeight: item.namespaceInfo.endHeight.compact(),
            }
            list.push(newObj)

        })
    })
    return list
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
    let namespaceMap = {}
    let nameList = []
    list.forEach(item => {
        namespaceMap[item.aliasType] = item
    })
    nameList = list.map(item => item.aliasType).sort((a, b) => {
        return MosaicNamespaceStatusType.NOALIAS !== a.aliasType
    })
    return nameList.map((item) => {
        return namespaceMap[item]
    })
}

export const sortByBindInfo = (list) => {
    let namespaceMap = {}
    let nameList = []
    list.forEach(item => {
        namespaceMap[item.aliasTarget] = item
    })
    nameList = list.map(item => item.aliasTarget).sort((a, b) => {
        return MosaicNamespaceStatusType.NOALIAS !== a.aliasTarget
    })
    return nameList.map((item) => {
        return namespaceMap[item]
    })
}
