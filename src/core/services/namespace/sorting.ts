import { AppNamespace } from '@/core/model'

export const namespaceSortTypes = {
 byName: 1,
 byDuration: 2,
 byOwnerShip: 3,
 byBindType: 4,
 byBindInfo: 5,
 byExpired:6
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
 [namespaceSortTypes.byExpired] : sortByDuration,
}

export const sortNamespaceList = (  namespaceSortType: number,
                                 list: AppNamespace[],
                                 direction: boolean): AppNamespace[] => {
 return sortingRouter[namespaceSortType](list, direction)
}
