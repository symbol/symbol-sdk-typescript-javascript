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

import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
import { AccountRestrictionFlags } from '../restriction/AccountRestrictionType';
import { UInt64 } from '../UInt64';
import { AccountAddressRestrictionTransaction } from './AccountAddressRestrictionTransaction';
import { AccountMosaicRestrictionTransaction } from './AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from './AccountOperationRestrictionTransaction';
import { Deadline } from './Deadline';
import { TransactionType } from './TransactionType';
import { PublicAccount } from '../account/PublicAccount';

export class AccountRestrictionTransaction {
    /**
     * Create an account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags - Type of account restriction transaction
     * @param restrictionAdditions - Account restriction additions.
     * @param restrictionDeletions - Account restriction deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static createAddressRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionFlags: AccountRestrictionFlags,
        restrictionAdditions: (Address | NamespaceId)[],
        restrictionDeletions: (Address | NamespaceId)[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountAddressRestrictionTransaction {
        if (
            ![
                AccountRestrictionFlags.AllowIncomingAddress,
                AccountRestrictionFlags.AllowOutgoingAddress,
                AccountRestrictionFlags.BlockOutgoingAddress,
                AccountRestrictionFlags.BlockIncomingAddress,
            ].includes(restrictionFlags)
        ) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountAddressRestrictionTransaction.create(
            deadline,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions,
            networkType,
            maxFee,
            signature,
            signer,
        );
    }

    /**
     * Create an account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags - Type of account restriction transaction
     * @param restrictionAdditions - Account restriction additions.
     * @param restrictionDeletions - Account restriction deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {AccountMosaicRestrictionTransaction}
     */
    public static createMosaicRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionFlags: AccountRestrictionFlags,
        restrictionAdditions: (MosaicId | NamespaceId)[],
        restrictionDeletions: (MosaicId | NamespaceId)[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountMosaicRestrictionTransaction {
        if (![AccountRestrictionFlags.AllowMosaic, AccountRestrictionFlags.BlockMosaic].includes(restrictionFlags)) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountMosaicRestrictionTransaction.create(
            deadline,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions,
            networkType,
            maxFee,
            signature,
            signer,
        );
    }

    /**
     * Create an account operation restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags - Type of account restriction transaction
     * @param restrictionAdditions - Account restriction additions.
     * @param restrictionDeletions - Account restriction deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {AccountOperationRestrictionTransaction}
     */
    public static createOperationRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionFlags: AccountRestrictionFlags,
        restrictionAdditions: TransactionType[],
        restrictionDeletions: TransactionType[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountOperationRestrictionTransaction {
        if (
            ![AccountRestrictionFlags.AllowOutgoingTransactionType, AccountRestrictionFlags.BlockOutgoingTransactionType].includes(
                restrictionFlags,
            )
        ) {
            throw new Error('Restriction type is not allowed.');
        }
        return AccountOperationRestrictionTransaction.create(
            deadline,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions,
            networkType,
            maxFee,
            signature,
            signer,
        );
    }
}
