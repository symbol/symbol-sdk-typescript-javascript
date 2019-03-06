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

export enum ReceiptType {
    Harvest_Fee = 0x4321,
    Address_Alias_Resolution = 0x43F1,
    Mosaic_Alias_Resolution = 0x43F2,
    Transaction_Group = 0x43E1,
    Mosaic_Expired = 0x4D41,
    Mosaic_Levy = 0x4D12,
    Mosaic_Rental_Fee = 0x43E1,
    Namespace_Expired = 0x4E41,
    Namespace_Rental_Fee = 0x4E12,
    LockHash_Created = 0x4831,
    LockHash_Completed = 0x4822,
    LockHash_Expired = 0x4823,
    LockSecret_Created = 0x5231,
    LockSecret_Completed = 0x5222,
    LockSecret_Expired = 0x5223,
}
