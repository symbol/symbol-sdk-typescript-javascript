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

import {Observable} from 'rxjs';
import { mergeMap, toArray} from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';
import { Listener } from '../infrastructure/Listener';
import { ReceiptHttp } from '../infrastructure/ReceiptHttp';
import { TransactionHttp } from '../infrastructure/TransactionHttp';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { ResolutionType } from '../model/receipt/ResolutionType';
import { Statement } from '../model/receipt/Statement';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { ITransactionService } from './interfaces/ITransactionService';

/**
 * Transaction Service
 */
export class TransactionService implements ITransactionService {

    private readonly transactionHttp: TransactionHttp;
    private readonly receiptHttp: ReceiptHttp;
    private readonly listener: Listener;
    /**
     * Constructor
     * @param url Base catapult-rest url
     */
    constructor(url: string) {
        this.transactionHttp = new TransactionHttp(url);
        this.receiptHttp = new ReceiptHttp(url);
        this.listener = new Listener(url);
    }

    /**
     * @internal
     * Extract resolved address | mosaic from block receipt
     * @param resolutionType Resolution type: Address / Mosaic
     * @param unresolved Unresolved address / mosaicId
     * @param statement Block receipt statement
     * @param transactionIndex Transaction index
     * @param height Transaction height
     * @param aggregateTransactionIndex Transaction index for aggregate
     * @returns {MosaicId | Address}
     */
    public static getResolvedFromReceipt(resolutionType: ResolutionType,
                                         unresolved: NamespaceId,
                                         statement: Statement,
                                         transactionIndex: number,
                                         height: string,
                                         aggregateTransactionIndex?: number): MosaicId | Address {

        const resolutionStatement = (resolutionType === ResolutionType.Address ? statement.addressResolutionStatements :
            statement.mosaicResolutionStatements).find((resolution) => resolution.height.toString() === height &&
                (resolution.unresolved as NamespaceId).equals(unresolved));

        if (!resolutionStatement) {
            throw new Error(`No resolution statement found for unsolved value: ${unresolved.toHex()}`);
        }
        // source (0,0) is reserved for blocks, source (n, 0) is for txes, where n is 1-based index
        const resolutionEntry = resolutionStatement.resolutionEntries
            .find((entry) => entry.source.primaryId ===
                (aggregateTransactionIndex !== undefined ? aggregateTransactionIndex + 1 : transactionIndex + 1) &&
                entry.source.secondaryId === (aggregateTransactionIndex !== undefined ? transactionIndex + 1 : 0));

        if (!resolutionEntry) {
            throw new Error(`No resolution entry found for unsolved value: ${unresolved.toHex()}`);
        }

        return resolutionEntry.resolved;
    }

    /**
     * @param transationHashes List of transaction hashes.
     * @returns Observable<Transaction[]>
     */
    public resolveAliases(transationHashes: string[]): Observable<Transaction[]> {
        return this.transactionHttp.getTransactions(transationHashes).pipe(
                mergeMap((_) => _),
                mergeMap((transaction) => transaction.resolveAliases(this.receiptHttp)),
                toArray(),
            );
    }

    /**
     * @param signedTransaction Signed transaction to be announced.
     * @returns {Observable<Transaction>}
     */
    public announce(signedTransaction: SignedTransaction): Observable<Transaction> {
        return this.transactionHttp.announce(signedTransaction).pipe(
            flatMap(() => this.listener.confirmed(signedTransaction.getSignerAddress(), signedTransaction.hash)),
        );
    }

    /**
     * Announce aggregate transaction
     * @param signedTransaction Signed aggregate bonded transaction.
     * @returns {Observable<AggregateTransaction>}
     */
    public announceAggregateBonded(signedTransaction: SignedTransaction): Observable<AggregateTransaction> {
        return this.transactionHttp.announceAggregateBonded(signedTransaction).pipe(
            flatMap(() => this.listener.aggregateBondedAdded(signedTransaction.getSignerAddress(), signedTransaction.hash)),
        );
    }

    /**
     * Announce aggregate bonded transaction with lock fund
     * @param signedHashLockTransaction Signed hash lock transaction.
     * @param signedAggregateTransaction Signed aggregate bonded transaction.
     * @returns {Observable<AggregateTransaction>}
     */
    public announceHashLockAggregateBonded(signedHashLockTransaction: SignedTransaction,
                                           signedAggregateTransaction: SignedTransaction): Observable<AggregateTransaction> {
        return this.announce(signedHashLockTransaction).pipe(
            flatMap(() => this.announceAggregateBonded(signedAggregateTransaction)),
        );

    }
}
