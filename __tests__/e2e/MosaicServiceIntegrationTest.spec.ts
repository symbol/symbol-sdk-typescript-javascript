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
import {Address, RepositoryFactoryHttp} from 'symbol-sdk'
import {MosaicService} from '@/services/MosaicService'
import networkConfig from '../../config/network.conf.json'

const address1 = Address.createFromRawAddress('TDH3WI3AXBZJQMFI5XPTWRABTWVEDR54DMTHAB6I')
const address2 = Address.createFromRawAddress('TAI4NEL4SBQDSPY2XKMPIGOC53UALIXJ5WHRJVQZ')
const address3 = Address.createFromRawAddress('TAHNZXQBC57AA7KJTMGS3PJPZBXN7DV5JHJU42GL')
const address4 = Address.createFromRawAddress('TB5JQQKUT7MBEMFVIYYSZQ37JYG4UKMXCNJ6DUQ5')
const address5 = Address.createFromRawAddress('TAWBSSHIKZNX6E65FJG4BVIJR236Z64Z77CMOJBO')

const mosaicService = new MosaicService()
const realUrl = 'http://api-01.us-west-1.symboldev.network:3000'
const realRepositoryFactory = new RepositoryFactoryHttp(realUrl)

describe.skip('services/MosaicService', () => {
  test('getMosaics all addresses', async () => {
    const generationHash = await realRepositoryFactory.getGenerationHash().toPromise()
    const {networkCurrency} = await mosaicService.getNetworkCurrencies(
      realRepositoryFactory, generationHash, networkConfig.networkConfigurationDefaults,
    ).toPromise()
    const addresses: Address[] = [ address1, address2, address3, address4, address5 ]
    const accountInfos = await realRepositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService.getMosaics(realRepositoryFactory, generationHash, networkCurrency,
      accountInfos).toPromise()
    console.log(JSON.stringify(result, null, 2))
  })

  test('getMosaics account 1 addresses', async () => {
    const generationHash = await realRepositoryFactory.getGenerationHash().toPromise()
    const {networkCurrency} = await mosaicService.getNetworkCurrencies(
      realRepositoryFactory, generationHash, networkConfig.networkConfigurationDefaults,
    ).toPromise()
    const addresses: Address[] = [address1]
    const accountInfos = await realRepositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService.getMosaics(realRepositoryFactory, generationHash, networkCurrency,
      accountInfos).toPromise()
    console.log(JSON.stringify(result, null, 2))
  })

  test('getMosaics account 3 addresses', async () => {
    const generationHash = await realRepositoryFactory.getGenerationHash().toPromise()
    const {networkCurrency} = await mosaicService.getNetworkCurrencies(
      realRepositoryFactory, generationHash, networkConfig.networkConfigurationDefaults,
    ).toPromise()
    const addresses: Address[] = [address3]
    const accountInfos = await realRepositoryFactory.createAccountRepository().getAccountsInfo(addresses).toPromise()
    const result = await mosaicService.getMosaics(realRepositoryFactory, generationHash, networkCurrency,
      accountInfos).toPromise()
    console.log(JSON.stringify(result, null, 2))
  })
})
