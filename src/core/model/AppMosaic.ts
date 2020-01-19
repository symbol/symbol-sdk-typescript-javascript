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
import { MosaicInfo } from 'nem2-sdk'

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
export class MosaicsModel extends DatabaseModel {
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

export class MosaicsTable extends DatabaseTable {
  public constructor() {
    super('mosaics', [
      'wallet',
      'hexId',
      'name',
      'info',
    ])
  }

  /**
   * Create a new model instance
   * @return {MosaicsModel}
   */
  public createModel(): MosaicsModel {
    return new MosaicsModel()
  }
}
/// end-region database entities

export class AppMosaic {
  /**
   * Model instance
   * @var {MosaicsModel}
   */
  public model: MosaicsModel

  /**
   * Database service
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService = new DatabaseService()

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter<MosaicsModel>}
   */
  protected adapter: SimpleStorageAdapter<MosaicsModel>

  constructor(
    public walletName: string,
    public hexId: string,
    public name: string,
    public info: MosaicInfo,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database')

    // get storage adapter
    this.adapter = this.dbService.getAdapter<MosaicsModel>()

    // populate model
    this.model = new MosaicsModel(new Map<string, any>([
      ['wallet', this.walletName],
      ['hexId', this.hexId],
      ['name', this.name],
      ['info', this.info],
    ]))
  }
}



/*
import {
  UInt64,
  MosaicAmountView,
  MosaicDefinitionTransaction,
  MosaicInfo,
  Namespace,
} from 'nem2-sdk'
import {MosaicProperties, AppNamespace, MosaicNamespaceStatusType} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'


export class AppMosaic {
  hex: string
  namespaceHex: string
  amount: any
  balance?: number
  expirationHeight: number | MosaicNamespaceStatusType.FOREVER
  height: UInt64
  mosaicInfo: MosaicInfo
  name: string
  properties: MosaicProperties
  hide: boolean

  constructor(appMosaic?: {
    hex: string
    expirationHeight?: number | MosaicNamespaceStatusType.FOREVER
    balance?: number
    name?: string
    amount?: any
    mosaicInfo?: MosaicInfo
    properties?: MosaicProperties
    hide?: boolean
    namespaceHex?: string
  }) {
    Object.assign(this, appMosaic)
    delete this.amount
    if (this.mosaicInfo) {
      const duration = this.mosaicInfo.duration.compact()
      this.expirationHeight = duration === 0
        ? MosaicNamespaceStatusType.FOREVER : this.mosaicInfo.height.compact() + duration
      this.expirationHeight = appMosaic.expirationHeight ? appMosaic.expirationHeight : this.expirationHeight
      this.properties = new MosaicProperties(
        this.mosaicInfo.isSupplyMutable(),
        this.mosaicInfo.isTransferable(),
        this.mosaicInfo.divisibility,
        this.mosaicInfo.duration.compact(),
        this.mosaicInfo.isRestrictable(),
      )
    }
  }

  static fromGetCurrentNetworkMosaic( mosaicDefinitionTransaction: MosaicDefinitionTransaction,
    namespace: Namespace): AppMosaic {
    const {mosaicId} = mosaicDefinitionTransaction
    return new AppMosaic({
      hex: mosaicId.toHex(),
      properties: new MosaicProperties(
        mosaicDefinitionTransaction.flags.supplyMutable,
        mosaicDefinitionTransaction.flags.transferable,
        mosaicDefinitionTransaction.divisibility,
        mosaicDefinitionTransaction.duration.compact(),
        mosaicDefinitionTransaction.flags.restrictable,
      ),
      name: namespace.name,
      namespaceHex: namespace.id.toHex(),
    })
  }

  static fromMosaicAmountView(mosaic: MosaicAmountView): AppMosaic {
    const mosaicHex = mosaic.mosaicInfo.id.toHex()
    return new AppMosaic({
      ...mosaic,
      hex: mosaicHex,
      balance: getRelativeMosaicAmount(
        mosaic.amount.compact(),
        mosaic.mosaicInfo.divisibility,
      ),
    })
  }

  static fromNamespace(namespace: Namespace | AppNamespace): AppMosaic {
    const namespaceHex = namespace instanceof AppNamespace ? namespace.hex : namespace.id.toHex()

    return new AppMosaic({
      hex: namespace.alias.mosaicId.toHex(),
      namespaceHex,
      name: namespace.name,
    })
  }
}
*/