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

export declare module crypto {
    function toMobileKey(password: any, privateKey: any): any;

    function derivePassSha(password: any, count: any): any;

    function passwordToPrivatekey(common: any, walletAccount: any, algo: any): any;

    function randomKey(): any;

    function encrypt(data: any, key: any): any;

    function decrypt(data): any;

    function encodePrivKey(privateKey: string, password: string): any;

    function _encode(senderPriv: any, recipientPub: any, msg: any, iv: any, salt: any): any;

    function encode(senderPriv: any, recipientPub: any, msg: any): any;

    function decode(recipientPrivate: any, senderPublic: any, _payload: any): any;
}
