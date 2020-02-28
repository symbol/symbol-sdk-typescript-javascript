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
import {Store} from 'vuex'
import {MosaicId, AccountInfo, NamespaceId, Mosaic} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'
import {MosaicsRepository} from '@/repositories/MosaicsRepository'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'
import {NamespaceService} from './NamespaceService'


export interface AttachedMosaic {
  id: MosaicId | NamespaceId
  mosaicHex: string
  /**
   * Relative amount
   */
  amount: number
}

export class MosaicService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'mosaic'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Read the collection of known mosaics from database.
   *
   * @param {Function} filterFn
   * @return {MosaicsModel[]}
   */
  public getMosaics(
    filterFn: (
      value: MosaicsModel,
      index: number,
      array: MosaicsModel[]
    ) => boolean = (e) => true
  ): MosaicsModel[] {
    const repository = new MosaicsRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Read mosaic from database or dispatch fetch action
   * from REST.
   *
   * @param {MosaicId} mosaicId 
   * @return {MosaicsModel}
   */
  public async getMosaic(
    mosaicId: MosaicId,
    isCurrencyMosaic: boolean = false,
    isHarvestMosaic: boolean = false,
  ): Promise<MosaicsModel> {
    const repository = new MosaicsRepository()
    let mosaic: MosaicsModel

    if (!repository.find(mosaicId.toHex())) {
      // - mosaic is unknown, fetch from REST + add to storage
      mosaic = await this.fetchMosaicInfo(mosaicId, isCurrencyMosaic, isHarvestMosaic)
    }
    else {
      // - mosaic known, build MosaicInfo from model
      mosaic = repository.read(mosaicId.toHex())
    }

    return mosaic
  }

  /**
   * Returns mosaic from database
   * if mosaic is not found, fetch from REST + add to storage as a side effect
   * @param {MosaicId} mosaicId
   * @returns {(MosaicsModel | null)}
   */
  public getMosaicSync(mosaicId: MosaicId | NamespaceId): MosaicsModel | null {
    const repository = new MosaicsRepository()

    // If the id is a NamespaceId, get the mosaicId from the namespace Id
    if (mosaicId instanceof NamespaceId) {
      const model = new NamespaceService(this.$store).getNamespaceSync(mosaicId)
      if (!model) return null

      const namespaceInfo = model.objects.namespaceInfo
      if (namespaceInfo.hasAlias() && namespaceInfo.alias.mosaicId) {
        return this.getMosaicSync(namespaceInfo.alias.mosaicId)
      }
    }

    if (!repository.find(mosaicId.toHex())) {
      // - mosaic is unknown, fetch from REST + add to storage
      this.fetchMosaicInfo(mosaicId as MosaicId)
      return null
    }

    return repository.read(mosaicId.toHex())
  }

  /**
   * Read mosaic from REST using store action.
   *
   * @internal
   * @param {MosaicId} mosaicId 
   * @return {MosaicsModel}
   */
  protected async fetchMosaicInfo(
    mosaicId: MosaicId,
    isCurrencyMosaic: boolean = false,
    isHarvestMosaic: boolean = false,
  ): Promise<MosaicsModel> {
    // - get network info from store
    const generationHash = this.$store.getters['network/generationHash']

    try {
      // - fetch INFO from REST
      const mosaicInfo = await this.$store.dispatch('mosaic/REST_FETCH_INFO', mosaicId)

      // - fetch NAMES from REST
      const mosaicNames = await this.$store.dispatch('mosaic/REST_FETCH_NAMES', [mosaicId])

      // - use repository for storage
      const repository = new MosaicsRepository()
      if (repository.find(mosaicId.toHex())) {
        //XXX update instead of just read
        return repository.read(mosaicId.toHex())
      }

      // - CREATE
      const mosaic = repository.createModel(new Map<string, any>([
        ['hexId', mosaicId.toHex()],
        ['name', mosaicNames && mosaicNames.length ? mosaicNames.shift().name : ''],
        ['flags', mosaicInfo.flags.toDTO().flags],
        ['startHeight', mosaicInfo.height],
        ['duration', mosaicInfo.duration.compact()],
        ['divisibility', mosaicInfo.divisibility],
        ['supply', mosaicInfo.supply],
        ['ownerPublicKey', mosaicInfo.owner.publicKey],
        ['generationHash', generationHash],
        ['isCurrencyMosaic', isCurrencyMosaic],
        ['isHarvestMosaic', isHarvestMosaic],
      ]))

      // - store and return
      repository.create(mosaic.values)
      return mosaic
    }
    catch (e) {
      const repository = new MosaicsRepository()
      return repository.createModel(new Map<string, any>([
        ['hexId', mosaicId.toHex()],
        ['name', mosaicId.toHex()],
        ['flags', null],
        ['startHeight', 0],
        ['duration', 0],
        ['divisibility', 0],
        ['supply', 0],
        ['ownerPublicKey', ''],
        ['generationHash', generationHash],
        ['isCurrencyMosaic', isCurrencyMosaic],
        ['isHarvestMosaic', isHarvestMosaic],
      ]))
    }
  }

  /**
   * Format a mosaic amount to relative format
   * @param {number} amount 
   * @param {MosaicId} mosaic 
   * @return {Promise<number>}
   */
  public async getRelativeAmount(
    amount: number,
    mosaic: MosaicId,
  ): Promise<number> {
    let info = await this.getMosaic(mosaic)
    return amount / Math.pow(10, info.values.get('divisibility') || 0)
  }

  /**
   * Format a mosaic amount to relative format
   * @param {number} amount 
   * @param {MosaicId} mosaic 
   * @return {number}
   */
  public getRelativeAmountSync(
    amount: number,
    mosaic: MosaicId,
  ): number {
    const info = this.getMosaicSync(mosaic)
    return amount / Math.pow(10, info.values.get('divisibility') || 0)
  }

  /**
   * Get list of balances mapped by address
   * @param {AccountInfo[]} accountsInfo 
   * @param {MosaicId} mosaic 
   * @return {Record<string, number>}  Object with address as key and balance as value
   */
  public mapBalanceByAddress(
    accountsInfo: AccountInfo[],
    mosaic: MosaicId,
  ): Record<string, number> {
    return accountsInfo.map(({mosaics, address}) => {
      // - check balance
      const hasNetworkMosaic = mosaics.find(
        mosaicOwned => mosaicOwned.id.equals(mosaic))

      // - account doesn't hold network mosaic
      if (hasNetworkMosaic === undefined) {
        return null
      }

      // - map balance to address
      const balance = hasNetworkMosaic.amount.compact()
      return {
        address: address.plain(),
        balance: this.getRelativeAmountSync(balance, mosaic),
      }
    }).reduce((acc, {address, balance}) => ({...acc, [address]: balance}), {})
  }

  public getAttachedMosaicsFromMosaics(mosaics: Mosaic[]): AttachedMosaic[] {
    return mosaics.map(
      mosaic => {
        const model = this.getMosaicSync(mosaic.id)
        
        // Skip and return default values until the model is fetched
        if (!model) {
          return {
            id: mosaic.id,
            mosaicHex: mosaic.id.toHex(),
            amount: mosaic.amount.compact() / Math.pow(10, 0),
          }
        }

        const info = model.objects.mosaicInfo
        const divisibility = info ? info.divisibility : 0

        return ({
          id: new MosaicId(model.getIdentifier()),
          mosaicHex: mosaic.id.toHex(),
          amount: mosaic.amount.compact() / Math.pow(10, divisibility),
        })
      })
  }
}
