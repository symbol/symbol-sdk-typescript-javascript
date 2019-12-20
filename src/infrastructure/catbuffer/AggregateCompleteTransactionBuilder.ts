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

import { AggregateTransactionBodyBuilder } from './AggregateTransactionBodyBuilder';
import { AmountDto } from './AmountDto';
import { CosignatureBuilder } from './CosignatureBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { Hash256Dto } from './Hash256Dto';
import { KeyDto } from './KeyDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';

/** Binary layout for an aggregate complete transaction. */
export class AggregateCompleteTransactionBuilder extends TransactionBuilder {
    /** Aggregate transaction body. */
    aggregateTransactionBody: AggregateTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     * @param transactionsHash Aggregate hash of an aggregate's transactions.
     * @param transactions Sub-transaction data (transactions are variable sized and payload size is in bytes).
     * @param cosignatures Cosignatures data (fills remaining body space after transactions).
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  transactionsHash: Hash256Dto,  transactions: EmbeddedTransactionBuilder[],  cosignatures: CosignatureBuilder[]) {
        super(signature, signerPublicKey, version, network, type, fee, deadline);
        this.aggregateTransactionBody = new AggregateTransactionBodyBuilder(transactionsHash, transactions, cosignatures);
    }

    /**
     * Creates an instance of AggregateCompleteTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AggregateCompleteTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AggregateCompleteTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const aggregateTransactionBody = AggregateTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, aggregateTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new AggregateCompleteTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, superObject.fee, superObject.deadline, aggregateTransactionBody.transactionsHash, aggregateTransactionBody.transactions, aggregateTransactionBody.cosignatures);
    }

    /**
     * Gets aggregate hash of an aggregate's transactions.
     *
     * @return Aggregate hash of an aggregate's transactions.
     */
    public getTransactionsHash(): Hash256Dto {
        return this.aggregateTransactionBody.getTransactionsHash();
    }

    /**
     * Gets reserved padding to align end of AggregateTransactionHeader on 8-byte boundary.
     *
     * @return Reserved padding to align end of AggregateTransactionHeader on 8-byte boundary.
     */
    public getAggregateTransactionHeader_Reserved1(): number {
        return this.aggregateTransactionBody.getAggregateTransactionHeader_Reserved1();
    }

    /**
     * Gets sub-transaction data (transactions are variable sized and payload size is in bytes).
     *
     * @return Sub-transaction data (transactions are variable sized and payload size is in bytes).
     */
    public getTransactions(): EmbeddedTransactionBuilder[] {
        return this.aggregateTransactionBody.getTransactions();
    }

    /**
     * Gets cosignatures data (fills remaining body space after transactions).
     *
     * @return Cosignatures data (fills remaining body space after transactions).
     */
    public getCosignatures(): CosignatureBuilder[] {
        return this.aggregateTransactionBody.getCosignatures();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.aggregateTransactionBody.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const superBytes = super.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, superBytes);
        const aggregateTransactionBodyBytes = this.aggregateTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, aggregateTransactionBodyBytes);
        return newArray;
    }
}
