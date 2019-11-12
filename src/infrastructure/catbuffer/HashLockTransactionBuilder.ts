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

import { AmountDto } from './AmountDto';
import { BlockDurationDto } from './BlockDurationDto';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { Hash256Dto } from './Hash256Dto';
import { HashLockTransactionBodyBuilder } from './HashLockTransactionBodyBuilder';
import { KeyDto } from './KeyDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';
import { UnresolvedMosaicBuilder } from './UnresolvedMosaicBuilder';

/** Binary layout for a non-embedded hash lock transaction. */
export class HashLockTransactionBuilder extends TransactionBuilder {
    /** Hash lock transaction body. */
    hashLockTransactionBody: HashLockTransactionBodyBuilder;

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
     * @param mosaic Lock mosaic.
     * @param duration Number of blocks for which a lock should be valid.
     * @param hash Lock hash.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  mosaic: UnresolvedMosaicBuilder,  duration: BlockDurationDto,  hash: Hash256Dto) {
        super(signature, signerPublicKey, version, network, type, fee, deadline);
        this.hashLockTransactionBody = new HashLockTransactionBodyBuilder(mosaic, duration, hash);
    }

    /**
     * Creates an instance of HashLockTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of HashLockTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): HashLockTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const hashLockTransactionBody = HashLockTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, hashLockTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new HashLockTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, superObject.fee, superObject.deadline, hashLockTransactionBody.mosaic, hashLockTransactionBody.duration, hashLockTransactionBody.hash);
    }

    /**
     * Gets lock mosaic.
     *
     * @return Lock mosaic.
     */
    public getMosaic(): UnresolvedMosaicBuilder {
        return this.hashLockTransactionBody.getMosaic();
    }

    /**
     * Gets number of blocks for which a lock should be valid.
     *
     * @return Number of blocks for which a lock should be valid.
     */
    public getDuration(): BlockDurationDto {
        return this.hashLockTransactionBody.getDuration();
    }

    /**
     * Gets lock hash.
     *
     * @return Lock hash.
     */
    public getHash(): Hash256Dto {
        return this.hashLockTransactionBody.getHash();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.hashLockTransactionBody.getSize();
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
        const hashLockTransactionBodyBytes = this.hashLockTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, hashLockTransactionBodyBytes);
        return newArray;
    }
}
