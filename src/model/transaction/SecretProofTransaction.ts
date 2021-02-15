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
    SecretProofTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
} from 'catbuffer-typescript';
import { Convert, Convert as convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { LockHashAlgorithm, LockHashAlgorithmLengthValidator } from '../lock/LockHashAlgorithm';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
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
     * @param hashAlgorithm - The hash algorithm secret is generated with.
     * @param secret - The seed proof hashed.
     * @param recipientAddress - UnresolvedAddress
     * @param proof - The seed proof.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @return a SecretProofTransaction instance
     */
    public static create(
        deadline: Deadline,
        hashAlgorithm: LockHashAlgorithm,
        secret: string,
        recipientAddress: UnresolvedAddress,
        proof: string,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): SecretProofTransaction {
        return new SecretProofTransaction(
            networkType,
            TransactionVersion.SECRET_PROOF,
            deadline,
            maxFee,
            hashAlgorithm,
            secret,
            recipientAddress,
            proof,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param hashAlgorithm
     * @param secret
     * @param recipientAddress
     * @param proof
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly hashAlgorithm: LockHashAlgorithm,
        public readonly secret: string,
        public readonly recipientAddress: UnresolvedAddress,
        public readonly proof: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.SECRET_PROOF, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (!LockHashAlgorithmLengthValidator(hashAlgorithm, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedSecretProofTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : SecretProofTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = SecretProofTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as SecretProofTransactionBuilder).getDeadline().timestamp),
            builder.getHashAlgorithm().valueOf(),
            Convert.uint8ToHex(builder.getSecret().hash256),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            Convert.uint8ToHex(builder.getProof()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as SecretProofTransactionBuilder).fee.amount),
            signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
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
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        const transactionBuilder = new SecretProofTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.SECRET_PROOF.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.recipientAddress.encodeUnresolvedAddress(this.networkType)),
            new Hash256Dto(this.getSecretByte()),
            this.hashAlgorithm.valueOf(),
            this.getProofByte(),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedSecretProofTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.SECRET_PROOF.valueOf(),
            new UnresolvedAddressDto(this.recipientAddress.encodeUnresolvedAddress(this.networkType)),
            new Hash256Dto(this.getSecretByte()),
            this.hashAlgorithm.valueOf(),
            this.getProofByte(),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {SecretProofTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): SecretProofTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            recipientAddress: statement.resolveAddress(
                this.recipientAddress,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
        });
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: UnresolvedAddress): boolean {
        return super.isSigned(address) || this.recipientAddress.equals(address);
    }
}
