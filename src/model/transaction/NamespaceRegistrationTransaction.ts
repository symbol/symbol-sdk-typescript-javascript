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
    BlockDurationDto,
    EmbeddedNamespaceRegistrationTransactionBuilder,
    EmbeddedTransactionBuilder,
    NamespaceRegistrationTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import * as Utilities from '../../core/format/Utilities';
import { NamespaceMosaicIdGenerator } from '../../infrastructure/transaction';
import { Address, PublicAccount } from '../account';
import { NamespaceId, NamespaceRegistrationType } from '../namespace';
import { NetworkType } from '../network';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Accounts can rent a namespace for an amount of blocks and after a this renew the contract.
 * This is done via a NamespaceRegistrationTransaction.
 */
export class NamespaceRegistrationTransaction extends Transaction {
    /**
     * Create a root namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param duration - The duration of the namespace.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {NamespaceRegistrationTransaction}
     */
    public static createRootNamespace(
        deadline: Deadline,
        namespaceName: string,
        duration: UInt64,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): NamespaceRegistrationTransaction {
        return new NamespaceRegistrationTransaction(
            networkType,
            TransactionVersion.NAMESPACE_REGISTRATION,
            deadline,
            maxFee,
            NamespaceRegistrationType.RootNamespace,
            namespaceName,
            new NamespaceId(namespaceName),
            duration,
            undefined,
            signature,
            signer,
        );
    }

    /**
     * Create a sub namespace object
     * @param deadline - The deadline to include the transaction.
     * @param namespaceName - The namespace name.
     * @param parentNamespace - The parent namespace name.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - Transaction signature
     * @param signer - Signer public account
     * @returns {NamespaceRegistrationTransaction}
     */
    public static createSubNamespace(
        deadline: Deadline,
        namespaceName: string,
        parentNamespace: string | NamespaceId,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): NamespaceRegistrationTransaction {
        let parentId: NamespaceId;
        if (typeof parentNamespace === 'string') {
            parentId = new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceParentId(parentNamespace, namespaceName));
        } else {
            parentId = parentNamespace;
        }
        const namespaceId =
            typeof parentNamespace === 'string'
                ? new NamespaceId(NamespaceMosaicIdGenerator.subnamespaceNamespaceId(parentNamespace, namespaceName))
                : new NamespaceId(Utilities.generateNamespaceId(parentId.id.toDTO(), namespaceName));
        return new NamespaceRegistrationTransaction(
            networkType,
            TransactionVersion.NAMESPACE_REGISTRATION,
            deadline,
            maxFee,
            NamespaceRegistrationType.SubNamespace,
            namespaceName,
            namespaceId,
            undefined,
            parentId,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param registrationType
     * @param namespaceName
     * @param namespaceId
     * @param duration
     * @param parentId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        /**
         * The namespace type could be namespace or sub namespace
         */
        public readonly registrationType: NamespaceRegistrationType,
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
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.NAMESPACE_REGISTRATION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedNamespaceRegistrationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : NamespaceRegistrationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const registrationType = builder.getRegistrationType().valueOf();
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction =
            registrationType === NamespaceRegistrationType.RootNamespace
                ? NamespaceRegistrationTransaction.createRootNamespace(
                      isEmbedded
                          ? Deadline.createEmtpy()
                          : Deadline.createFromDTO((builder as NamespaceRegistrationTransactionBuilder).getDeadline().timestamp),
                      Convert.decodeHex(Convert.uint8ToHex(builder.getName())),
                      new UInt64(builder.getDuration()!.blockDuration),
                      networkType,
                      isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceRegistrationTransactionBuilder).fee.amount),
                      signature,
                      signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
                  )
                : NamespaceRegistrationTransaction.createSubNamespace(
                      isEmbedded
                          ? Deadline.createEmtpy()
                          : Deadline.createFromDTO((builder as NamespaceRegistrationTransactionBuilder).getDeadline().timestamp),
                      Convert.decodeHex(Convert.uint8ToHex(builder.getName())),
                      new NamespaceId(builder.getParentId()!.namespaceId),
                      networkType,
                      isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceRegistrationTransactionBuilder).fee.amount),
                      signature,
                      signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
                  );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @internal
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        let transactionBuilder: NamespaceRegistrationTransactionBuilder;
        if (this.registrationType === NamespaceRegistrationType.RootNamespace) {
            transactionBuilder = NamespaceRegistrationTransactionBuilder.createNamespaceRegistrationTransactionBuilderRoot(
                this.getSignatureAsBuilder(),
                this.getSignerAsBuilder(),
                this.versionToDTO(),
                this.networkType.valueOf(),
                TransactionType.NAMESPACE_REGISTRATION.valueOf(),
                new AmountDto(this.maxFee.toDTO()),
                new TimestampDto(this.deadline.toDTO()),
                new BlockDurationDto(this.duration!.toDTO()),
                this.namespaceId.toBuilder(),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
            );
        } else {
            transactionBuilder = NamespaceRegistrationTransactionBuilder.createNamespaceRegistrationTransactionBuilderChild(
                this.getSignatureAsBuilder(),
                this.getSignerAsBuilder(),
                this.versionToDTO(),
                this.networkType.valueOf(),
                TransactionType.NAMESPACE_REGISTRATION.valueOf(),
                new AmountDto(this.maxFee.toDTO()),
                new TimestampDto(this.deadline.toDTO()),
                this.parentId!.toBuilder(),
                this.namespaceId.toBuilder(),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
            );
        }
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        if (this.registrationType === NamespaceRegistrationType.RootNamespace) {
            return EmbeddedNamespaceRegistrationTransactionBuilder.createEmbeddedNamespaceRegistrationTransactionBuilderRoot(
                this.getSignerAsBuilder(),
                this.versionToDTO(),
                this.networkType.valueOf(),
                TransactionType.NAMESPACE_REGISTRATION.valueOf(),
                new BlockDurationDto(this.duration!.toDTO()),
                this.namespaceId.toBuilder(),
                Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
            );
        }
        return EmbeddedNamespaceRegistrationTransactionBuilder.createEmbeddedNamespaceRegistrationTransactionBuilderChild(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NAMESPACE_REGISTRATION.valueOf(),
            this.parentId!.toBuilder(),
            this.namespaceId.toBuilder(),
            Convert.hexToUint8(Convert.utf8ToHex(this.namespaceName)),
        );
    }

    /**
     * @internal
     * @returns {NamespaceRegistrationTransaction}
     */
    resolveAliases(): NamespaceRegistrationTransaction {
        return this;
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: Address): boolean {
        return super.isSigned(address);
    }
}
