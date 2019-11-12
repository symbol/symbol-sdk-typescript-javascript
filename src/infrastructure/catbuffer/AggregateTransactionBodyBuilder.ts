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
import { Hash256Dto } from './Hash256Dto';

/** Binary layout for an aggregate transaction. */
export class AggregateTransactionBodyBuilder {
    /** Aggregate hash of an aggregate's transactions. */
    transactionsHash: Hash256Dto;
    /** Reserved padding to align end of AggregateTransactionHeader on 8-byte boundary. */
    aggregateTransactionHeader_Reserved1: number;
    /** Sub-transaction data (transactions are variable sized and payload size is in bytes). */
    transactions: Uint8Array;
    /** Cosignatures data (fills remaining body space after transactions). */
    cosignatures: Uint8Array;

    /**
     * Constructor.
     *
     * @param transactionsHash Aggregate hash of an aggregate's transactions.
     * @param transactions Sub-transaction data (transactions are variable sized and payload size is in bytes).
     * @param cosignatures Cosignatures data (fills remaining body space after transactions).
     */
    public constructor(transactionsHash: Hash256Dto,  transactions: Uint8Array,  cosignatures: Uint8Array) {
        this.transactionsHash = transactionsHash;
        this.aggregateTransactionHeader_Reserved1 = 0;
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
        const transactionsHash = Hash256Dto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, transactionsHash.getSize());
        const payloadSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        // tslint:disable-next-line: max-line-length
        const aggregateTransactionHeader_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const transactions = GeneratorUtils.getBytes(Uint8Array.from(byteArray), payloadSize);
        byteArray.splice(0, payloadSize);
        const cosignatures = Uint8Array.from(byteArray);
        return new AggregateTransactionBodyBuilder(transactionsHash, transactions, cosignatures);
    }

    /**
     * Gets aggregate hash of an aggregate's transactions.
     *
     * @return Aggregate hash of an aggregate's transactions.
     */
    public getTransactionsHash(): Hash256Dto {
        return this.transactionsHash;
    }

    /**
     * Gets reserved padding to align end of AggregateTransactionHeader on 8-byte boundary.
     *
     * @return Reserved padding to align end of AggregateTransactionHeader on 8-byte boundary.
     */
    public getAggregateTransactionHeader_Reserved1(): number {
        return this.aggregateTransactionHeader_Reserved1;
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
        size += this.transactionsHash.getSize();
        size += 4; // payloadSize
        size += 4; // aggregateTransactionHeader_Reserved1
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
        const transactionsHashBytes = this.transactionsHash.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, transactionsHashBytes);
        const payloadSizeBytes = GeneratorUtils.uintToBuffer(this.transactions.length, 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, payloadSizeBytes);
        // tslint:disable-next-line: max-line-length
        const aggregateTransactionHeader_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getAggregateTransactionHeader_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, aggregateTransactionHeader_Reserved1Bytes);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.transactions);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.cosignatures);
        return newArray;
    }
}
