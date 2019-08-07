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
export enum MosaicFlags {
    /** No flags present. */
    NONE = 0,
    /** Mosaic supports supply changes even when mosaic owner owns partial supply. */
    SUPPLY_MUTABLE = 1,
    /** Mosaic supports transfers between arbitrary accounts \note when not set, mosaic can only be transferred to and from mosaic owner. */
    TRANSFERABLE = 2,
    /** Mosaic supports custom restrictions configured by mosaic owner. */
    RESTRICTABLE = 4,
}
