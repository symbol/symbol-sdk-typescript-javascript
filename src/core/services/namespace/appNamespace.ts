import { Alias, NamespaceId, NamespaceInfo} from "nem2-sdk"

class AppNamespace {
    alias: Alias
    aliasTarget: string
    duration: number
    hex: string
    id: NamespaceId
    isLinked: boolean
    name: string
    namespaceInfo: NamespaceInfo

    constructor(currentBlockHeight: number, appNamespace?: {
        alias: Alias
        aliasTarget: string
        duration: number
        hex: string
        id: NamespaceId
        isLinked: boolean
        name: string
        namespaceInfo: NamespaceInfo
    }) {
        Object.assign(this, appNamespace)
    }

    get(): AppNamespace {
        return this
    }
}

export const AppNamespaces = () => ({
    namespaceMap: {},
    store: null,

    init: (namespaceMap) => {
        this.namespaceMap = namespaceMap
    },

})


