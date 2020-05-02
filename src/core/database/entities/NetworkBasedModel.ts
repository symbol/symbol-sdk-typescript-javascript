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
 * A model that store some generic value based on the generation hash.
 */
export type NetworkBasedModel<E> = Record<string, NetworkBasedEntryModel<E>>

export class NetworkBasedEntryModel<E> {
  public readonly timestamp = Date.now()

  constructor(public readonly generationHash: string, public readonly data: E) {}
}
