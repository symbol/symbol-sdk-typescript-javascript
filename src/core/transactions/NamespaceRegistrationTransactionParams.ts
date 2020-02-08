/**
 * 
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
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
import {UInt64, NamespaceRegistrationType, NamespaceRegistrationTransaction} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from './TransactionParams'

export interface NamespaceRegistrationFormFieldsType {
  rootNamespaceName: string
  namespaceRegistrationType: NamespaceRegistrationType
  subNamespaceName?: string
  duration?: UInt64
  maxFee: UInt64
}

export class NamespaceRegistrationTransactionParams extends TransactionParams {
  /**
   * Create a transaction parameters instance
   *
   * @param {string[]} fields
   */
  constructor() {
    super([
      'rootNamespaceName',
      'namespaceRegistrationType',
      'subNamespaceName',
      'duration',
      'maxFee',
    ])
  }

  public static create(rawParams: NamespaceRegistrationFormFieldsType): NamespaceRegistrationTransactionParams {
    const params = new NamespaceRegistrationTransactionParams()
    
    params.setParam('rootNamespaceName', rawParams.rootNamespaceName)
    params.setParam('namespaceRegistrationType', rawParams.namespaceRegistrationType)
    params.setParam('subNamespaceName', rawParams.subNamespaceName || null)
    params.setParam('duration', rawParams.duration || null)
    params.setParam('maxFee', rawParams.maxFee)

    return params
  }

  public static getView(transaction: NamespaceRegistrationTransaction) {
    // @TODO 
    return null
  }
}
