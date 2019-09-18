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

import { Convert, RawAddress } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import {
    EmbeddedMosaicAddressRestrictionTransactionBuilder,
} from '../../infrastructure/catbuffer/EmbeddedMosaicAddressRestrictionTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { MosaicAddressRestrictionTransactionBuilder } from '../../infrastructure/catbuffer/MosaicAddressRestrictionTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedAddressDto } from '../../infrastructure/catbuffer/UnresolvedAddressDto';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class MosaicAddressRestrictionTransaction extends Transaction {

    /**
     * Create a mosaic address restriction transaction object
     *
     * Enabling accounts to transact with the token is similar to the process of
     * adding elevated permissions to a user in a company computer network.
     *
     * The mosaic creator can modify the permissions of an account by sending a
     * mosaic restriction transaction targeting the account address.
     *
     * **MosaicAddressRestrictionTransaction can only be announced in with Aggregate Transaction
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The mosaic id ex: new MosaicId([481110499, 231112638]).
     * @param restrictionKey - The restriction key.
     * @param targetAddress - The affected unresolved address.
     * @param previousRestrictionValue - The previous restriction value.
     * @param newRestrictionValue - The new restriction value.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicAddressRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicId: MosaicId,
                         restrictionKey: UInt64,
                         targetAddress: Address,
                         previousRestrictionValue: UInt64,
                         newRestrictionValue: UInt64,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicAddressRestrictionTransaction {
        return new MosaicAddressRestrictionTransaction(networkType,
            TransactionVersion.MOSAIC_ADDRESS_RESTRICTION,
            deadline,
            maxFee,
            mosaicId,
            restrictionKey,
            targetAddress,
            previousRestrictionValue,
            newRestrictionValue,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicNonce
     * @param mosaicId
     * @param mosaicProperties
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
                 * The restriction key.
                 */
                public readonly restrictionKey: UInt64,
                /**
                 * The affected unresolved address.
                 */
                public readonly targetAddress: Address,
                /**
                 * The previous restriction value.
                 */
                public readonly previousRestrictionValue: UInt64,
                /**
                 * The new restriction value.
                 */
                public readonly newRestrictionValue: UInt64,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_ADDRESS_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
        MosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = MosaicAddressRestrictionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as MosaicAddressRestrictionTransactionBuilder).getDeadline().timestamp),
            new MosaicId(builder.getMosaicId().unresolvedMosaicId),
            new UInt64(builder.getRestrictionKey()),
            Address.createFromEncoded(Convert.uint8ToHex(builder.getTargetAddress().unresolvedAddress)),
            new UInt64(builder.getPreviousRestrictionValue()),
            new UInt64(builder.getNewRestrictionValue()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicAddressRestrictionTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicDefinitionTransaction
     * @returns {number}
     * @memberof MosaicAddressRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteNonce = 4;
        const byteMosaicId = 8;
        const byteRestrictionKey = 8;
        const byteTargetAddress = 25;
        const bytePreviousRestrictionValue = 8;
        const byteNewRestrictionValue = 8;

        return byteSize + byteNonce + byteMosaicId + byteRestrictionKey +
               byteTargetAddress + bytePreviousRestrictionValue + byteNewRestrictionValue;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicAddressRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.targetAddress.plain())),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedMosaicAddressRestrictionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.targetAddress.plain())),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
        );
        return transactionBuilder.serialize();
    }
}
