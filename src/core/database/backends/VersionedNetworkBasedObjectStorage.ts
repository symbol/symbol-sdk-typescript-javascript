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
import { INetworkBasedStorage } from '@/core/database/backends/INetworkBasedStorage'
import { NetworkBasedObjectStorage } from '@/core/database/backends/NetworkBasedObjectStorage'
import { Migration, VersionedObjectStorage } from '@/core/database/backends/VersionedObjectStorage'
import { NetworkBasedModel } from '@/core/database/entities/NetworkBasedModel'

/**
 * A storage that wraps the stored model with a {version: n, data:T} object and it handles the migration from old
 * version to new versions.
 *
 */
export class VersionedNetworkBasedObjectStorage<E> extends NetworkBasedObjectStorage<E>
  implements INetworkBasedStorage<E> {
  constructor(storageKey: string, migrations: Migration[] = []) {
    super(new VersionedObjectStorage<NetworkBasedModel<E>>(storageKey, migrations))
  }
}
