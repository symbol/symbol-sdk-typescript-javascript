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

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Convert } from '../core/format/Convert';
import { MetadataRepository } from '../infrastructure/MetadataRepository';
import { Page } from '../infrastructure/Page';
import { Address } from '../model/account/Address';
import { Metadata } from '../model/metadata/Metadata';
import { MetadataType } from '../model/metadata/MetadataType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NetworkType } from '../model/network/NetworkType';
import { AccountMetadataTransaction } from '../model/transaction/AccountMetadataTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { MosaicMetadataTransaction } from '../model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../model/transaction/NamespaceMetadataTransaction';
import { UInt64 } from '../model/UInt64';

/**
 * MetadataTransaction service
 */
export class MetadataTransactionService {
    /**
     * Constructor
     * @param metadataRepository
     */
    constructor(private readonly metadataRepository: MetadataRepository) {}

    /**
     * Create an Account Metadata Transaction object without knowing previous metadata value
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetAddress - Target address
     * @param key - Metadata key
     * @param value - New metadata value
     * @param sourceAddress - sender (signer) address
     * @param maxFee - max fee
     * @returns {Observable<AccountMetadataTransaction>}
     */
    public createAccountMetadataTransaction(
        deadline: Deadline,
        networkType: NetworkType,
        targetAddress: Address,
        key: UInt64,
        value: string,
        sourceAddress: Address,
        maxFee: UInt64,
    ): Observable<AccountMetadataTransaction> {
        return this.metadataRepository
            .search({ targetAddress, scopedMetadataKey: key.toHex(), sourceAddress: sourceAddress, metadataType: MetadataType.Account })
            .pipe(
                map((metadatas: Page<Metadata>) => {
                    if (metadatas.data.length > 0) {
                        const metadata = metadatas.data[0];
                        const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                        const newValueBytes = Convert.utf8ToUint8(value);
                        return AccountMetadataTransaction.create(
                            deadline,
                            targetAddress,
                            key,
                            newValueBytes.length - currentValueByte.length,
                            Convert.decodeHex(Convert.xor(currentValueByte, newValueBytes)),
                            networkType,
                            maxFee,
                        );
                    }
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return AccountMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        key,
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    );
                }),
                catchError((err: Error) => {
                    throw Error(err.message);
                }),
            );
    }

    /**
     * Create a Mosaic Metadata Transaction object without knowing previous metadata value
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetAddress - Target Address
     * @param mosaicId - Mosaic Id
     * @param key - Metadata key
     * @param value - New metadata value
     * @param sourceAddress - sender (signer) address
     * @param maxFee - max fee
     * @returns {Observable<MosaicMetadataTransaction>}
     */
    public createMosaicMetadataTransaction(
        deadline: Deadline,
        networkType: NetworkType,
        targetAddress: Address,
        mosaicId: MosaicId,
        key: UInt64,
        value: string,
        sourceAddress: Address,
        maxFee: UInt64,
    ): Observable<MosaicMetadataTransaction> {
        return this.metadataRepository
            .search({ targetId: mosaicId, scopedMetadataKey: key.toHex(), sourceAddress: sourceAddress, metadataType: MetadataType.Mosaic })
            .pipe(
                map((metadatas: Page<Metadata>) => {
                    if (metadatas.data.length > 0) {
                        const metadata = metadatas.data[0];
                        const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                        const newValueBytes = Convert.utf8ToUint8(value);
                        return MosaicMetadataTransaction.create(
                            deadline,
                            targetAddress,
                            key,
                            mosaicId,
                            newValueBytes.length - currentValueByte.length,
                            Convert.decodeHex(Convert.xor(currentValueByte, newValueBytes)),
                            networkType,
                            maxFee,
                        );
                    }
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return MosaicMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        key,
                        mosaicId,
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    );
                }),
                catchError((err: Error) => {
                    throw Error(err.message);
                }),
            );
    }

    /**
     * Create a Namespace Metadata Transaction object without knowing previous metadata value
     * @param deadline - Deadline
     * @param networkType - Network identifier
     * @param targetAddress - Target address
     * @param namespaceId - Namespace Id
     * @param key - Metadata key
     * @param value - New metadata value
     * @param sourceAddress - sender (signer) address
     * @param maxFee - max fee
     * @returns {Observable<NamespaceMetadataTransaction>}
     */
    public createNamespaceMetadataTransaction(
        deadline: Deadline,
        networkType: NetworkType,
        targetAddress: Address,
        namespaceId: NamespaceId,
        key: UInt64,
        value: string,
        sourceAddress: Address,
        maxFee: UInt64,
    ): Observable<NamespaceMetadataTransaction> {
        return this.metadataRepository
            .search({
                targetId: namespaceId,
                scopedMetadataKey: key.toHex(),
                sourceAddress: sourceAddress,
                metadataType: MetadataType.Namespace,
            })
            .pipe(
                map((metadatas: Page<Metadata>) => {
                    if (metadatas.data.length > 0) {
                        const metadata = metadatas.data[0];
                        const currentValueByte = Convert.utf8ToUint8(metadata.metadataEntry.value);
                        const newValueBytes = Convert.utf8ToUint8(value);
                        return NamespaceMetadataTransaction.create(
                            deadline,
                            targetAddress,
                            key,
                            namespaceId,
                            newValueBytes.length - currentValueByte.length,
                            Convert.decodeHex(Convert.xor(currentValueByte, newValueBytes)),
                            networkType,
                            maxFee,
                        );
                    }
                    const newValueBytes = Convert.utf8ToUint8(value);
                    return NamespaceMetadataTransaction.create(
                        deadline,
                        targetAddress,
                        key,
                        namespaceId,
                        newValueBytes.length,
                        value,
                        networkType,
                        maxFee,
                    );
                }),
                catchError((err: Error) => {
                    throw Error(err.message);
                }),
            );
    }
}
