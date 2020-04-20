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
import { PersistentHarvestingDelegationMessage } from '../message/PersistentHarvestingDelegationMessage';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { TransferTransaction } from './TransferTransaction';

export class PersistentDelegationRequestTransaction extends TransferTransaction {
    /**
     * Create a PersistentDelegationRequestTransaction with special message payload
     * for presistent harvesting delegation unlocking
     * @param deadline - The deadline to include the transaction.
     * @param delegatedPrivateKey - The private key of delegated account
     * @param recipientPublicKey - The recipient public key
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    public static createPersistentDelegationRequestTransaction(
        deadline: Deadline,
        delegatedPrivateKey: string,
        recipientPublicKey: string,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): PersistentDelegationRequestTransaction {
        const message = PersistentHarvestingDelegationMessage.create(delegatedPrivateKey, recipientPublicKey, networkType);
        return super.create(deadline, Address.createFromPublicKey(recipientPublicKey, networkType), [], message, networkType, maxFee);
    }
}
