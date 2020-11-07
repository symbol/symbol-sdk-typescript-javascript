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

import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NetworkType } from '../network/NetworkType';
import { AddressRestrictionFlag } from '../restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../restriction/OperationRestrictionFlag';
import { UInt64 } from '../UInt64';
import { AccountAddressRestrictionTransaction } from './AccountAddressRestrictionTransaction';
import { AccountMosaicRestrictionTransaction } from './AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from './AccountOperationRestrictionTransaction';
import { Deadline } from './Deadline';
import { TransactionType } from './TransactionType';

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
        restrictionFlags: AddressRestrictionFlag,
        restrictionAdditions: UnresolvedAddress[],
        restrictionDeletions: UnresolvedAddress[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountAddressRestrictionTransaction {
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
        restrictionFlags: MosaicRestrictionFlag,
        restrictionAdditions: UnresolvedMosaicId[],
        restrictionDeletions: UnresolvedMosaicId[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountMosaicRestrictionTransaction {
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
        restrictionFlags: OperationRestrictionFlag,
        restrictionAdditions: TransactionType[],
        restrictionDeletions: TransactionType[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountOperationRestrictionTransaction {
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
