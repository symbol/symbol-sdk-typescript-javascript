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
import { NamespaceRegistrationTransaction, NamespaceRegistrationType } from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { NamespaceModel } from '@/core/database/entities/NamespaceModel'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
import { TimeHelpers } from '@/core/utils/TimeHelpers'

export class ViewNamespaceRegistrationTransaction extends TransactionView<NamespaceRegistrationTransaction> {
  /**
   * Displayed items
   */
  protected resolveDetailItems(): TransactionDetailItem[] {
    const transaction = this.transaction
    let rootNamespaceName: string
    let subNamespaceName: string
    if (NamespaceRegistrationType.RootNamespace === transaction.registrationType) {
      rootNamespaceName = transaction.namespaceName
    } else {
      subNamespaceName = transaction.namespaceName
      // - try to identify root namespace by id
      const parentId = transaction.parentId
      const namespaces: NamespaceModel[] = this.$store.getters['namespace/namespaces']
      const parent = namespaces.find((n) => n.namespaceIdHex === parentId.toHex() && n.name)
      if (parent) {
        rootNamespaceName = parent.name
      }
    }
    const registrationType = transaction.registrationType
    const duration = transaction.duration
    const networkConfiguration: NetworkConfigurationModel = this.$store.getters['network/networkConfiguration']
    const blockGenerationTargetTime = networkConfiguration.blockGenerationTargetTime
    if (registrationType === NamespaceRegistrationType.RootNamespace) {
      return [
        { key: 'namespace_name', value: rootNamespaceName },
        {
          key: 'duration',
          value: TimeHelpers.durationToRelativeTime(parseInt(duration.toString()), blockGenerationTargetTime),
        },
      ]
    }

    return [
      { key: 'namespace_name', value: subNamespaceName },
      {
        key: 'parent_namespace',
        value: rootNamespaceName,
      },
    ]
  }
}
