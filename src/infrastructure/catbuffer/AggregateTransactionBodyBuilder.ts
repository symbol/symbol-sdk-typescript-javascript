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

import { GeneratorUtils } from './GeneratorUtils';

/** Binary layout for an aggregate transaction. */
export class AggregateTransactionBodyBuilder {
    /** Sub-transaction data (transactions are variable sized and payload size is in bytes). */
    transactions: Uint8Array;
    /** Cosignatures data (fills remaining body space after transactions). */
    cosignatures: Uint8Array;

    /**
     * Constructor.
     *
     * @param transactions Sub-transaction data (transactions are variable sized and payload size is in bytes).
     * @param cosignatures Cosignatures data (fills remaining body space after transactions).
     */
    public constructor(transactions: Uint8Array,  cosignatures: Uint8Array) {
        this.transactions = transactions;
        this.cosignatures = cosignatures;
    }

    /**
     * Creates an instance of AggregateTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AggregateTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AggregateTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const payloadSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const transactions = GeneratorUtils.getBytes(Uint8Array.from(byteArray), payloadSize);
        byteArray.splice(0, payloadSize);
        const cosignatures = Uint8Array.from(byteArray);
        return new AggregateTransactionBodyBuilder(transactions, cosignatures);
    }

    /**
     * Gets sub-transaction data (transactions are variable sized and payload size is in bytes).
     *
     * @return Sub-transaction data (transactions are variable sized and payload size is in bytes).
     */
    public getTransactions(): Uint8Array {
        return this.transactions;
    }

    /**
     * Gets cosignatures data (fills remaining body space after transactions).
     *
     * @return Cosignatures data (fills remaining body space after transactions).
     */
    public getCosignatures(): Uint8Array {
        return this.cosignatures;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 4; // payloadSize
        size += this.transactions.length;
        size += this.cosignatures.length;
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const payloadSizeBytes = GeneratorUtils.uintToBuffer(this.transactions.length, 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, payloadSizeBytes);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.transactions);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.cosignatures);
        return newArray;
    }
}
