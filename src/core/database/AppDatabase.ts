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
// internal dependencies
import {SimpleStorageAdapter} from './SimpleStorageAdapter'
import {LocalStorageBackend} from '@/core/database/backends/LocalStorageBackend'
import {JSONFormatter} from '@/core/database/formatters/JSONFormatter'
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {AccountsTable} from '@/core/database/entities/AccountsTable'
import {WalletsTable} from '@/core/database/entities/WalletsTable'
import {PeersTable} from '@/core/database/entities/PeersTable'
import {MosaicsTable} from '@/core/database/entities/MosaicsTable'
import {NamespacesTable} from '@/core/database/entities/NamespacesTable'
import {SettingsTable} from '@/core/database/entities/SettingsTable'

export class AppDatabase {
  
  public static getAdapter(): SimpleStorageAdapter{
    const adapter = new SimpleStorageAdapter(
      new LocalStorageBackend(),
      new JSONFormatter(),
    )

    // - configure database tables
    adapter.setSchemas(new Map<string, DatabaseTable>([
      [ 'accounts', new AccountsTable() ],
      [ 'wallets', new WalletsTable() ],
      [ 'endpoints', new PeersTable() ],
      [ 'mosaics', new MosaicsTable() ],
      [ 'namespaces', new NamespacesTable() ],
      [ 'settings', new SettingsTable() ],
    ]))

    return adapter
  }
}
