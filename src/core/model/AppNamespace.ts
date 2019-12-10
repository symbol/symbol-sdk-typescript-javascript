import {NamespaceId, NamespaceInfo, NamespaceName, EmptyAlias} from 'nem2-sdk'
import {networkConfig} from '@/config'
import {durationToRelativeTime} from '@/core/utils'
import {NamespaceExpirationInfo} from './types'
const {namespaceGracePeriodDuration} = networkConfig

export class AppNamespace {
  constructor(public id: NamespaceId,
    public hex: string,
    public namespaceInfo: NamespaceInfo,
    public isActive: boolean,
    public alias,
    public levels: number,
    public endHeight: number,
    public name: string) {}

  static fromNamespaceInfo(namespaceInfo: NamespaceInfo,
    namespaceNames: NamespaceName[]): AppNamespace {
    const name = AppNamespace.extractFullNamespace(namespaceInfo, namespaceNames)
    return new AppNamespace(
      namespaceInfo.id,
      namespaceInfo.id.toHex(),
      namespaceInfo,
      namespaceInfo.active,
      namespaceInfo.alias,
      namespaceInfo.levels.length,
      namespaceInfo.endHeight.compact(),
      name,
    )
  }

  static getFullNameFromNamespaceName(
    reference: NamespaceName,
    namespaceNames: NamespaceName[],
  ): NamespaceName {
    if (!reference.parentId) return reference

    const parent = namespaceNames
      .find(namespaceName => namespaceName.namespaceId.toHex() === reference.parentId.toHex())

    if (parent === undefined) return reference

    return AppNamespace.getFullNameFromNamespaceName(
      new NamespaceName(parent.namespaceId, `${parent.name}.${reference.name}`, parent.parentId),
      namespaceNames,
    )
  }

  static fromNamespaceName(namespaceName: NamespaceName, namespaceNames: NamespaceName[]): AppNamespace {
    const {name} = AppNamespace.getFullNameFromNamespaceName(namespaceName, namespaceNames)

    return new AppNamespace(
      namespaceName.namespaceId,
      namespaceName.namespaceId.toHex(),
      null,
      true,
      null,
      0,
      0,
      name,
    )
  }

  static fromNamespaceNames(namespaceNames: NamespaceName[]): AppNamespace[] {
    return namespaceNames.map(namespaceName => AppNamespace.fromNamespaceName(namespaceName, namespaceNames))
  }

  static fromNamespaceUpdate(oldNamespace: AppNamespace, newNamespace: AppNamespace): AppNamespace {
    const newObject: any = {...oldNamespace, ...newNamespace}
    
    return new AppNamespace(
      newObject.id,
      newObject.hex,
      newObject.namespaceInfo,
      newObject.isActive,
      newObject.alias,
      newObject.levels,
      newObject.endHeight,
      newObject.name,
    )
  }

  static extractFullNamespace(namespace: NamespaceInfo,
    namespaceNames: NamespaceName[]): string {
    return namespace.levels.map((level) => {
      const namespaceName = namespaceNames.find((name) => name.namespaceId.equals(level));
      if (namespaceName === undefined) throw new Error('Not found')
      return namespaceName;
    })
      .map((namespaceName: NamespaceName) => namespaceName.name)
      .join('.');
  }

  isLinked(): boolean {
    return !(this.alias instanceof EmptyAlias)
  }

  expirationInfo(currentHeight: number): NamespaceExpirationInfo {
    if (!currentHeight) return null
    const expired = currentHeight > this.endHeight - namespaceGracePeriodDuration
    const expiredIn = this.endHeight - namespaceGracePeriodDuration - currentHeight
    const deletedIn = this.endHeight - currentHeight

    return {
      expired,
      remainingBeforeExpiration: {
        blocks: expiredIn,
        time: durationToRelativeTime(expiredIn)
      },
      remainingBeforeDeletion: {
        blocks: deletedIn,
        time: durationToRelativeTime(deletedIn)
      },
    }
  }
}
