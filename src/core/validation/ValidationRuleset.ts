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
// configuration
import networkConfig from '../../../config/network.conf.json'
import appConfig from '../../../config/app.conf.json'
const {MIN_PASSWORD_LENGTH} = appConfig.constants

// XXX network store config getter
const currentNetwork = networkConfig.networks['testnet-publicTest']
const {
  maxMessageSize,
  maxMosaicAtomicUnits,
  maxMosaicDivisibility,
  maxMosaicDuration,
  minNamespaceDuration,
} = currentNetwork.properties

export const ValidationRuleset = {
  address: 'required|address|addressNetworkType:currentAccount',
  accountPassword: 'required|accountPassword',
  addressOrAlias: 'required|addressOrAlias|addressOrAliasNetworkType:currentAccount',
  amount: `excluded:""|is_not:0|min_value:0|maxDecimals:${maxMosaicDivisibility}|max_value:${maxMosaicAtomicUnits}`,
  confirmPassword: 'required|confirmPassword:@newPassword',
  divisibility: 'required|min_value:0|max_value:6|integer',
  duration: `required|min_value:0|max_value:${maxMosaicDuration}`,
  generationHash: 'required|min:64|max:64',
  mosaicId: 'required|mosaicId',
  message: `max:${maxMessageSize}`,
  namespaceDuration: `required|min_value:${minNamespaceDuration}|maxNamespaceDuration`,
  namespaceName: {
    required: true,
    regex: '^[a-z0-9-_]{1,64}$',
  },
  subNamespaceName: {
    required: true,
    regex: '^[a-z0-9-_.]{1,64}$',
  },
  password: `required|min:${MIN_PASSWORD_LENGTH}|passwordRegex`,
  previousPassword: 'required|confirmLock:cipher',
  privateKey: 'min:64|max:64|privateKey',
  recipientPublicKey: 'required|publicKey',
  supply: `required|integer|min_value: 1|max_value:${maxMosaicAtomicUnits}`,
  walletPassword: 'required|confirmWalletPassword:wallet',
  url: 'required|url',
  newAccountName:'required|newAccountName',
  accountWalletName: 'required|accountWalletName',
  addressOrPublicKey: 'addressOrPublicKey',
}
