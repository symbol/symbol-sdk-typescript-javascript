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

import {NodeInfo, NodeRepository, RepositoryFactory, RoleType} from 'symbol-sdk'
import {combineLatest, Observable, of} from 'rxjs'
import {ObservableHelpers} from '@/core/utils/ObservableHelpers'
import {map, tap} from 'rxjs/operators'
import {NodeModel} from '@/core/database/entities/NodeModel'
import {URLHelpers} from '@/core/utils/URLHelpers'
import * as _ from 'lodash'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'


import networkConfig from '@/../config/network.conf.json'

/**
 * The service in charge of loading and caching anything related to Node and Peers from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NodeService {

  /**
   * The peer information local cache.
   */
  private readonly storage = new SimpleObjectStorage<NodeModel[]>('node')

  public getNodes(repositoryFactory: RepositoryFactory, repositoryFactoryUrl: string): Observable<NodeModel[]> {
    const storedNodes = this.loadNodes().concat(this.loadStaticNodes())
    const nodeRepository = repositoryFactory.createNodeRepository()

    return combineLatest([
      nodeRepository.getNodeInfo().pipe(map(dto => this.createNodeModel(repositoryFactoryUrl, dto.friendlyName)))
        .pipe(ObservableHelpers.defaultLast(this.createNodeModel(repositoryFactoryUrl))),
      this.getNodePeers(nodeRepository)
        .pipe(ObservableHelpers.defaultLast(
          storedNodes)),

    ]).pipe(map(restData => {
      const currentNode = restData[0]
      const nodePeers = restData[1]
      const nodeInfos = [currentNode].concat(nodePeers, storedNodes)
      return _.uniqBy(nodeInfos, 'url')
    }), tap(p => this.saveNodes(p)))
  }


  private getNodePeers(nodeRepository: NodeRepository): Observable<NodeModel[]> {
    // return nodeRepository.getNodePeers().pipe(map(l => l.map(this.toNodeModel).filter(n => n && n.url)))
    return of([])
  }

  private loadStaticNodes(): NodeModel[] {
    return networkConfig.nodes.map(n => {
      return this.createNodeModel(n.url, n.friendlyName, true)
    })
  }

  private toNodeModel(n: NodeInfo): NodeModel | undefined {
    if (!n.host || n.roles == RoleType.PeerNode) {
      return undefined
    }
    const resolvedUrl = URLHelpers.getNodeUrl(n.host)
    return this.createNodeModel(resolvedUrl, n.friendlyName)
  }


  private createNodeModel(url: string,
    friendlyName: string | undefined = undefined,
    isDefault: boolean | undefined = undefined): NodeModel {
    return new NodeModel(url, friendlyName || '', isDefault
      || !!networkConfig.nodes.find(n => n.url === url))
  }

  private loadNodes(): NodeModel[] {
    return this.storage.get() || []
  }

  public saveNodes(nodes: NodeModel[]) {
    this.storage.set(nodes)
  }

  public reset() {
    this.storage.remove()
  }
}
