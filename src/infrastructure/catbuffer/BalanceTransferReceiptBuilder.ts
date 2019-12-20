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

import { AddressDto } from './AddressDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MosaicBuilder } from './MosaicBuilder';
import { ReceiptBuilder } from './ReceiptBuilder';
import { ReceiptTypeDto } from './ReceiptTypeDto';

/** Binary layout for a balance transfer receipt. */
export class BalanceTransferReceiptBuilder extends ReceiptBuilder {
    /** Mosaic. */
    mosaic: MosaicBuilder;
    /** Mosaic sender public key. */
    senderPublicKey: KeyDto;
    /** Mosaic recipient address. */
    recipientAddress: AddressDto;

    /**
     * Constructor.
     *
     * @param version Receipt version.
     * @param type Receipt type.
     * @param mosaic Mosaic.
     * @param senderPublicKey Mosaic sender public key.
     * @param recipientAddress Mosaic recipient address.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(version: number,  type: ReceiptTypeDto,  mosaic: MosaicBuilder,  senderPublicKey: KeyDto,  recipientAddress: AddressDto) {
        super(version, type);
        this.mosaic = mosaic;
        this.senderPublicKey = senderPublicKey;
        this.recipientAddress = recipientAddress;
    }

    /**
     * Creates an instance of BalanceTransferReceiptBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of BalanceTransferReceiptBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): BalanceTransferReceiptBuilder {
        const byteArray = Array.from(payload);
        const superObject = ReceiptBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const mosaic = MosaicBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaic.getSize());
        const senderPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, senderPublicKey.getSize());
        const recipientAddress = AddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, recipientAddress.getSize());
        // tslint:disable-next-line: max-line-length
        return new BalanceTransferReceiptBuilder(superObject.version, superObject.type, mosaic, senderPublicKey, recipientAddress);
    }

    /**
     * Gets mosaic.
     *
     * @return Mosaic.
     */
    public getMosaic(): MosaicBuilder {
        return this.mosaic;
    }

    /**
     * Gets mosaic sender public key.
     *
     * @return Mosaic sender public key.
     */
    public getSenderPublicKey(): KeyDto {
        return this.senderPublicKey;
    }

    /**
     * Gets mosaic recipient address.
     *
     * @return Mosaic recipient address.
     */
    public getRecipientAddress(): AddressDto {
        return this.recipientAddress;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaic.getSize();
        size += this.senderPublicKey.getSize();
        size += this.recipientAddress.getSize();
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
        const mosaicBytes = this.mosaic.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicBytes);
        const senderPublicKeyBytes = this.senderPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, senderPublicKeyBytes);
        const recipientAddressBytes = this.recipientAddress.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, recipientAddressBytes);
        return newArray;
    }
}
