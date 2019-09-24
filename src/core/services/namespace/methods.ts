import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs"
import {Address} from "nem2-sdk"

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
