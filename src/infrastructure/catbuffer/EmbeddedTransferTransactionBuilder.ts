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

import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { TransferTransactionBodyBuilder } from './TransferTransactionBodyBuilder';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from './UnresolvedMosaicBuilder';

/** Binary layout for an embedded transfer transaction. */
export class EmbeddedTransferTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Transfer transaction body. */
    transferTransactionBody: TransferTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param recipientAddress Recipient address.
     * @param message Attached message.
     * @param mosaics Attached mosaics.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  type: EntityTypeDto,  recipientAddress: UnresolvedAddressDto,  message: Uint8Array,  mosaics: UnresolvedMosaicBuilder[]) {
        super(signerPublicKey, version, type);
        this.transferTransactionBody = new TransferTransactionBodyBuilder(recipientAddress, message, mosaics);
    }

    /**
     * Creates an instance of EmbeddedTransferTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedTransferTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedTransferTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const transferTransactionBody = TransferTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, transferTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedTransferTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.type, transferTransactionBody.recipientAddress, transferTransactionBody.message, transferTransactionBody.mosaics);
    }

    /**
     * Gets recipient address.
     *
     * @return Recipient address.
     */
    public getRecipientAddress(): UnresolvedAddressDto {
        return this.transferTransactionBody.getRecipientAddress();
    }

    /**
     * Gets attached message.
     *
     * @return Attached message.
     */
    public getMessage(): Uint8Array {
        return this.transferTransactionBody.getMessage();
    }

    /**
     * Gets attached mosaics.
     *
     * @return Attached mosaics.
     */
    public getMosaics(): UnresolvedMosaicBuilder[] {
        return this.transferTransactionBody.getMosaics();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.transferTransactionBody.getSize();
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
        const transferTransactionBodyBytes = this.transferTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, transferTransactionBodyBytes);
        return newArray;
    }
}
