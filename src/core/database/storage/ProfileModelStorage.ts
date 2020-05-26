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
import { ProfileModel } from '@/core/database/entities/ProfileModel'

export class ProfileModelStorage extends VersionedObjectStorage<Record<string, ProfileModel>> {
  /**
   * Singleton instance as we want to run the migration just once
   */
  public static INSTANCE = new ProfileModelStorage()

  private constructor() {
    super('profiles', [
      {
        description: 'Update profiles to 0.9.5.1 network',
        migrate: (from: any) => {
          // update all pre-0.9.5.1 profiles
          const profiles = Object.keys(from)

          const modified: any = from
          profiles.map((name: string) => {
            modified[name] = {
              ...modified[name],
              generationHash: '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2',
            }
          })

          return modified
        },
      },
    ])
  }
}
