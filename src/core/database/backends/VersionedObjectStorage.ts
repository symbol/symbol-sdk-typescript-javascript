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
import {IStorage} from '@/core/database/backends/IStorage'
import {VersionedModel} from '@/core/database/entities/VersionedModel'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'

/**
 * The operation to migrate the data.
 */
export interface Migration {

  readonly description: string

  migrate(from: any): any
}

/**
 * A storage that wraps the stored model with a {version: n, data:T} object and it handles the migration from old
 * version to new versions.
 *
 */
export class VersionedObjectStorage<E> implements IStorage<E> {

  private readonly delegate: IStorage<VersionedModel<E>>

  private readonly currentVersion: number

  constructor(storageKey: string, migrations: Migration[] = []) {
    this.delegate = new SimpleObjectStorage<VersionedModel<E>>(storageKey)
    this.currentVersion = migrations.length + 1
    const versioned = this.delegate.get()
    if (!versioned || versioned.version == this.currentVersion) {
      return
    }
    if (versioned.version > this.currentVersion) {
      throw new Error(`Current data version is ${versioned.version} but higher version is ${this.currentVersion}`)
    }
    const value = migrations.slice(versioned.version - 1).reduce((toMigrateData, migration) => {
      if (toMigrateData === undefined) {
        console.log(`data to migrate is undefined, ignoring migration ${migration.description}`)
        return undefined
      }
      console.log(`Applying migration ${migration.description}`)
      return migration.migrate(toMigrateData)
    }, versioned.data)
    if (value === undefined) {
      this.remove()
    } else {
      this.set(value)
    }
  }

  get(): E | undefined {
    const versioned = this.delegate.get()
    return versioned && versioned.data || undefined
  }

  remove(): void {
    this.delegate.remove()
  }

  set(value: E): void {
    this.delegate.set(new VersionedModel<E>(this.currentVersion, value))
  }

  getVersion(): E | number {
    const versioned = this.delegate.get()
    return versioned && versioned.version || undefined
  }

}
