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
import { RepositoryFactoryHttp } from 'symbol-sdk'
import { NodeService } from '@/services/NodeService'
import { toArray } from 'rxjs/operators'

const nodeService = new NodeService()
const realUrl = 'http://api-01.us-west-1.symboldev.network:3000'
const realRepositoryFactory = new RepositoryFactoryHttp(realUrl)

describe.skip('services/NodeService', () => {
  test('getNodes', async () => {
    const peers = await nodeService.getNodes(realRepositoryFactory, realUrl).pipe(toArray()).toPromise()
    console.log(JSON.stringify(peers, null, 2))
  })
})
