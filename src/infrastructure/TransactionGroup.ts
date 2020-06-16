/*
 * Copyright 2020 NEM
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
 * A transaction could be classified in the following groups:
 * - Unconfirmed: The transaction reached the P2P network. At this point, it is not guaranteed that the transaction will be included in a block.
 * -Confirmed: The transaction is included in a block.
 * - Partial: The transaction requires to be cosigned by other transaction participants in order to be included in a block.
 */
export enum TransactionGroup {
    Unconfirmed = 'unconfirmed',
    Confirmed = 'confirmed',
    Partial = 'partial',
}
