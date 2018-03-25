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
 * Static class containing network type constants.
 */
export enum NetworkType {
    /**
     * Main net network
     * @type {number}
     */
    MAIN_NET = 0x68,
    /**
     * Test net network
     * @type {number}
     */
    TEST_NET = 0x98,
    /**
     * Mijin net network
     * @type {number}
     */
    MIJIN = 0x60,
    /**
     * Mijin test net network
     * @type {number}
     */
    MIJIN_TEST = 0x90,
}
