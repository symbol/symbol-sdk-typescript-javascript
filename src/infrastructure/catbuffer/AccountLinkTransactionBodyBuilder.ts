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

import { AccountLinkActionDto } from './AccountLinkActionDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for an account link transaction. */
export class AccountLinkTransactionBodyBuilder {
    /** Remote public key. */
    remotePublicKey: KeyDto;
    /** Account link action. */
    linkAction: AccountLinkActionDto;

    /**
     * Constructor.
     *
     * @param remotePublicKey Remote public key.
     * @param linkAction Account link action.
     */
    public constructor(remotePublicKey: KeyDto,  linkAction: AccountLinkActionDto) {
        this.remotePublicKey = remotePublicKey;
        this.linkAction = linkAction;
    }

    /**
     * Creates an instance of AccountLinkTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountLinkTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountLinkTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const remotePublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, remotePublicKey.getSize());
        const linkAction = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        return new AccountLinkTransactionBodyBuilder(remotePublicKey, linkAction);
    }

    /**
     * Gets remote public key.
     *
     * @return Remote public key.
     */
    public getRemotePublicKey(): KeyDto {
        return this.remotePublicKey;
    }

    /**
     * Gets account link action.
     *
     * @return Account link action.
     */
    public getLinkAction(): AccountLinkActionDto {
        return this.linkAction;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.remotePublicKey.getSize();
        size += 1; // linkAction
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const remotePublicKeyBytes = this.remotePublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, remotePublicKeyBytes);
        const linkActionBytes = GeneratorUtils.uintToBuffer(this.linkAction, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, linkActionBytes);
        return newArray;
    }
}
