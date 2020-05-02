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
import { NetworkService } from '@/services/NetworkService'

import networkConfig from '../../config/network.conf.json'

const networkService = new NetworkService()
describe.skip('services/NetworkService', () => {
  test('getNetworkModel when default', async () => {
    const data = await networkService.getNetworkModel(undefined).toPromise()
    expect(data.networkModel.url).toBe(networkConfig.defaultNodeUrl)
    expect(data.fallback).toBe(false)
  })

  test('getNetworkModel when custom', async () => {
    const candidate = 'http://api-01.eu-central-1.symboldev.network:3000'
    const data = await networkService.getNetworkModel(candidate).toPromise()
    expect(data.networkModel.url).toBe(candidate)
    expect(data.fallback).toBe(false)
  })

  test('getNetworkModel when broken', async () => {
    const candidate = 'http://localhost:3000'

    const data = await networkService.getNetworkModel(candidate).toPromise()
    expect(data.networkModel.url).toBe(networkConfig.defaultNodeUrl)
    expect(data.fallback).toBe(true)
  })
})
