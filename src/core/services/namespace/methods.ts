import {NamespaceHttp, Address, QueryParams} from 'nem2-sdk'
import {AppNamespace, AppState} from '@/core/model'
import {Store} from 'vuex'

export const namespaceSortTypes = {
    byName: 1,
    byDuration: 2,
    byOwnerShip: 3,
    byBindType: 4,
    byBindInfo: 5
}

export const setNamespaces = async (address: string, store: Store<AppState>): Promise<void> => {
    try {
        const {node} = store.state.account
        const namespaces = await getNamespacesFromAddress(address, node)
        store.commit('SET_NAMESPACES', namespaces)
    } catch (error) {
        store.commit('SET_NAMESPACES', [])
        throw new Error(error)
    } finally {
        store.commit('SET_NAMESPACE_LOADING', false)
    }
}

export const getNamespacesFromAddress = async (address: string,
                                               node: string): Promise<AppNamespace[]> => {
    try {
        const namespaceHttp = new NamespaceHttp(node)
        const accountAddress = Address.createFromRawAddress(address)
        const namespaceInfo = await namespaceHttp
            .getNamespacesFromAccount(accountAddress, new QueryParams(100))
            .toPromise()

        const namespaceIds = namespaceInfo.map(nsInfo => nsInfo.id)
        const namespaceNames = await namespaceHttp.getNamespacesName(namespaceIds).toPromise()
        return namespaceInfo.map(nsInfo => AppNamespace.fromNamespaceInfo(nsInfo, namespaceNames))
    } catch (error) {
        throw new Error(error)
    }
}

export const getNamespaceNameFromNamespaceId = (hexId: string, store: Store<AppState>) => {
    const {namespaces} = store.state.account
    const namespace = namespaces.find(({ hex }) => hex === hexId)
    if (namespace === undefined) return hexId
    return namespace.name
}

const sortByDuration = (list: AppNamespace[], direction: boolean): AppNamespace[] => {
    return list.sort((a, b) => {
        return direction
            ? b.endHeight - a.endHeight
            : a.endHeight - b.endHeight
    })
}

const sortByName = (list: AppNamespace[], direction: boolean): AppNamespace[] => {
    return list.sort((a, b) => {
        return direction
            ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            : b.name.toLowerCase().localeCompare(a.name.toLowerCase())
    })
}

// @TODO: ?
const sortByOwnerShip = (list: AppNamespace[], direction: boolean): AppNamespace[] => {
    return list.sort((a, b) => {
        return direction
            ? (a.isLinked === b.isLinked) ? 0 : a.isLinked ? -1 : 1
            : (a.isLinked === b.isLinked) ? 0 : a.isLinked ? 1 : -1
    })
}

const sortByBindType = (list: AppNamespace[], direction: boolean): AppNamespace[] => {
    return list.sort((a, b) => {
        return direction
            ? b.alias.type - a.alias.type
            : a.alias.type - b.alias.type
    })
}

const sortByBindInfo = (list: AppNamespace[], direction: boolean): AppNamespace[] => {
    return list.sort((a, b) => {
        return direction
            ? b.alias.type - a.alias.type
            : a.alias.type - b.alias.type
    })
}

const sortingRouter = {
    [namespaceSortTypes.byName] : sortByName,
    [namespaceSortTypes.byDuration] : sortByDuration,
    [namespaceSortTypes.byOwnerShip] : sortByBindInfo,
    [namespaceSortTypes.byBindType] : sortByBindType,
    [namespaceSortTypes.byBindInfo] : sortByOwnerShip,
}

export const sortNamespaceList = (  namespaceSortType: number,
                                    list: AppNamespace[], 
                                    direction: boolean): AppNamespace[] => {
    return sortingRouter[namespaceSortType](list, direction)
}
