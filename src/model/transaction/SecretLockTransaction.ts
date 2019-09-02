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
import { BlockDurationDto } from '../../infrastructure/catbuffer/BlockDurationDto';
import { EmbeddedSecretLockTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedSecretLockTransactionBuilder';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
import { Hash256Dto } from '../../infrastructure/catbuffer/Hash256Dto';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { SecretLockTransactionBuilder } from '../../infrastructure/catbuffer/SecretLockTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedAddressDto } from '../../infrastructure/catbuffer/UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from '../../infrastructure/catbuffer/UnresolvedMosaicBuilder';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class SecretLockTransaction extends Transaction {

    /**
     * Create a secret lock transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The proof hashed.
     * @param recipient - The recipient of the funds.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     *
     * @return a SecretLockTransaction instance
     */
    public static create(deadline: Deadline,
                         mosaic: Mosaic,
                         duration: UInt64,
                         hashType: HashType,
                         secret: string,
                         recipient: Address,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): SecretLockTransaction {
        return new SecretLockTransaction(
            networkType,
            TransactionVersion.SECRET_LOCK,
            deadline,
            maxFee,
            mosaic,
            duration,
            hashType,
            secret,
            recipient,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaic
     * @param duration
     * @param hashType
     * @param secret
     * @param recipient
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The locked mosaic.
                 */
                public readonly mosaic: Mosaic,
                /**
                 * The duration for the funds to be released or returned.
                 */
                public readonly duration: UInt64,
                /**
                 * The hash algorithm, secret is generated with.
                 */
                public readonly hashType: HashType,
                /**
                 * The proof hashed.
                 */
                public readonly secret: string,
                /**
                 * The recipient of the funds.
                 */
                public readonly recipient: Address,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_LOCK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
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
        const builder = isEmbedded ? EmbeddedSecretLockTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            SecretLockTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signer = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = SecretLockTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as SecretLockTransactionBuilder).getDeadline().timestamp),
            new Mosaic(
                new MosaicId(builder.getMosaic().mosaicId.unresolvedMosaicId),
                new UInt64(builder.getMosaic().amount.amount),
            ),
            new UInt64(builder.getDuration().blockDuration),
            builder.getHashAlgorithm().valueOf(),
            Convert.uint8ToHex(builder.getSecret().hash256),
            Address.createFromEncoded(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as SecretLockTransactionBuilder).fee.amount),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signer, networkType, signSchema)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a SecretLockTransaction
     * @returns {number}
     * @memberof SecretLockTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteMosaicId = 8;
        const byteAmount = 8;
        const byteDuration = 8;
        const byteAlgorithm = 1;
        const byteRecipient = 25;

        // convert secret to uint8
        const byteSecret = convert.hexToUint8(this.secret).length;

        return byteSize + byteMosaicId + byteAmount + byteDuration + byteAlgorithm + byteRecipient + byteSecret;
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
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new SecretLockTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.SECRET_LOCK.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(this.mosaic.id.id.toDTO()),
                                                   new AmountDto(this.mosaic.amount.toDTO())),
            new BlockDurationDto(this.duration.toDTO()),
            this.hashType.valueOf(),
            new Hash256Dto(this.getSecretByte()),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipient.plain())),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedSecretLockTransactionBuilder(
            new KeyDto(convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.SECRET_LOCK.valueOf(),
            new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(this.mosaic.id.id.toDTO()),
                                                   new AmountDto(this.mosaic.amount.toDTO())),
            new BlockDurationDto(this.duration.toDTO()),
            this.hashType.valueOf(),
            new Hash256Dto(this.getSecretByte()),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipient.plain())),
        );
        return transactionBuilder.serialize();
    }
}
