/*
 * Copyright 2018 NEM
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
 * The account key flags enum,.
 */
export enum AccountKeyTypeFlags {
    /**
     * Unset key.
     */
    Unset = 0x00,

    /**
     * Linked account public key.
     * note This can be either a remote or main account public key depending on context.
     */
    Linked = 0x01,

    /**
     * Node public key on which remote is allowed to harvest.
     */
    Node = 0x02,

    /**
     * VRF public key.
     */
    VRF = 0x04,

    /**
     * All valid keys.
     */
    All = Linked | VRF | Node,
}
