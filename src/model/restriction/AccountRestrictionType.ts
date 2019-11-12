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
 * Account restriction type
 * 0x01	Account restriction type is an address.
 * 0x02	Account restriction type is a mosaic id.
 * 0x04	Account restriction type is a transaction type.
 * 0x05	restriction type sentinel.
 * 0x40 Account restriction is interpreted as outgoing restriction.
 * 0x80 Account restriction is interpreted as blocking operation.
 */

 // !!This enum will be deprecated once catbuffer code applied.
enum AccountRestrictionTypeEnum {
    Address = 0x0001,
    Mosaic = 0x0002,
    TransactionType = 0x0004,
    Outgoing = 0x4000,
    Block = 0x8000,
}

export enum AccountRestrictionFlags {
    /**
     * Allow only incoming transactions from a given address.
     */
    AllowIncomingAddress = AccountRestrictionTypeEnum.Address,

    /**
     * Allow only incoming transactions containing a a given mosaic identifier.
     */
    AllowMosaic = AccountRestrictionTypeEnum.Mosaic,

    /**
     * Allow only outgoing transactions with a given transaction type.
     */
    AllowIncomingTransactionType = AccountRestrictionTypeEnum.TransactionType,

    /**
     * Allow only outgoing transactions to a given address.
     */
    AllowOutgoingAddress = (AccountRestrictionTypeEnum.Address + AccountRestrictionTypeEnum.Outgoing),

    /**
     * Allow only outgoing transactions with a given transaction type.
     */
    AllowOutgoingTransactionType = (AccountRestrictionTypeEnum.TransactionType +
                                                           AccountRestrictionTypeEnum.Outgoing),

    /**
     * Block incoming transactions from a given address.
     */
    BlockIncomingAddress = (AccountRestrictionTypeEnum.Address + AccountRestrictionTypeEnum.Block),

    /**
     * Block incoming transactions containing a given mosaic identifier.
     */
    BlockMosaic = (AccountRestrictionTypeEnum.Mosaic + AccountRestrictionTypeEnum.Block),

    /**
     * Block incoming transactions with a given transaction type.
     */
    BlockIncomingTransactionType = (AccountRestrictionTypeEnum.TransactionType +
                                                           AccountRestrictionTypeEnum.Block),

    /**
     * Block outgoing transactions from a given address.
     */
    BlockOutgoingAddress = (AccountRestrictionTypeEnum.Address +
                                                   AccountRestrictionTypeEnum.Block + 
                                                   AccountRestrictionTypeEnum.Outgoing),
    /**
     * Block outgoing transactions with a given transaction type.
     */
    BlockOutgoingTransactionType = (AccountRestrictionTypeEnum.TransactionType +
                                                           AccountRestrictionTypeEnum.Block +
                                                           AccountRestrictionTypeEnum.Outgoing),
}
