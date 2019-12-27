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

import {
    AmountDto,
    EmbeddedSecretProofTransactionBuilder,
    EmbeddedTransactionBuilder,
    Hash256Dto,
    KeyDto,
    SecretProofTransactionBuilder,
    SignatureDto,
    TimestampDto,
    UnresolvedAddressDto
} from 'catbuffer';
import { Convert, Convert as convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
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
                         recipientAddress: Address | NamespaceId,
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
                public readonly recipientAddress: Address | NamespaceId,
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
     * Creates a transaction from catbuffer body builders.
     * @internal
     * @param builder the body builder
     * @param networkType the preloaded network type
     * @param deadline the preloaded deadline
     * @param maxFee the preloaded max fee
     * @returns {Transaction}
     */
    public static createFromBodyBuilder(builder: SecretProofTransactionBuilder | EmbeddedSecretProofTransactionBuilder,
                                        networkType: NetworkType,
                                        deadline: Deadline,
                                        maxFee: UInt64): Transaction {
        return SecretProofTransaction.create(
            deadline,
            builder.getHashAlgorithm().valueOf(),
            Convert.uint8ToHex(builder.getSecret().hash256),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            Convert.uint8ToHex(builder.getProof()),
            networkType,
            maxFee
        );
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
            this.networkType.valueOf(),
            TransactionType.SECRET_PROOF.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new Hash256Dto(this.getSecretByte()),
            this.hashType.valueOf(),
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.networkType)),
            this.getProofByte(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedSecretProofTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.SECRET_PROOF.valueOf(),
            new Hash256Dto(this.getSecretByte()),
            this.hashType.valueOf(),
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.networkType)),
            this.getProofByte(),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {SecretProofTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex: number = 0): SecretProofTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            recipientAddress: statement.resolveAddress(this.recipientAddress,
                transactionInfo.height.toString(), transactionInfo.index, aggregateTransactionIndex)});
    }
}
