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
 * Account restriction type
 * 0x01	The restriction type is an address.
 * 0x02	The restriction type is mosaic id.
 * 0x03	The restriction type is a transaction type.
 * 0x04	restriction type sentinel.
 * 0x80 + type	The restriction is interpreted as a blocking operation.
 */

export enum RestrictionType {
    AllowAddress = 0x01,
    AllowMosaic = 0x02,
    AllowTransaction = 0x04,
    Sentinel = 0x05,
    BlockAddress = (0x80 + 0x01),
    BlockMosaic = (0x80 + 0x02),
    BlockTransaction = (0x80 + 0x04),
}
