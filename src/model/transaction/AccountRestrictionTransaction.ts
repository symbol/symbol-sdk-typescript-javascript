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

import { NetworkType } from '../blockchain/NetworkType';
import { AccountRestrictionType } from '../restriction/AccountRestrictionType';
import { UInt64 } from '../UInt64';
import { AccountAddressRestrictionTransaction } from './AccountAddressRestrictionTransaction';
import { AccountMosaicRestrictionTransaction } from './AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from './AccountOperationRestrictionTransaction';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { TransactionType } from './TransactionType';

export class AccountRestrictionTransaction {
    /**
     * Create an account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static createAddressRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: AccountRestrictionType,
        modifications: Array<AccountRestrictionModification<string>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): AccountAddressRestrictionTransaction {
        if (![AccountRestrictionType.AllowIncomingAddress,
              AccountRestrictionType.AllowOutgoingAddress,
              AccountRestrictionType.BlockOutgoingAddress,
              AccountRestrictionType.BlockIncomingAddress].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountAddressRestrictionTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountMosaicRestrictionTransaction}
     */
    public static createMosaicRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: AccountRestrictionType,
        modifications: Array<AccountRestrictionModification<number[]>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): AccountMosaicRestrictionTransaction {
        if (![AccountRestrictionType.AllowMosaic, AccountRestrictionType.BlockMosaic].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountMosaicRestrictionTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an account operation restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of operation modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountOperationRestrictionTransaction}
     */
    public static createOperationRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: AccountRestrictionType,
        modifications: Array<AccountRestrictionModification<TransactionType>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): AccountOperationRestrictionTransaction {
        if (![AccountRestrictionType.AllowIncomingTransactionType,
              AccountRestrictionType.AllowOutgoingTransactionType,
              AccountRestrictionType.BlockOutgoingTransactionType,
              AccountRestrictionType.BlockOutgoingTransactionType].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountOperationRestrictionTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }
}
