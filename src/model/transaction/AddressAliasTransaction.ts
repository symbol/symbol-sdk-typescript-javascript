/*
 * Copyright 2019 NEM
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

import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Convert, RawAddress } from '../../core/format';
import { AddressAliasTransactionBuilder } from '../../infrastructure/catbuffer/AddressAliasTransactionBuilder';
import { AddressDto } from '../../infrastructure/catbuffer/AddressDto';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedAddressAliasTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedAddressAliasTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { NamespaceIdDto } from '../../infrastructure/catbuffer/NamespaceIdDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { ReceiptHttp } from '../../infrastructure/ReceiptHttp';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { AliasAction } from '../namespace/AliasAction';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
export class AddressAliasTransaction extends Transaction {

    /**
     * Create a address alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param aliasAction - The alias action type.
     * @param namespaceId - The namespace id.
     * @param address - The address.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AddressAliasTransaction}
     */
    public static create(deadline: Deadline,
                         aliasAction: AliasAction,
                         namespaceId: NamespaceId,
                         address: Address,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): AddressAliasTransaction {
        return new AddressAliasTransaction(networkType,
            TransactionVersion.ADDRESS_ALIAS,
            deadline,
            maxFee,
            aliasAction,
            namespaceId,
            address,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param aliasAction
     * @param namespaceId
     * @param address
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The alias action type.
                 */
                public readonly aliasAction: AliasAction,
                /**
                 * The namespace id that will be an alias.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The address.
                 */
                public readonly address: Address,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ADDRESS_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedAddressAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            AddressAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = AddressAliasTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO((builder as AddressAliasTransactionBuilder).getDeadline().timestamp),
            builder.getAliasAction().valueOf(),
            new NamespaceId(builder.getNamespaceId().namespaceId),
            Address.createFromEncoded(
                Convert.uint8ToHex(builder.getAddress().address)),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as AddressAliasTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AddressAliasTransaction
     * @returns {number}
     * @memberof AddressAliasTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteActionType = 1;
        const byteNamespaceId = 8;
        const byteAddress = 25;

        return byteSize + byteActionType + byteNamespaceId + byteAddress;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new AddressAliasTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ADDRESS_ALIAS.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new NamespaceIdDto(this.namespaceId.id.toDTO()),
            new AddressDto(RawAddress.stringToAddress(this.address.plain())),
            this.aliasAction.valueOf(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedAddressAliasTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ADDRESS_ALIAS.valueOf(),
            new NamespaceIdDto(this.namespaceId.id.toDTO()),
            new AddressDto(RawAddress.stringToAddress(this.address.plain())),
            this.aliasAction.valueOf(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @param receiptHttp ReceiptHttp
     * @returns {TransferTransaction}
     */
    resolveAliases(receiptHttp: ReceiptHttp): Observable<AddressAliasTransaction> {
        return of(this);
    }
}
