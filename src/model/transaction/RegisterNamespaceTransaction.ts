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
import { Convert, Convert as convert } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { BlockDurationDto } from '../../infrastructure/catbuffer/BlockDurationDto';
import { EmbeddedNamespaceRegistrationTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedNamespaceRegistrationTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { NamespaceIdDto } from '../../infrastructure/catbuffer/NamespaceIdDto';
import { NamespaceRegistrationTransactionBuilder } from '../../infrastructure/catbuffer/NamespaceRegistrationTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import {NamespaceMosaicIdGenerator} from '../../infrastructure/transaction/NamespaceMosaicIdGenerator';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
import { NamespaceType } from '../namespace/NamespaceType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Accounts can rent a namespace for an amount of blocks and after a this renew the contract.
 * This is done via a RegisterNamespaceTransaction.
 */
export class RegisterNamespaceTransaction extends Transaction {

    /**
     * Create a root namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param duration - The duration of the namespace.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    public static createRootNamespace(deadline: Deadline,
                                      namespaceName: string,
                                      duration: UInt64,
                                      networkType: NetworkType,
                                      maxFee: UInt64 = new UInt64([0, 0])): RegisterNamespaceTransaction {
        return new RegisterNamespaceTransaction(networkType,
            TransactionVersion.REGISTER_NAMESPACE,
            deadline,
            maxFee,
            NamespaceType.RootNamespace,
            namespaceName,
            new NamespaceId(namespaceName),
            duration,
        );
    }

    /**
     * Create a sub namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param parentNamespace - The parent namespace name.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {RegisterNamespaceTransaction}
     */
    public static createSubNamespace(deadline: Deadline,
                                     namespaceName: string,
                                     parentNamespace: string | NamespaceId,
                                     networkType: NetworkType,
                                     maxFee: UInt64 = new UInt64([0, 0])): RegisterNamespaceTransaction {
        let parentId: NamespaceId;
        if (typeof parentNamespace === 'string') {
            parentId = new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceParentId(parentNamespace, namespaceName));
        } else {
            parentId = parentNamespace;
        }
        return new RegisterNamespaceTransaction(networkType,
            TransactionVersion.REGISTER_NAMESPACE,
            deadline,
            maxFee,
            NamespaceType.SubNamespace,
            namespaceName,
            typeof parentNamespace === 'string' ?
                new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceNamespaceId(parentNamespace, namespaceName)) :
                new NamespaceId(NamespaceMosaicIdGenerator.namespaceId(namespaceName)),
            undefined,
            parentId,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param namespaceType
     * @param namespaceName
     * @param namespaceId
     * @param duration
     * @param parentId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The namespace type could be namespace or sub namespace
                 */
                public readonly namespaceType: NamespaceType,
                /**
                 * The namespace name
                 */
                public readonly namespaceName: string,
                /**
                 * The id of the namespace derived from namespaceName.
                 * When creating a sub namespace the namespaceId is derived from namespaceName and parentName.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The number of blocks a namespace is active
                 */
                public readonly duration?: UInt64,
                /**
                 * The id of the parent sub namespace
                 */
                public readonly parentId?: NamespaceId,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.REGISTER_NAMESPACE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
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
        const builder = isEmbedded ? EmbeddedNamespaceRegistrationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            NamespaceRegistrationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const namespaceType = builder.getRegistrationType().valueOf();
        const signer = Convert.uint8ToHex(builder.getSigner().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = namespaceType === NamespaceType.RootNamespace ?
            RegisterNamespaceTransaction.createRootNamespace(
                isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                    (builder as NamespaceRegistrationTransactionBuilder).getDeadline().timestamp),
            Convert.decodeHex(Convert.uint8ToHex(builder.getName())),
            new UInt64(builder.getDuration()!.blockDuration),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceRegistrationTransactionBuilder).fee.amount),
        ) : RegisterNamespaceTransaction.createSubNamespace(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as NamespaceRegistrationTransactionBuilder).getDeadline().timestamp),
            Convert.decodeHex(Convert.uint8ToHex(builder.getName())),
            new NamespaceId(builder.getParentId()!.namespaceId),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceRegistrationTransactionBuilder).fee.amount),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signer, networkType, signSchema)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a RegisterNamespaceTransaction
     * @returns {number}
     * @memberof RegisterNamespaceTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteType = 1;
        const byteDurationParentId = 8;
        const byteNamespaceId = 8;
        const byteNameSize = 1;

        // convert name to uint8
        const byteName = convert.utf8ToHex(this.namespaceName).length / 2;

        return byteSize + byteType + byteDurationParentId + byteNamespaceId + byteNameSize + byteName;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);
        let transactionBuilder: NamespaceRegistrationTransactionBuilder;
        if (this.namespaceType === NamespaceType.RootNamespace) {
            transactionBuilder = new NamespaceRegistrationTransactionBuilder(
                new SignatureDto(signatureBuffer),
                new KeyDto(signerBuffer),
                this.versionToDTO(),
                TransactionType.REGISTER_NAMESPACE.valueOf(),
                new AmountDto(this.maxFee.toDTO()),
                new TimestampDto(this.deadline.toDTO()),
                new NamespaceIdDto(this.namespaceId.id.toDTO()),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
                new BlockDurationDto(this.duration!.toDTO()),
                undefined,
            );
        } else {
            transactionBuilder = new NamespaceRegistrationTransactionBuilder(
                new SignatureDto(signatureBuffer),
                new KeyDto(signerBuffer),
                this.versionToDTO(),
                TransactionType.REGISTER_NAMESPACE.valueOf(),
                new AmountDto(this.maxFee.toDTO()),
                new TimestampDto(this.deadline.toDTO()),
                new NamespaceIdDto(this.namespaceId.id.toDTO()),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
                undefined,
                new NamespaceIdDto(this.parentId!.id.toDTO()),
            );
        }
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        let transactionBuilder: EmbeddedNamespaceRegistrationTransactionBuilder;
        if (this.namespaceType === NamespaceType.RootNamespace) {
            transactionBuilder = new EmbeddedNamespaceRegistrationTransactionBuilder(
                new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
                this.versionToDTO(),
                TransactionType.REGISTER_NAMESPACE.valueOf(),
                new NamespaceIdDto(this.namespaceId.id.toDTO()),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
                new BlockDurationDto(this.duration!.toDTO()),
                undefined,
            );
        } else {
            transactionBuilder = new EmbeddedNamespaceRegistrationTransactionBuilder(
                new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
                this.versionToDTO(),
                TransactionType.REGISTER_NAMESPACE.valueOf(),
                new NamespaceIdDto(this.namespaceId.id.toDTO()),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
                undefined,
                new NamespaceIdDto(this.parentId!.id.toDTO()),
            );
        }
        return transactionBuilder.serialize();
    }
}
