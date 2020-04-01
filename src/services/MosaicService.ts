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
import {MosaicId, AccountInfo, NamespaceId, Mosaic, MosaicInfo, UInt64} from 'symbol-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'
import {MosaicsRepository} from '@/repositories/MosaicsRepository'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'
import {NamespaceService} from './NamespaceService'
import { TimeHelpers } from '@/core/utils/TimeHelpers'

// custom types
export type ExpirationStatus = 'unlimited' | 'expired' | string | number

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
   * @param {Function} filterFn
   * @return {MosaicsModel[]}
   */
  public getMosaics(
    filterFn: (
      value: MosaicsModel,
      index: number,
      array: MosaicsModel[]
    ) => boolean = () => true,  
  ): MosaicsModel[] {
    const repository = new MosaicsRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Refresh mosaic models data
   * @param {Mosaic[] | MosaicInfo[]} mosaics Mosaics to create / refresh in the database
   * @param {boolean} [forceUpdate=false]     Option to bypass the cache
   */
  public async refreshMosaicModels(
    mosaics: Mosaic[] | MosaicInfo[],
    forceUpdate = false,
  ) {
    // @ts-ignore
    const mosaicIds = mosaics.map(mosaic => mosaic.id)

    // initialize repository
    const repository = new MosaicsRepository()

    // if force update is selected, fetch info for all mosaics
    if (forceUpdate) {
      await this.fetchMosaicsInfos(mosaicIds as MosaicId[])
      return
    }

    // determine mosaics known and unknown from the repository
    const mosaicsInRepository: {id: MosaicId, known: boolean}[] = mosaicIds.map(
      id => ({ id: id as MosaicId, known: repository.find(id.toHex()) }),
    )

    // dispatch async handling for unknown mosaics
    const unknownMosaics = mosaicsInRepository.filter(({known}) => !known).map(({id}) => id)
    if(unknownMosaics.length) this.fetchMosaicsInfos(unknownMosaics)
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
    if (!mosaicId) return // @TODO: find route cause, should not happen

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
   * Fetch mosaics infos and updates the mosaic repository
   * @private
   * @param {Mosaic[]} mosaic
   * @returns {Promise<void>}
   */
  private async fetchMosaicsInfos(mosaicIds: MosaicId[]): Promise<void> {
    try {
      // call REST_FETCH_INFO and REST_FETCH_NAMES
      const [
        mosaicsInfo, mosaicNames,
      ]: [ MosaicInfo[], {hex: string, name: string}[] ] = await Promise.all([
        this.$store.dispatch('mosaic/REST_FETCH_INFOS', mosaicIds),
        this.$store.dispatch('mosaic/REST_FETCH_NAMES', mosaicIds),
      ])

      // initialize repository
      const repository = new MosaicsRepository()
      
      // - get network info from store
      const generationHash = this.$store.getters['network/generationHash']
      const networkMosaic: MosaicId = this.$store.getters['network/networkMosaic']

      // Create and store models
      mosaicIds.forEach(mosaicId => {
        const hexId = mosaicId.toHex()

        // get mosaic info
        const mosaicInfo = mosaicsInfo.find(({id}) => id.equals(mosaicId))
        if (mosaicsInfo === undefined) return

        // get mosaic name
        const nameEntry = mosaicNames.find(({hex}) => hex === hexId)
        const name = nameEntry ? nameEntry.name : ''

        
        // - find eventual existing model
        const existingModel = repository.find(hexId) ? repository.read(hexId) : null

        // create model
        const model = repository.createModel(new Map<string, any>([
          [ 'hexId', hexId ],
          [ 'name', name ],
          [ 'flags', mosaicInfo.flags.toDTO().flags ],
          [ 'startHeight', mosaicInfo.height.toHex() ],
          [ 'duration', mosaicInfo.duration.toHex() ],
          [ 'divisibility', mosaicInfo.divisibility ],
          [ 'supply', mosaicInfo.supply.toHex() ],
          [ 'ownerPublicKey', mosaicInfo.owner.publicKey ],
          [ 'generationHash', generationHash ],
          [ 'isCurrencyMosaic', mosaicId.equals(networkMosaic) ],
          [ 'isHarvestMosaic', false ], // @TODO: not managed
          [ 'isHidden', existingModel ? existingModel.values.get('isHidden') : false ],
        ]))
        
        // - update model if found
        if (existingModel) {
          repository.update(mosaicId.toHex(), model.values)
          return
        }

        // - store model
        repository.create(model.values)
      })
    } catch (error) {
      this.$store.dispatch(
        'diagnostic/ADD_DEBUG',
        `MosaicService/fetchMosaicsInfos error: ${JSON.stringify(error)}`,
      )
    }
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
      const hexId = mosaicId.toHex()

      // - fetch INFO from REST
      const mosaicInfo = await this.$store.dispatch('mosaic/REST_FETCH_INFO', mosaicId)

      // - fetch NAMES from REST
      const mosaicNames = await this.$store.dispatch('mosaic/REST_FETCH_NAMES', [mosaicId])

      // - use repository for storage
      const repository = new MosaicsRepository()

      // - find eventual existing model
      const existingModel = repository.find(hexId) ? repository.read(hexId) : null
      
      // - CREATE model
      const mosaic = repository.createModel(new Map<string, any>([
        [ 'hexId', hexId ],
        [ 'name', mosaicNames && mosaicNames.length ? mosaicNames.shift().name : '' ],
        [ 'flags', mosaicInfo.flags.toDTO().flags ],
        [ 'startHeight', mosaicInfo.height.toHex() ],
        [ 'duration', mosaicInfo.duration.toHex() ],
        [ 'divisibility', mosaicInfo.divisibility ],
        [ 'supply', mosaicInfo.supply.toHex() ],
        [ 'ownerPublicKey', mosaicInfo.owner.publicKey ],
        [ 'generationHash', generationHash ],
        [ 'isCurrencyMosaic', isCurrencyMosaic ],
        [ 'isHarvestMosaic', isHarvestMosaic ],
        [ 'isHidden', existingModel ? existingModel.values.get('isHidden') : false ],
      ]))

      // - update the model if it exists in the repository
      if (existingModel) {
        repository.update(mosaicId.toHex(), mosaic.values)
      } else {
        // - create a new entry in the repository
        repository.create(mosaic.values)
      }

      return mosaic
    }
    catch (e) {
      const repository = new MosaicsRepository()
      return repository.createModel(new Map<string, any>([
        [ 'hexId', mosaicId.toHex() ],
        [ 'name', mosaicId.toHex() ],
        [ 'flags', null ],
        [ 'startHeight', UInt64.fromUint(0).toHex() ],
        [ 'duration', UInt64.fromUint(0).toHex() ],
        [ 'divisibility', 0 ],
        [ 'supply', UInt64.fromUint(0).toHex() ],
        [ 'ownerPublicKey', '' ],
        [ 'generationHash', generationHash ],
        [ 'isCurrencyMosaic', isCurrencyMosaic ],
        [ 'isHarvestMosaic', isHarvestMosaic ],
        [ 'isHidden', false ],
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
    const info = await this.getMosaic(mosaic)
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

  /**
   * Returns a view of a mosaic expiration info
   * @private
   * @param {MosaicsInfo} mosaic
   * @returns {ExpirationStatus}
   */
  public getExpiration(mosaicInfo: MosaicInfo): ExpirationStatus {
    const duration = mosaicInfo.duration.compact()
    const startHeight = mosaicInfo.height.compact()

    // unlimited duration mosaics are flagged as duration == 0
    if (duration === 0) return 'unlimited'

    // get current height
    const currentHeight = this.$store.getters['network/currentHeight'] || 0

    // calculate expiration
    const expiresIn = startHeight + duration - currentHeight
    if (expiresIn <= 0) return 'expired'

    // number of blocks remaining
    return TimeHelpers.durationToRelativeTime(expiresIn)
  }

  /**
   * Set the hidden state of a mosaic
   * If no param is provided, the hidden state will be toggled
   * @param {(MosaicId | NamespaceId)} mosaicId
   * @param {boolean} [hide] Should the mosaic be hidden?
   */
  public toggleHiddenState(mosaicId: MosaicId | NamespaceId, hide?: boolean): void {
    const hexId = mosaicId.toHex()

    // get repository
    const repository = new MosaicsRepository()
    
    // return if the mosaic is not found in the database
    if (!repository.find(hexId)) return

    // get model
    const model = repository.read(hexId)

    // get next visibility state
    const nextVisibilityState = hide === undefined ? !model.values.get('isHidden') : hide
    
    // update visibility state
    model.values.set('isHidden', nextVisibilityState)

    // persist change
    repository.update(hexId, model.values)
  }
}
