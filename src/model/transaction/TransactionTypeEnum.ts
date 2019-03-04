/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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
 * Copy of the TransactionType class
 */

export enum TransactionTypeEnum {
    TRANSFER = 0x4154,
    REGISTER_NAMESPACE = 0x414E,
    ADDRESS_ALIAS = 0x424E,
    MOSAIC_ALIAS = 0x434E,
    MOSAIC_DEFINITION = 0x414D,
    MOSAIC_SUPPLY_CHANGE = 0x424D,
    MODIFY_MULTISIG_ACCOUNT = 0x4155,
    AGGREGATE_COMPLETE = 0x4141,
    AGGREGATE_BONDED = 0x4241,
    LOCK = 0x4148,
    SECRET_LOCK = 0x4152,
    SECRET_PROOF = 0x4252,
    MODIFY_ACCOUNT_PROPERTY_ADDRESS = 0x4150,
    MODIFY_ACCOUNT_PROPERTY_MOSAIC = 0x4250,
    MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE = 0x4350,
}
