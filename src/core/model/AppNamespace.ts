/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {NamespaceInfo} from 'nem2-sdk'

// internal dependencies
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {
  DatabaseRelation,
  DatabaseRelationType,
} from '@/core/database/DatabaseRelation'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {ServiceFactory} from '@/services/ServiceFactory'
import {DatabaseService} from '@/services/DatabaseService'
import {WalletsModel} from '@/core/model/AppWallet'
import {WalletsRepository} from '@/repositories/WalletsRepository'

/// region database entities
export class NamespacesModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'wallet',
    'hexId',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> =  new Map<string, DatabaseRelation>([
    ['wallet', new DatabaseRelation(DatabaseRelationType.ONE_TO_ONE)]
  ])

  /**
   * Resolve wallet relation
   * @return {Map<string, WalletsModel>}
   */
  public wallet(): WalletsModel {
    return this.fetchRelation<WalletsModel>(new WalletsRepository(), 'wallet')
  }
}

export class NamespacesTable extends DatabaseTable {
  public constructor() {
    super('namespaces', [
      'wallet',
      'hexId',
      'name',
      'info',
    ])
  }

  /**
   * Create a new model instance
   * @return {NamespacesModel}
   */
  public createModel(): NamespacesModel {
    return new NamespacesModel()
  }
}
/// end-region database entities

export class AppNamespace {
  /**
   * Model instance
   * @var {NamespacesModel}
   */
  public model: NamespacesModel

  /**
   * Database service
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService = new DatabaseService()

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter<NamespacesModel>}
   */
  protected adapter: SimpleStorageAdapter<NamespacesModel>

  constructor(
    public walletName: string,
    public hexId: string,
    public name: string,
    public info: NamespaceInfo,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database')

    // get storage adapter
    this.adapter = this.dbService.getAdapter<NamespacesModel>()

    // populate model
    this.model = new NamespacesModel(new Map<string, any>([
      ['wallet', this.walletName],
      ['hexId', this.hexId],
      ['name', this.name],
      ['info', this.info],
    ]))
  }
}




/*
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
      const namespaceName = namespaceNames.find((name) => name.namespaceId.equals(level))
      if (namespaceName === undefined) throw new Error('Not found')
      return namespaceName
    })
      .map((namespaceName: NamespaceName) => namespaceName.name)
      .join('.')
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
        time: durationToRelativeTime(expiredIn),
      },
      remainingBeforeDeletion: {
        blocks: deletedIn,
        time: durationToRelativeTime(deletedIn),
      },
    }
  }
}
*/