/*
 * Copyright 2018 NEM
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
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicSupplyType } from '../mosaic/MosaicSupplyType';
import { UInt64 } from '../UInt64';
import {MosaicSupplyChangeTransaction
        as MosaicSupplyChangeTransactionLibrary,
} from './builders/MosaicSupplyChangeTransaction';
import {VerifiableTransaction} from './builders/VerifiableTransaction';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
export class MosaicSupplyChangeTransaction extends Transaction {

    /**
     * Create a mosaic supply change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The mosaic id.
     * @param direction - The supply type.
     * @param delta - The supply change in units for the mosaic.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicSupplyChangeTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicId: MosaicId,
                         direction: MosaicSupplyType,
                         delta: UInt64,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicSupplyChangeTransaction {
        return new MosaicSupplyChangeTransaction(networkType,
            TransactionVersion.MOSAIC_SUPPLY_CHANGE,
            deadline,
            maxFee,
            mosaicId,
            direction,
            delta,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param direction
     * @param delta
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The supply type.
                 */
                public readonly direction: MosaicSupplyType,
                /**
                 * The supply change in units for the mosaic.
                 */
                public readonly delta: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_SUPPLY_CHANGE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicSupplyChangeTransaction
     * @returns {number}
     * @memberof MosaicSupplyChangeTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteMosaicId = 8;
        const byteDirection = 1;
        const byteDelta = 8;

        return byteSize + byteMosaicId + byteDirection + byteDelta;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new MosaicSupplyChangeTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .addDirection(this.direction)
            .addDelta(this.delta.toDTO())
            .build();
    }

}
