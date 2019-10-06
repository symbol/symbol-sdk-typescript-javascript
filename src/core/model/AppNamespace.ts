import { NamespaceId, NamespaceInfo, Alias, NamespaceName } from 'nem2-sdk'
import { EmptyAlias } from 'nem2-sdk/dist/src/model/namespace/EmptyAlias'

// @TODO: review model
export class AppNamespace {
  aliasTarget: string
  aliasType: string

  constructor(   public id: NamespaceId,
                 public hex: string,
                 public value: string,
                 public label: string,
                 public namespaceInfo: NamespaceInfo,
                 public isActive: boolean,
                 public alias: Alias,
                 public levels: number,
                 public endHeight: number,
                 public name: string) {}

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

  isLinked(): boolean {
    return !(this.alias instanceof EmptyAlias)
  }
}
