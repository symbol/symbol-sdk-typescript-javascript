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
 * Catapult REST Endpoints
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.18
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { AccountTypeEnum } from './accountTypeEnum';
import { ActivityBucketDTO } from './activityBucketDTO';
import { Mosaic } from './mosaic';

export class AccountDTO {
    /**
    * Decoded address.
    */
    'address': string;
    /**
    * Height of the blockchain.
    */
    'addressHeight': string;
    'publicKey': string;
    /**
    * Height of the blockchain.
    */
    'publicKeyHeight': string;
    'accountType': AccountTypeEnum;
    'linkedAccountKey': string;
    'activityBuckets': Array<ActivityBucketDTO>;
    /**
    * Mosaic units owned. The amount is represented in absolute amount. Thus a balance of 123456789 for a mosaic with divisibility 6 (absolute) means the account owns 123.456789. 
    */
    'mosaics': Array<Mosaic>;
    /**
    * Probability of an account to harvest the next block.
    */
    'importance': string;
    /**
    * Height of the blockchain.
    */
    'importanceHeight': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "address",
            "baseName": "address",
            "type": "string"
        },
        {
            "name": "addressHeight",
            "baseName": "addressHeight",
            "type": "string"
        },
        {
            "name": "publicKey",
            "baseName": "publicKey",
            "type": "string"
        },
        {
            "name": "publicKeyHeight",
            "baseName": "publicKeyHeight",
            "type": "string"
        },
        {
            "name": "accountType",
            "baseName": "accountType",
            "type": "AccountTypeEnum"
        },
        {
            "name": "linkedAccountKey",
            "baseName": "linkedAccountKey",
            "type": "string"
        },
        {
            "name": "activityBuckets",
            "baseName": "activityBuckets",
            "type": "Array<ActivityBucketDTO>"
        },
        {
            "name": "mosaics",
            "baseName": "mosaics",
            "type": "Array<Mosaic>"
        },
        {
            "name": "importance",
            "baseName": "importance",
            "type": "string"
        },
        {
            "name": "importanceHeight",
            "baseName": "importanceHeight",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return AccountDTO.attributeTypeMap;
    }
}
