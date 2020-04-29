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
/**
 * POJO that stores user provided general application settings.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be fined.
 */
export class SettingsModel {

  constructor(
    public readonly profileName: string,
    public readonly language: string,
    public readonly defaultFee: number,
    public readonly defaultAccount: string,
    public readonly explorerUrl: string,
  ) {

  }
}
