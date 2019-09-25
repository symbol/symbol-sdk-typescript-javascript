import { NamespaceId, NamespaceInfo, Alias, NamespaceName } from 'nem2-sdk'

export class AppNamespace {
  id: NamespaceId
  hex: string
  value: string
  label: string
  namespaceInfo: NamespaceInfo
  isActive: boolean
  alias: Alias
  levels: number
  endHeight: number
  name: string
  // aliasTarget: string
  // duration: number
  // isLinked: boolean
  constructor(   id: NamespaceId,
                 hex: string,
                 value: string,
                 label: string,
                 namespaceInfo: NamespaceInfo,
                 isActive: boolean,
                 alias: Alias,
                 levels: number,
                 endHeight: number,
                 name: string) {
    this.id = id
    this.hex = hex
    this.value = value
    this.label = label
    this.namespaceInfo = namespaceInfo
    this.isActive = isActive
    this.alias = alias
    this.levels = levels
    this.endHeight = endHeight
    this.name = name
  }

  static fromNamespaceInfo( namespaceInfo: NamespaceInfo,
                            namespaceNames: NamespaceName[]): AppNamespace {
   
   const name = AppNamespace.extractFullNamespace(namespaceInfo, namespaceNames)
   return new AppNamespace(
     namespaceInfo.id,
     namespaceInfo.id.toHex(),
     name,
     name,
     namespaceInfo,
     namespaceInfo.active,
     namespaceInfo.alias,
     namespaceInfo.levels.length,
     namespaceInfo.endHeight.compact(),
     name,
   )
  }

  static extractFullNamespace(  namespace: NamespaceInfo,
                                namespaceNames: NamespaceName[]): string {
    return namespace.levels.map((level) => {
      const namespaceName = namespaceNames.find((name) => name.namespaceId.equals(level));
      if (namespace === undefined) {
        throw new Error('Not found');
      }
      return namespaceName;
    })
      .map((namespaceName: NamespaceName) => namespaceName.name)
      .join('.');  
   }
}
