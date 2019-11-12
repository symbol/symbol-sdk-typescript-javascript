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
import { UnresolvedAddressDto } from './UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from './UnresolvedMosaicBuilder';

/** Binary layout for a transfer transaction. */
export class TransferTransactionBodyBuilder {
    /** Recipient address. */
    recipientAddress: UnresolvedAddressDto;
    /** Reserved padding to align mosaics on 8-byte boundary. */
    transferTransactionBody_Reserved1: number;
    /** Attached mosaics. */
    mosaics: UnresolvedMosaicBuilder[];
    /** Attached message. */
    message: Uint8Array;

    /**
     * Constructor.
     *
     * @param recipientAddress Recipient address.
     * @param mosaics Attached mosaics.
     * @param message Attached message.
     */
    public constructor(recipientAddress: UnresolvedAddressDto,  mosaics: UnresolvedMosaicBuilder[],  message: Uint8Array) {
        this.recipientAddress = recipientAddress;
        this.transferTransactionBody_Reserved1 = 0;
        this.mosaics = mosaics;
        this.message = message;
    }

    /**
     * Creates an instance of TransferTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of TransferTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): TransferTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const recipientAddress = UnresolvedAddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, recipientAddress.getSize());
        const mosaicsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const messageSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        // tslint:disable-next-line: max-line-length
        const transferTransactionBody_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const mosaics: UnresolvedMosaicBuilder[] = [];
        for (let i = 0; i < mosaicsCount; i++) {
            const item = UnresolvedMosaicBuilder.loadFromBinary(Uint8Array.from(byteArray));
            mosaics.push(item);
            byteArray.splice(0, item.getSize());
        }
        const message = GeneratorUtils.getBytes(Uint8Array.from(byteArray), messageSize);
        byteArray.splice(0, messageSize);
        return new TransferTransactionBodyBuilder(recipientAddress, mosaics, message);
    }

    /**
     * Gets recipient address.
     *
     * @return Recipient address.
     */
    public getRecipientAddress(): UnresolvedAddressDto {
        return this.recipientAddress;
    }

    /**
     * Gets reserved padding to align mosaics on 8-byte boundary.
     *
     * @return Reserved padding to align mosaics on 8-byte boundary.
     */
    public getTransferTransactionBody_Reserved1(): number {
        return this.transferTransactionBody_Reserved1;
    }

    /**
     * Gets attached mosaics.
     *
     * @return Attached mosaics.
     */
    public getMosaics(): UnresolvedMosaicBuilder[] {
        return this.mosaics;
    }

    /**
     * Gets attached message.
     *
     * @return Attached message.
     */
    public getMessage(): Uint8Array {
        return this.message;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.recipientAddress.getSize();
        size += 1; // mosaicsCount
        size += 2; // messageSize
        size += 4; // transferTransactionBody_Reserved1
        this.mosaics.forEach((o) => size += o.getSize());
        size += this.message.length;
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const recipientAddressBytes = this.recipientAddress.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, recipientAddressBytes);
        const mosaicsCountBytes = GeneratorUtils.uintToBuffer(this.mosaics.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicsCountBytes);
        const messageSizeBytes = GeneratorUtils.uintToBuffer(this.message.length, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, messageSizeBytes);
        // tslint:disable-next-line: max-line-length
        const transferTransactionBody_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getTransferTransactionBody_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, transferTransactionBody_Reserved1Bytes);
        this.mosaics.forEach((item) => {
            const mosaicsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicsBytes);
        });
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.message);
        return newArray;
    }
}
