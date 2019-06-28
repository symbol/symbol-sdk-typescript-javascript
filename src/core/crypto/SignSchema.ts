/*
 * Copyright 2019 NEM
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

 /**
  * [KECCAK_REVERSED_KEY]: Keccak hash algorithm with reversed private keys.
  * [SHA3]: SHA3 hash algorithm without key reversal
  */
export enum SignSchema {
    KECCAK_REVERSED_KEY = 1,
    SHA3 = 2,
}
