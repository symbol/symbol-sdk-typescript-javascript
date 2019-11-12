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
import { AccountLinkTransactionBodyBuilder } from './AccountLinkTransactionBodyBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { NetworkTypeDto } from './NetworkTypeDto';

/** Binary layout for an embedded account link transaction. */
export class EmbeddedAccountLinkTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Account link transaction body. */
    accountLinkTransactionBody: AccountLinkTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param remotePublicKey Remote public key.
     * @param linkAction Account link action.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  remotePublicKey: KeyDto,  linkAction: AccountLinkActionDto) {
        super(signerPublicKey, version, network, type);
        this.accountLinkTransactionBody = new AccountLinkTransactionBodyBuilder(remotePublicKey, linkAction);
    }

    /**
     * Creates an instance of EmbeddedAccountLinkTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedAccountLinkTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedAccountLinkTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const accountLinkTransactionBody = AccountLinkTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountLinkTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedAccountLinkTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, accountLinkTransactionBody.remotePublicKey, accountLinkTransactionBody.linkAction);
    }

    /**
     * Gets remote public key.
     *
     * @return Remote public key.
     */
    public getRemotePublicKey(): KeyDto {
        return this.accountLinkTransactionBody.getRemotePublicKey();
    }

    /**
     * Gets account link action.
     *
     * @return Account link action.
     */
    public getLinkAction(): AccountLinkActionDto {
        return this.accountLinkTransactionBody.getLinkAction();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.accountLinkTransactionBody.getSize();
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
        const accountLinkTransactionBodyBytes = this.accountLinkTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountLinkTransactionBodyBytes);
        return newArray;
    }
}
