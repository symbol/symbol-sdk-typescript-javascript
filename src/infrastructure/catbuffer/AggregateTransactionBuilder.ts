// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/

import { AmountDto } from './AmountDto';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';

/** binary layout for an aggregate transaction. */
export class AggregateTransactionBuilder extends TransactionBuilder {
    /** embedded transactions. */
    transactions: Uint8Array;
    /** cosignatures. */
    cosignatures: Uint8Array;

    /**
     * Constructor.
     *
     * @param signature entity signature.
     * @param signer entity signer's public key.
     * @param version entity version.
     * @param type entity type.
     * @param fee transaction fee.
     * @param deadline transaction deadline.
     * @param transactions embedded transactions.
     * @param cosignatures cosignatures.
     */
    public constructor(
        signature: SignatureDto,
        signer: KeyDto,
        version: number,
        type: EntityTypeDto,
        fee: AmountDto,
        deadline: TimestampDto,
        transactions: Uint8Array,
        cosignatures: Uint8Array) {
            super(signature, signer, version, type, fee, deadline);
            this.transactions = transactions;
            this.cosignatures = cosignatures;
    }

    /**
     * loadFromBinary - Create an instance of AggregateTransactionBuilder from a stream.
     *
     * @param Uint8Array Byte to use to serialize the object.
     * @return An instance of AggregateTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AggregateTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const payloadSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const transactions = GeneratorUtils.getBytes(Uint8Array.from(byteArray), payloadSize);
        byteArray.splice(0, transactions.length);
        const cosignatures = Uint8Array.from(byteArray);
        // tslint:disable-next-line: max-line-length
        return new AggregateTransactionBuilder(superObject.signature, superObject.signer, superObject.version,
                                               superObject.type, superObject.fee, superObject.deadline,
                                               transactions, cosignatures);
    }

    /**
     * Get embedded transactions.
     *
     * @return embedded transactions.
     */
    public getTransactions(): Uint8Array {
        return this.transactions;
    }

    /**
     * Get cosignatures.
     *
     * @return cosignatures.
     */
    public getCosignatures(): Uint8Array {
        return this.cosignatures;
    }

    /**
     * Get the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += 4; // payloadSize
        size += this.transactions.length;
        size += this.cosignatures.length;
        return size;
    }

    /**
     * Serialize the object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const superBytes = super.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, superBytes);
        const payloadSizeBytes = GeneratorUtils.uintToBuffer(this.transactions.length, 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, payloadSizeBytes);
        const transactionBytes = this.transactions;
        newArray = GeneratorUtils.concatTypedArrays(newArray, transactionBytes);
        const cosignaturesBytes = this.cosignatures;
        newArray = GeneratorUtils.concatTypedArrays(newArray, cosignaturesBytes);
        return newArray;
    }
}
