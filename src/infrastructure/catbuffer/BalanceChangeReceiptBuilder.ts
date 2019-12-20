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
import { KeyDto } from './KeyDto';
import { MosaicBuilder } from './MosaicBuilder';
import { ReceiptBuilder } from './ReceiptBuilder';
import { ReceiptTypeDto } from './ReceiptTypeDto';

/** Binary layout for a balance change receipt. */
export class BalanceChangeReceiptBuilder extends ReceiptBuilder {
    /** Mosaic. */
    mosaic: MosaicBuilder;
    /** Account public key. */
    targetPublicKey: KeyDto;

    /**
     * Constructor.
     *
     * @param version Receipt version.
     * @param type Receipt type.
     * @param mosaic Mosaic.
     * @param targetPublicKey Account public key.
     */
    public constructor(version: number,  type: ReceiptTypeDto,  mosaic: MosaicBuilder,  targetPublicKey: KeyDto) {
        super(version, type);
        this.mosaic = mosaic;
        this.targetPublicKey = targetPublicKey;
    }

    /**
     * Creates an instance of BalanceChangeReceiptBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of BalanceChangeReceiptBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): BalanceChangeReceiptBuilder {
        const byteArray = Array.from(payload);
        const superObject = ReceiptBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const mosaic = MosaicBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaic.getSize());
        const targetPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, targetPublicKey.getSize());
        return new BalanceChangeReceiptBuilder(superObject.version, superObject.type, mosaic, targetPublicKey);
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
     * Gets account public key.
     *
     * @return Account public key.
     */
    public getTargetPublicKey(): KeyDto {
        return this.targetPublicKey;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaic.getSize();
        size += this.targetPublicKey.getSize();
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
        const targetPublicKeyBytes = this.targetPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, targetPublicKeyBytes);
        return newArray;
    }
}
