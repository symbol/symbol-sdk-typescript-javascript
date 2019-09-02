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
    /** Attached message. */
    message: Uint8Array;
    /** Attached mosaics. */
    mosaics: UnresolvedMosaicBuilder[];

    /**
     * Constructor.
     *
     * @param recipientAddress Recipient address.
     * @param message Attached message.
     * @param mosaics Attached mosaics.
     */
    public constructor(recipientAddress: UnresolvedAddressDto,  message: Uint8Array,  mosaics: UnresolvedMosaicBuilder[]) {
        this.recipientAddress = recipientAddress;
        this.message = message;
        this.mosaics = mosaics;
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
        const messageSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const mosaicsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const message = GeneratorUtils.getBytes(Uint8Array.from(byteArray), messageSize);
        byteArray.splice(0, messageSize);
        const mosaics: UnresolvedMosaicBuilder[] = [];
        for (let i = 0; i < mosaicsCount; i++) {
            const item = UnresolvedMosaicBuilder.loadFromBinary(Uint8Array.from(byteArray));
            mosaics.push(item);
            byteArray.splice(0, item.getSize());
        }
        return new TransferTransactionBodyBuilder(recipientAddress, message, mosaics);
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
     * Gets attached message.
     *
     * @return Attached message.
     */
    public getMessage(): Uint8Array {
        return this.message;
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
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.recipientAddress.getSize();
        size += 2; // messageSize
        size += 1; // mosaicsCount
        size += this.message.length;
        this.mosaics.forEach((o) => size += o.getSize());
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
        const messageSizeBytes = GeneratorUtils.uintToBuffer(this.message.length, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, messageSizeBytes);
        const mosaicsCountBytes = GeneratorUtils.uintToBuffer(this.mosaics.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicsCountBytes);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.message);
        this.mosaics.forEach((item) => {
            const mosaicsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicsBytes);
        });
        return newArray;
    }
}
