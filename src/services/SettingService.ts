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
import { SettingsModel } from '@/core/database/entities/SettingsModel'

import feesConfig from '@/../config/fees.conf.json'
import appConfig from '@/../config/app.conf.json'
import networkConfig from '@/../config/network.conf.json'
import i18n from '@/language'
import { SettingsModelStorage } from '@/core/database/storage/SettingsModelStorage'

/**
 * Service in charge of loading and storing the SettingsModel from local storage.
 */
export class SettingService {
  /**
   * The the local storage that keeps the SettingsModel objects indexed by profileName.
   */
  private readonly storage = SettingsModelStorage.INSTANCE

  public getProfileSettings(profileName: string): SettingsModel {
    const storedData = this.storage.get() || {}
    return {
      ...this.createDefaultSettingsModel(profileName),
      ...(storedData[profileName] || {}),
    }
  }

  public changeProfileSettings(profileName: string, newConfigs: any): SettingsModel {
    const storedData = this.storage.get() || {}
    storedData[profileName] = {
      ...this.getProfileSettings(profileName),
      ...newConfigs,
    }
    this.storage.set(storedData)
    return storedData[profileName]
  }

  public createDefaultSettingsModel(profileName: string): SettingsModel {
    const browserLocale = i18n.locale
    const language = appConfig.languages.find((l) => l.value == browserLocale)
      ? browserLocale
      : appConfig.languages[0].value
    return new SettingsModel(profileName, language, feesConfig.median, '', networkConfig.explorerUrl)
  }
}
