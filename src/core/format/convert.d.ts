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

export declare module convert {
    function toByte(char1: string, char2: string): number;

    function isHexString(input: string): boolean;

    function hexToUint8(input: string): Uint8Array;

    function uint8ToHex(input: Uint8Array): string;

    function tryParseUint(input: string): number;

    function uint8ToUint32(input: Uint8Array): Uint32Array;

    function uint32ToUint8(input: Uint32Array): Uint8Array;

    function uint8ToInt8(input: number): number;

    function int8ToUint8(input: number): number;

    function utf8ToHex(input: string): string;

    function rstr2utf8(input: string): string;
}