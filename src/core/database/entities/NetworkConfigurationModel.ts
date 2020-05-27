/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an AS IS BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

export class NetworkConfigurationModel {
  public readonly maxMosaicDivisibility: number
  public readonly namespaceGracePeriodDuration: number
  public readonly lockedFundsPerAggregate: string
  public readonly maxCosignatoriesPerAccount: number
  public readonly blockGenerationTargetTime: number
  public readonly maxNamespaceDepth: number
  public readonly maxMosaicDuration: number
  public readonly minNamespaceDuration: number
  public readonly maxNamespaceDuration: number
  public readonly maxTransactionsPerAggregate: number
  public readonly maxCosignedAccountsPerAccount: number
  public readonly maxMessageSize: number
  public readonly maxMosaicAtomicUnits: number
  public readonly currencyMosaicId: string
  public readonly harvestingMosaicId: string
  public readonly defaultDynamicFeeMultiplier: number
}
