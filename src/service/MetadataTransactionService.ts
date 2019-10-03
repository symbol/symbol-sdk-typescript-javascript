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

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Convert } from '../core/format/Convert';
import { MetadataHttp } from '../infrastructure/MetadataHttp';
import { Address } from '../model/account/Address';
import { NetworkType } from '../model/blockchain/NetworkType';
import { Metadata } from '../model/metadata/Metadata';
import { MetadataType } from '../model/metadata/MetadataType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { AccountMetadataTransaction } from '../model/transaction/AccountMetadataTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { MosaicMetadataTransaction } from '../model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../model/transaction/NamespaceMetadataTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import { PublicAccount } from '../model/account/PublicAccount';

/**
 * MetadataTransaction service
 */
export class MetadataTransactionService {

    /**
     * Constructor
     * @param metadataHttp
     */
    constructor(private readonly metadataHttp: MetadataHttp) {
    }

    /**
     * Create a Metadata Transaction object without knowing previous metadata value
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param metadataType - Matadata type
     * @param targetPublicAccount - Target public account
     * @param key - Metadata scoped key
     * @param value - New metadata value
     * @param senderPublicAccount - sender (signer) public account
     * @param targetId - Target Id (MosaicId | NamespaceId)
     * @param maxFee - Max fee
     */
    public createMetadataTransaction(deadline: Deadline,
                                     networkType: NetworkType,
                                     metadataType: MetadataType,
                                     targetPublicAccount: PublicAccount,
                                     key: string,
                                     value: string,
                                     senderPublicAccount: PublicAccount,
                                     targetId?: MosaicId | NamespaceId,
                                     maxFee: UInt64 = new UInt64([0, 0])): Observable<Transaction> {
        switch (metadataType) {
            case MetadataType.Account:
                return this.createAccountMetadataTransaction(
                    deadline,
                    networkType,
                    targetPublicAccount.publicKey,
                    key,
                    value,
                    senderPublicAccount.publicKey,
                    maxFee,
                );
            case MetadataType.Mosaic:
                if (!targetId || !(targetId instanceof MosaicId)) {
                    throw Error ('TargetId for MosaicMetadataTransaction is invalid');
                }
                return this.createMosaicMetadataTransaction(
                    deadline,
                    networkType,
                    targetPublicAccount.publicKey,
                    targetId as MosaicId,
                    key,
                    value,
                    senderPublicAccount.publicKey,
                    maxFee,
                );
            case MetadataType.Namespace:
                if (!targetId || !(targetId instanceof NamespaceId)) {
                    throw Error ('TargetId for NamespaceMetadataTransaction is invalid');
                }
                return this.createNamespaceMetadataTransaction(
                    deadline,
                    networkType,
                    targetPublicAccount.publicKey,
                    targetId as NamespaceId,
                    key,
                    value,
                    senderPublicAccount.publicKey,
                    maxFee,
                );
            default:
                throw Error('Metadata type invalid');
        }
    }

    /**
     * @internal
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetPublicKey - Target public key
     * @param key - Metadata key
     * @param value - New metadata value
     * @param senderPublicKey - sender (signer) public key
     * @param maxFee - max fee
     * @returns {Observable<AccountMetadataTransaction>}
     */
    private createAccountMetadataTransaction(deadline: Deadline,
                                             networkType: NetworkType,
                                             targetPublicKey: string,
                                             key: string,
                                             value: string,
                                             senderPublicKey: string,
                                             maxFee: UInt64): Observable<AccountMetadataTransaction> {
        return this.metadataHttp.getAccountMetadataByKeyAndSender(Address.createFromPublicKey(targetPublicKey, networkType),
                                                                  key, senderPublicKey)
            .pipe(map((metadata: Metadata) => {
                const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                const newValueBytes = Convert.utf8ToUint8(value);
                return AccountMetadataTransaction.create(
                    deadline,
                    targetPublicKey,
                    UInt64.fromHex(key),
                    newValueBytes.length - currentValueByte.length,
                    value,
                    networkType,
                    maxFee,
                );
            }),
            catchError((err) => {
                if (err.response.statusCode === 404) {
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return of(AccountMetadataTransaction.create(
                        deadline,
                        targetPublicKey,
                        UInt64.fromHex(key),
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    ));
                }
                throw Error(err);
              }));
    }

    /**
     * @internal
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetPublicKey - Target public key
     * @param mosaicId - Mosaic Id
     * @param key - Metadata key
     * @param value - New metadata value
     * @param senderPublicKey - sender (signer) public key
     * @param maxFee - max fee
     * @returns {Observable<MosaicMetadataTransaction>}
     */
    private createMosaicMetadataTransaction(deadline: Deadline,
                                            networkType: NetworkType,
                                            targetPublicKey: string,
                                            mosaicId: MosaicId,
                                            key: string,
                                            value: string,
                                            senderPublicKey: string,
                                            maxFee: UInt64): Observable<MosaicMetadataTransaction> {
        return this.metadataHttp.getMosaicMetadataByKeyAndSender(mosaicId,
                                                                  key, senderPublicKey)
            .pipe(map((metadata: Metadata) => {
                const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                const newValueBytes = Convert.utf8ToUint8(value);
                return MosaicMetadataTransaction.create(
                    deadline,
                    targetPublicKey,
                    UInt64.fromHex(key),
                    mosaicId,
                    newValueBytes.length - currentValueByte.length,
                    value,
                    networkType,
                    maxFee,
                );
            }),
            catchError((err) => {
                if (err.response.statusCode === 404) {
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return of(MosaicMetadataTransaction.create(
                        deadline,
                        targetPublicKey,
                        UInt64.fromHex(key),
                        mosaicId,
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    ));
                }
                throw Error(err);
              }));
    }

    /**
     * @internal
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetPublicKey - Target public key
     * @param namespaceId - Namespace Id
     * @param key - Metadata key
     * @param value - New metadata value
     * @param senderPublicKey - sender (signer) public key
     * @param maxFee - max fee
     * @returns {Observable<NamespaceMetadataTransaction>}
     */
    private createNamespaceMetadataTransaction(deadline: Deadline,
                                               networkType: NetworkType,
                                               targetPublicKey: string,
                                               namespaceId: NamespaceId,
                                               key: string,
                                               value: string,
                                               senderPublicKey: string,
                                               maxFee: UInt64): Observable<NamespaceMetadataTransaction> {
        return this.metadataHttp.getNamespaceMetadataByKeyAndSender(namespaceId,
                                                                  key, senderPublicKey)
            .pipe(map((metadata: Metadata) => {
                const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                const newValueBytes = Convert.utf8ToUint8(value);
                return NamespaceMetadataTransaction.create(
                    deadline,
                    targetPublicKey,
                    UInt64.fromHex(key),
                    namespaceId,
                    newValueBytes.length - currentValueByte.length,
                    value,
                    networkType,
                    maxFee,
                );
            }),
            catchError((err) => {
                if (err.response.statusCode === 404) {
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return of(NamespaceMetadataTransaction.create(
                        deadline,
                        targetPublicKey,
                        UInt64.fromHex(key),
                        namespaceId,
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    ));
                }
                throw Error(err);
              }));
    }
}
