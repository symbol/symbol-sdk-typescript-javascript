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

import { VersionedObjectStorage } from '@/core/database/backends/VersionedObjectStorage'
import { NodeModel } from '@/core/database/entities/NodeModel'

export class NodeModelStorage extends VersionedObjectStorage<NodeModel[]> {
  /**
   * Singleton instance as we want to run the migration just once
   */
  public static INSTANCE = new NodeModelStorage()

  private constructor() {
    super('node', [
      {
        description: 'Update node to 0.9.5.1 network',
        migrate: () => undefined,
      },
    ])
  }
}
