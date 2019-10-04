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
export enum MosaicRestrictionType {
    /**
     * uninitialized value indicating no restriction
     */
    NONE = 0,

    /**
     * allow if equal
     */
    EQ = 1,

    /**
     * allow if not equal
     */
    NE = 2,

    /**
     * allow if less than
     */
    LT = 3,

    /**
     * allow if less than or equal
     */
    LE = 4,

    /**
     * allow if greater than
     */
    GT = 5,

    /**
     * allow if greater than or equal
     */
    GE = 6,
}
