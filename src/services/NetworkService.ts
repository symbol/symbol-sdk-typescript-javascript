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

import {NetworkModel} from '@/core/database/entities/NetworkModel'
import {Listener, NetworkConfiguration, RepositoryFactory, RepositoryFactoryHttp} from 'symbol-sdk'
import {URLHelpers} from '@/core/utils/URLHelpers'
import {combineLatest, defer, EMPTY, Observable} from 'rxjs'
import {catchError, concatMap, flatMap, map, take, tap} from 'rxjs/operators'
import * as _ from 'lodash'

import {ObservableHelpers} from '@/core/utils/ObservableHelpers'

import networkConfig from '../../config/network.conf.json'
import {fromIterable} from 'rxjs/internal-compatibility'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'
import {NetworkConfigurationHelpers} from '@/core/utils/NetworkConfigurationHelpers'
import {NetworkModelStorage} from '@/core/database/storage/NetworkModelStorage'

/**
 * The service in charge of loading and caching anything related to Network from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NetworkService {
  /**
   * The network information local cache.
   */
  private readonly storage = NetworkModelStorage.INSTANCE

  /**
   * The best default Url. It uses the stored condiguration if possible.
   */
  public getDefaultUrl(): string {
    const storedNetworkModel = this.storage.getLatest()
    return URLHelpers.formatUrl(
      storedNetworkModel && storedNetworkModel.url || networkConfig.defaultNodeUrl).url
  }

  /**
   * This method get the network data from the provided URL. If the server in the candidateUrl is down,
   * the next available url will be used.
   *
   * @param candidateUrl the new url.
   */
  public getNetworkModel(candidateUrl: string | undefined):
  Observable<{ fallback: boolean, networkModel: NetworkModel, repositoryFactory: RepositoryFactory }> {
    const possibleUrls = this.resolveCandidates(candidateUrl, this.storage.getLatest())
    const repositoryFactoryObservable = fromIterable(possibleUrls)
      .pipe(concatMap(url => this.createRepositoryFactory(url)))
      .pipe(take(1))
    return repositoryFactoryObservable.pipe(flatMap(({url, repositoryFactory}) => {
      return repositoryFactory.getGenerationHash().pipe(flatMap((generationHash => {
        const storedNetworkModel = this.storage.get(generationHash)
        const networkRepository = repositoryFactory.createNetworkRepository()
        const nodeRepository = repositoryFactory.createNodeRepository()
        return combineLatest([
          repositoryFactory.getNetworkType().pipe(ObservableHelpers.defaultLast(
            storedNetworkModel && storedNetworkModel.networkType || networkConfig.defaultNetworkType)),
          repositoryFactory.getGenerationHash().pipe(ObservableHelpers.defaultLast(
            storedNetworkModel && storedNetworkModel.generationHash)),
          networkRepository.getNetworkProperties().pipe(map(d => this.toNetworkConfigurationModel(d)),
            ObservableHelpers.defaultLast(
              storedNetworkModel && storedNetworkModel.networkConfiguration)),
          nodeRepository.getNodeInfo().pipe(ObservableHelpers.defaultLast(
            storedNetworkModel && storedNetworkModel.nodeInfo)),
        ]).pipe(map(restData => {
          return {
            fallback: !!candidateUrl && candidateUrl !== url,
            networkModel: new NetworkModel(url, restData[0], restData[1], restData[2], restData[3]),
            repositoryFactory,
          }
        }), tap(p => this.storage.set(generationHash, p.networkModel)))
      })))

    }))
  }


  private createRepositoryFactory(url: string): Observable<{ url: string, repositoryFactory: RepositoryFactory }> {

    console.log(`Testing ${url}`)
    const repositoryFactory = NetworkService.createRepositoryFactory(url)
    return defer(() => {
      return repositoryFactory.getGenerationHash()
    }).pipe(map(() => {
      console.log(`Peer ${url} seems OK`)
      return {url, repositoryFactory}
    }), catchError(e => {
      console.log(`Peer ${url} seems down. Ignoring. Error: ${e.message}`, e)
      return EMPTY
    }))
  }

  private toNetworkConfigurationModel(dto: NetworkConfiguration): NetworkConfigurationModel {
    const fileDefaults: NetworkConfigurationModel = networkConfig.networkConfigurationDefaults
    const fromDto: NetworkConfigurationModel = {
      maxMosaicDivisibility: NetworkConfigurationHelpers.maxMosaicDivisibility(dto),
      namespaceGracePeriodDuration: NetworkConfigurationHelpers.namespaceGracePeriodDuration(dto),
      lockedFundsPerAggregate: NetworkConfigurationHelpers.lockedFundsPerAggregate(dto),
      maxCosignatoriesPerAccount: NetworkConfigurationHelpers.maxCosignatoriesPerAccount(dto),
      blockGenerationTargetTime: NetworkConfigurationHelpers.blockGenerationTargetTime(dto),
      maxNamespaceDepth: NetworkConfigurationHelpers.maxNamespaceDepth(dto),
      maxMosaicDuration: NetworkConfigurationHelpers.maxMosaicDuration(dto),
      minNamespaceDuration: NetworkConfigurationHelpers.minNamespaceDuration(dto),
      maxNamespaceDuration: NetworkConfigurationHelpers.maxNamespaceDuration(dto),
      maxTransactionsPerAggregate: NetworkConfigurationHelpers.maxTransactionsPerAggregate(dto),
      maxCosignedAccountsPerAccount: NetworkConfigurationHelpers.maxCosignedAccountsPerAccount(dto),
      maxMessageSize: NetworkConfigurationHelpers.maxMessageSize(dto),
      maxMosaicAtomicUnits: NetworkConfigurationHelpers.maxMosaicAtomicUnits(dto),
      currencyMosaicId: NetworkConfigurationHelpers.currencyMosaicId(dto),
      harvestingMosaicId: NetworkConfigurationHelpers.harvestingMosaicId(dto),
    }
    return {...fileDefaults, ...fromDto}
  }


  private resolveCandidates(newUrl: string | undefined,
    storedNetworkModel: NetworkModel | undefined): string[] {
    // Should we load cached candidates in the node tables?
    return _.uniq(
      [ newUrl, storedNetworkModel && storedNetworkModel.url, networkConfig.defaultNodeUrl,
        ...networkConfig.nodes.map(n => n.url) ].filter(p => p))
  }

  public reset(generationHash: string) {
    this.storage.remove(generationHash)
  }

  /**
   * It creates the RepositoryFactory used to build the http repository/clients and listeners.
   * @param url the url.
   */
  public static createRepositoryFactory(url: string): RepositoryFactory {
    const repositoryFactory = new RepositoryFactoryHttp(url)
    const wsUrl = URLHelpers.httpToWsUrl(url)
    repositoryFactory.createListener = () => {
      return new Listener(wsUrl, WebSocket)
    }
    return repositoryFactory
  }
}
