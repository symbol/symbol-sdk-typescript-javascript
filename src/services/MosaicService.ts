/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import _ from 'lodash'
import {
  AccountInfo,
  Address,
  MosaicId,
  MosaicInfo,
  MosaicNames,
  NamespaceId,
  RepositoryFactory,
  UInt64,
} from 'symbol-sdk'
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs'
import { flatMap, map, tap, toArray } from 'rxjs/operators'
// internal dependencies
import { MosaicConfigurationModel } from '@/core/database/entities/MosaicConfigurationModel'
import { MosaicModel } from '@/core/database/entities/MosaicModel'
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel'
import { ObservableHelpers } from '@/core/utils/ObservableHelpers'
import { TimeHelpers } from '@/core/utils/TimeHelpers'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'
import { NetworkCurrenciesModel } from '@/core/database/entities/NetworkCurrenciesModel'
import { MosaicModelStorage } from '@/core/database/storage/MosaicModelStorage'
import { NetworkCurrenciesModelStorage } from '@/core/database/storage/NetworkCurrenciesModelStorage'
import { MosaicConfigurationModelStorage } from '@/core/database/storage/MosaicConfigurationModelStorage'

// custom types
export type ExpirationStatus = 'unlimited' | 'expired' | string | number

// TODO. Can this interface be removed?
export interface AttachedMosaic {
  id: MosaicId | NamespaceId
  mosaicHex: string
  /**
   * Relative amount
   */
  amount: number
}

interface MosaicBalance {
  mosaicId: MosaicId
  amount: UInt64
  address: Address
}

/**
 * The service in charge of loading and caching anything related to Mosaics from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 *
 * The service also holds configuration about the current mosaics, for example which mosaic
 * balances are currently hidden.
 */
export class MosaicService {
  /**
   * Store that caches the mosaic information of the current accounts when returned from rest.
   */
  private readonly mosaicDataStorage = MosaicModelStorage.INSTANCE

  /**
   * The storage to keep user configuration around mosaics.  For example, the balance hidden
   * feature.
   */
  private readonly mosaicConfigurationsStorage = MosaicConfigurationModelStorage.INSTANCE

  /**
   * Store that caches the information around the network currency.
   */
  private readonly networkCurrencyStorage = NetworkCurrenciesModelStorage.INSTANCE

  /**
   * This method loads and caches the mosaic information for the given accounts.
   * The returned Observable will announce the cached information first, then the rest returned
   * information (if possible).
   *
   * @param {RepositoryFactory} repositoryFactory
   * @param {string} generationHash
   * @param {NetworkCurrencyModel} networkCurrency
   * @param {AccountInfo[]} accountsInfo
   * @returns {Observable<MosaicModel[]>}
   */
  public getMosaics(
    repositoryFactory: RepositoryFactory,
    generationHash: string,
    networkCurrency: NetworkCurrencyModel,
    accountsInfo: AccountInfo[],
  ): Observable<MosaicModel[]> {
    if (!accountsInfo.length) {
      return of([])
    }
    const mosaicDataList = this.loadMosaicData(generationHash) || []
    const resolvedBalancesObservable = this.resolveBalances(repositoryFactory, accountsInfo)
    const accountAddresses = accountsInfo.map((a) => a.address)
    const mosaicsFromAccountsObservable = repositoryFactory
      .createMosaicRepository()
      .getMosaicsFromAccounts(accountAddresses)

    return combineLatest([resolvedBalancesObservable, mosaicsFromAccountsObservable])
      .pipe(
        flatMap(([balances, owedMosaics]) => {
          const mosaicIds: MosaicId[] = _.uniqBy(
            [...balances.map((m) => m.mosaicId), ...owedMosaics.map((o) => o.id)],
            (m) => m.toHex(),
          )
          const nameObservables = repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds)
          const mosaicInfoObservable = this.loadMosaic(repositoryFactory, mosaicIds, owedMosaics)
          return combineLatest([nameObservables, mosaicInfoObservable]).pipe(
            map(([names, mosaicInfos]) => {
              return this.toMosaicDtos(balances, mosaicInfos, names, networkCurrency, accountAddresses)
            }),
          )
        }),
      )
      .pipe(
        tap((d) => this.saveMosaicData(generationHash, d)),
        ObservableHelpers.defaultFirst(mosaicDataList),
      )
  }

  private loadMosaic(
    repositoryFactory: RepositoryFactory,
    mosaicIds: MosaicId[],
    alreadyLoadedMosaics: MosaicInfo[],
  ): Observable<MosaicInfo[]> {
    const toLoadMosaicIds = mosaicIds.filter(
      (mosaicId) => !alreadyLoadedMosaics.some((info) => info.id.equals(mosaicId)),
    )
    if (toLoadMosaicIds.length) {
      return repositoryFactory
        .createMosaicRepository()
        .getMosaics(toLoadMosaicIds)
        .pipe(map((newMosaics) => newMosaics.concat(alreadyLoadedMosaics)))
    } else {
      return of(alreadyLoadedMosaics)
    }
  }

  private getName(mosaicNames: MosaicNames[], accountMosaicDto: MosaicId): string {
    return _.first(
      mosaicNames
        .filter((n) => n.mosaicId.equals(accountMosaicDto))
        .filter((n) => n.names.length)
        .map((n) => n.names[0].name),
    )
  }

  private toMosaicDtos(
    balances: MosaicBalance[],
    mosaicDtos: MosaicInfo[],
    mosaicNames: MosaicNames[],
    networkCurrency: NetworkCurrencyModel,
    accountAddresses: Address[],
  ): MosaicModel[] {
    return _.flatten(
      accountAddresses.map((address) => {
        return mosaicDtos.map((mosaicDto) => {
          const name = this.getName(mosaicNames, mosaicDto.id)
          const isCurrencyMosaic = mosaicDto.id.toHex() === networkCurrency.mosaicIdHex
          const balance = balances.find(
            (balance) => balance.mosaicId.equals(mosaicDto.id) && balance.address.equals(address),
          )
          return new MosaicModel(
            address.plain(),
            mosaicDto.owner.address.plain(),
            name,
            isCurrencyMosaic,
            (balance && balance.amount.compact()) || 0,
            mosaicDto,
          )
        })
      }),
    )
  }

  private resolveBalances(
    repositoryFactory: RepositoryFactory,
    accountsInfo: AccountInfo[],
  ): Observable<MosaicBalance[]> {
    const mosaicIdOrAliases = _.flatten(accountsInfo.map((a) => a.mosaics.map((m) => m.id)))
    const mosaicIdOrAliasesUnique = _.uniqBy(mosaicIdOrAliases, (m) => m.toHex())
    return this.resolveMosaicIds(repositoryFactory, mosaicIdOrAliasesUnique).pipe(
      map((resolveMosaicIds) => {
        return _.flatten(
          accountsInfo.map((a) => {
            return a.mosaics.map((m) => {
              return {
                address: a.address,
                amount: m.amount,
                mosaicId: resolveMosaicIds.find((pair) => pair.from.equals(m.id)).to,
              }
            })
          }),
        )
      }),
    )
  }

  private resolveMosaicIds(
    repositoryFactory: RepositoryFactory,
    ids: (NamespaceId | MosaicId)[],
  ): Observable<{ from: NamespaceId | MosaicId; to: MosaicId }[]> {
    const namespaceRepository = repositoryFactory.createNamespaceRepository()
    return from(ids)
      .pipe(
        flatMap((id) => {
          if (id instanceof MosaicId) {
            return of({ from: id, to: id as MosaicId })
          } else {
            const linkedMosaicIdObservable = namespaceRepository.getLinkedMosaicId(id as NamespaceId)
            return linkedMosaicIdObservable.pipe(
              map((to) => {
                return { from: id, to: to }
              }),
            )
          }
        }),
      )
      .pipe(toArray())
  }

  /**
   * This method returns the list of {@link NetworkCurrencyModel} of the network.
   *
   * The intent of this method is to resolve the configured main (like cat.currency or symbol.xym)
   * and harvest currencies (cat.harvest) returned by the network configuration endpoint.
   *
   * @param {RepositoryFactory} repositoryFactory
   * @param {generationHash} the generation hash.
   * @param {NetworkConfigurationModel} networkConfig
   * @returns {Observable<NetworkCurrencyModel[]>}
   */
  public getNetworkCurrencies(
    repositoryFactory: RepositoryFactory,
    generationHash: string,
    networkConfig: NetworkConfigurationModel,
  ): Observable<NetworkCurrenciesModel> {
    const storedNetworkCurrencies = this.networkCurrencyStorage.get(generationHash)
    const mosaicHttp = repositoryFactory.createMosaicRepository()
    const namespaceHttp = repositoryFactory.createNamespaceRepository()

    // get network currencies ids from stored network configuration
    const { currencyMosaicId, harvestingMosaicId } = networkConfig
    const currencyMosaic = new MosaicId(currencyMosaicId)
    const harvestingMosaic = new MosaicId(harvestingMosaicId)

    // filter out harvesting currency if it is the same as the network currency
    const mosaicIds = currencyMosaic.equals(harvestingMosaic) ? [currencyMosaic] : [currencyMosaic, harvestingMosaic]

    // get mosaicInfo and mosaic names from the network,
    // build network currency models
    return forkJoin({
      mosaicsInfo: mosaicHttp.getMosaics(mosaicIds).toPromise(),
      mosaicNames: namespaceHttp.getMosaicsNames(mosaicIds).toPromise(),
    }).pipe(
      map(({ mosaicsInfo, mosaicNames }) =>
        mosaicsInfo.map((mosaicInfo) => {
          const thisMosaicNames = mosaicNames.find((mn) => mn.mosaicId.equals(mosaicInfo.id))
          if (!thisMosaicNames) {
            throw new Error('thisMosaicNames not found at getNetworkCurrencies')
          }
          return this.getNetworkCurrency(mosaicInfo, thisMosaicNames)
        }),
      ),
      map((networkMosaics) => new NetworkCurrenciesModel(networkMosaics[0], networkMosaics[1] || networkMosaics[0])),
      tap((d) => this.networkCurrencyStorage.set(generationHash, d)),
      ObservableHelpers.defaultFirst(storedNetworkCurrencies),
    )
  }

  private loadMosaicData(generationHash: string): MosaicModel[] {
    return this.mosaicDataStorage.get(generationHash)
  }

  private saveMosaicData(generationHash: string, mosaics: MosaicModel[]) {
    this.mosaicDataStorage.set(generationHash, mosaics)
  }

  public reset(generationHash: string) {
    this.mosaicDataStorage.remove(generationHash)
    this.networkCurrencyStorage.remove(generationHash)
  }

  /**
   * Creates a network currency model given mosaic info and mosaic names
   * @param {MosaicInfo} mosaicInfo
   * @param {MosaicNames} mosaicName
   * @returns {(NetworkCurrencyModel | undefined)}
   */
  private getNetworkCurrency(mosaicInfo: MosaicInfo, mosaicName: MosaicNames): NetworkCurrencyModel | undefined {
    const mosaicId = mosaicInfo.id

    const namespaceName = this.getName([mosaicName], mosaicId)
    if (!namespaceName) {
      throw new Error('could not get namespaceName at getNetworkCurrency')
    }

    const namespaceId = new NamespaceId(namespaceName)

    const ticker =
      (namespaceId && namespaceId.fullName && namespaceId.fullName.split('.').pop().toUpperCase()) || undefined

    return new NetworkCurrencyModel(
      mosaicId.toHex(),
      namespaceId.toHex(),
      namespaceId.fullName,
      mosaicInfo.divisibility,
      mosaicInfo.flags.transferable,
      mosaicInfo.flags.supplyMutable,
      mosaicInfo.flags.restrictable,
      ticker,
    )
  }

  /**
   *
   * Utility method that returns the mosaic expiration status
   * @param mosaicInfo the mosaic info
   * @param currentHeight
   * @param blockGenerationTargetTime
   */
  public static getExpiration(
    mosaicInfo: MosaicModel,
    currentHeight: number,
    blockGenerationTargetTime: number,
  ): ExpirationStatus {
    const duration = mosaicInfo.duration
    const startHeight = mosaicInfo.height

    // unlimited duration mosaics are flagged as duration == 0
    if (duration === 0) return 'unlimited'

    // get current height
    // calculate expiration
    const expiresIn = startHeight + duration - (currentHeight || 0)
    if (expiresIn <= 0) return 'expired'
    // number of blocks remaining
    return TimeHelpers.durationToRelativeTime(expiresIn, blockGenerationTargetTime)
  }

  public getMosaicConfigurations(): Record<string, MosaicConfigurationModel> {
    return this.mosaicConfigurationsStorage.get() || {}
  }

  public getMosaicConfiguration(mosaicId: MosaicId): MosaicConfigurationModel {
    return this.getMosaicConfigurations()[mosaicId.toHex()] || new MosaicConfigurationModel()
  }

  public changeMosaicConfiguration(mosaicId: MosaicId, newConfigs: any): Record<string, MosaicConfigurationModel> {
    const mosaicConfigurationsStorage = this.getMosaicConfigurations()
    mosaicConfigurationsStorage[mosaicId.toHex()] = {
      ...this.getMosaicConfiguration(mosaicId),
      ...newConfigs,
    }
    this.mosaicConfigurationsStorage.set(mosaicConfigurationsStorage)
    return mosaicConfigurationsStorage
  }
}
