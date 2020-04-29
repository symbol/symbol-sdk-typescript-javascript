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
import {Convert, Password, SHA3Hasher} from 'symbol-sdk'
// internal dependencies
import {ProfileModel} from '@/core/database/entities/ProfileModel'
import {ProfileModelStorage} from '@/core/database/storage/ProfileModelStorage'

/**
 * Service in charge of loading profiles information from the wallet.
 */
export class ProfileService {

  /**
   * The storage to keep user configuration around mosaics.  For example, the balance hidden
   * feature.
   */
  private readonly profilesStorage = ProfileModelStorage.INSTANCE

  public getProfiles(): ProfileModel[] {
    return Object.values(this.getProfilesByProfileName())
  }

  public getProfileByName(profileName: string): ProfileModel | undefined {
    return this.getProfilesByProfileName()[profileName]
  }

  public getProfilesByProfileName(): Record<string, ProfileModel> {
    return this.profilesStorage.get() || {}
  }

  public saveProfile(profile: ProfileModel): ProfileModel {
    const profiles = this.getProfilesByProfileName()
    profiles[profile.profileName] = profile
    this.profilesStorage.set(profiles)
    return profile
  }

  public deleteProfile(profileName: string) {
    const profiles = this.getProfilesByProfileName()
    delete profiles[profileName]
    this.profilesStorage.set(profiles)
  }

  public updateSeed(profile: ProfileModel, seed: string): ProfileModel {
    return this.saveProfile(Object.assign(profile, {seed}))
  }

  public updatePassword(profile: ProfileModel, password: string, hint: string, seed: string): ProfileModel {
    return this.saveProfile(Object.assign(profile, {password, hint, seed}))
  }

  public updateAccounts(profile: ProfileModel, accounts: string[]): ProfileModel {
    return this.saveProfile(Object.assign(profile, {accounts}))
  }

  /**
   * Return password hash that can be compared
   * @param password to be hashed
   * @return the password hash
   */
  public static getPasswordHash(password: Password): string {
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Convert.utf8ToHex(password.value))

    const hash = new Uint8Array(64)
    hasher.finalize(hash)
    return Convert.uint8ToHex(hash)
  }


}
