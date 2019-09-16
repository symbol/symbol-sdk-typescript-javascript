/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SignSchema } from '../../core/crypto/SignSchema';
import { Convert, Convert as convert, RawAddress } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedSecretProofTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedSecretProofTransactionBuilder';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
import { Hash256Dto } from '../../infrastructure/catbuffer/Hash256Dto';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { SecretProofTransactionBuilder } from '../../infrastructure/catbuffer/SecretProofTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedAddressDto } from '../../infrastructure/catbuffer/UnresolvedAddressDto';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class SecretProofTransaction extends Transaction {

    /**
     * Create a secret proof transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The seed proof hashed.
     * @param recipientAddress - UnresolvedAddress
     * @param proof - The seed proof.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretProofTransaction instance
     */
    public static create(deadline: Deadline,
                         hashType: HashType,
                         secret: string,
                         recipientAddress: Address,
                         proof: string,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): SecretProofTransaction {
        return new SecretProofTransaction(
            networkType,
            TransactionVersion.SECRET_PROOF,
            deadline,
            maxFee,
            hashType,
            secret,
            recipientAddress,
            proof,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param hashType
     * @param secret
     * @param recipientAddress
     * @param proof
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly hashType: HashType,
                public readonly secret: string,
                public readonly recipientAddress: Address,
                public readonly proof: string,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_PROOF, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (!HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false,
                                    signSchema: SignSchema = SignSchema.SHA3): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedSecretProofTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            SecretProofTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = SecretProofTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as SecretProofTransactionBuilder).getDeadline().timestamp),
            builder.getHashAlgorithm().valueOf(),
            Convert.uint8ToHex(builder.getSecret().hash256),
            Address.createFromEncoded(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            Convert.uint8ToHex(builder.getProof()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as SecretProofTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType, signSchema)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretProofTransaction
     * @returns {number}
     * @memberof SecretProofTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // hash algorithm and proof size static byte size
        const byteAlgorithm = 1;
        const byteProofSize = 2;
        const byteRecipient = 25;

        // convert secret and proof to uint8
        const byteSecret = convert.hexToUint8(this.secret).length;
        const byteProof = convert.hexToUint8(this.proof).length;

        return byteSize + byteAlgorithm + byteSecret + byteRecipient + byteProofSize + byteProof;
    }

    /**
     * @description Get secret bytes
     * @returns {Uint8Array}
     * @memberof SecretLockTransaction
     */
    public getSecretByte(): Uint8Array {
        return convert.hexToUint8(64 > this.secret.length ? this.secret + '0'.repeat(64 - this.secret.length) : this.secret);
    }

    /**
     * @description Get proof bytes
     * @returns {Uint8Array}
     * @memberof SecretLockTransaction
     */
    public getProofByte(): Uint8Array {
        return convert.hexToUint8(this.proof);
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new SecretProofTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.SECRET_PROOF.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.hashType.valueOf(),
            new Hash256Dto(this.getSecretByte()),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipientAddress.plain())),
            this.getProofByte(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedSecretProofTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.SECRET_PROOF.valueOf(),
            this.hashType.valueOf(),
            new Hash256Dto(this.getSecretByte()),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipientAddress.plain())),
            this.getProofByte(),
        );
        return transactionBuilder.serialize();
    }
}
