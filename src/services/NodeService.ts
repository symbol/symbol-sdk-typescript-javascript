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

import { NodeInfo, RepositoryFactory } from 'symbol-sdk'
import { Observable } from 'rxjs'
import { ObservableHelpers } from '@/core/utils/ObservableHelpers'
import { map, tap } from 'rxjs/operators'
import { NodeModel } from '@/core/database/entities/NodeModel'
import * as _ from 'lodash'
import networkConfig from '@/../config/network.conf.json'
import { NodeModelStorage } from '@/core/database/storage/NodeModelStorage'

/**
 * The service in charge of loading and caching anything related to Node and Peers from Rest.
 * The cache is done by storing the payloads in SimpleObjectStorage.
 */
export class NodeService {
  /**
   * The peer information local cache.
   */
  private readonly storage = NodeModelStorage.INSTANCE

  public getKnowNodesOnly(): NodeModel[] {
    return _.uniqBy(this.loadNodes().concat(this.loadStaticNodes()), 'url')
  }

  public getNodes(repositoryFactory: RepositoryFactory, repositoryFactoryUrl: string): Observable<NodeModel[]> {
    const storedNodes = this.getKnowNodesOnly()
    const nodeRepository = repositoryFactory.createNodeRepository()

    return nodeRepository.getNodeInfo().pipe(
      map((dto: NodeInfo) => this.createNodeModel(repositoryFactoryUrl, dto.friendlyName)),
      ObservableHelpers.defaultLast(this.createNodeModel(repositoryFactoryUrl)),
      map((currentNode) => _.uniqBy([currentNode, ...storedNodes], 'url')),
      tap((p) => this.saveNodes(p)),
    )
  }

  private loadStaticNodes(): NodeModel[] {
    return networkConfig.nodes.map((n) => {
      return this.createNodeModel(n.url, n.friendlyName, true)
    })
  }

  private createNodeModel(
    url: string,
    friendlyName: string | undefined = undefined,
    isDefault: boolean | undefined = undefined,
  ): NodeModel {
    return new NodeModel(url, friendlyName || '', isDefault || !!networkConfig.nodes.find((n) => n.url === url))
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
