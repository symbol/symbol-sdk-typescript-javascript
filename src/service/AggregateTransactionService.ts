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

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { flatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { TransactionMapping } from '../core/utils/TransactionMapping';
import { MultisigRepository } from '../infrastructure/MultisigRepository';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { InnerTransaction } from '../model/transaction/InnerTransaction';
import { MultisigAccountModificationTransaction } from '../model/transaction/MultisigAccountModificationTransaction';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { TransactionType } from '../model/transaction/TransactionType';

/**
 * Aggregated Transaction service
 */
export class AggregateTransactionService {
    /**
     * Constructor
     * @param multisigRepository
     */
    constructor(private readonly multisigRepository: MultisigRepository) {}

    /**
     * Check if an aggregate complete transaction has all cosignatories attached
     * @param signedTransaction - The signed aggregate transaction (complete) to be verified
     * @returns {Observable<boolean>}
     */
    public isComplete(signedTransaction: SignedTransaction): Observable<boolean> {
        const aggregateTransaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;
        /**
         * Include both initiator & cosigners
         */
        const signers = aggregateTransaction.cosignatures.map((cosigner) => cosigner.signer.publicKey);
        if (signedTransaction.signerPublicKey) {
            signers.push(signedTransaction.signerPublicKey);
        }
        return observableFrom(aggregateTransaction.innerTransactions)
            .pipe(
                mergeMap((innerTransaction) =>
                    this.multisigRepository.getMultisigAccountInfo(innerTransaction.signer!.address).pipe(
                        /**
                         * For multisig account, we need to get the graph info in case it has multiple levels
                         */
                        mergeMap((_) =>
                            _.minApproval !== 0 && _.minRemoval !== 0
                                ? this.multisigRepository
                                      .getMultisigAccountGraphInfo(_.account.address)
                                      .pipe(map((graphInfo) => this.validateCosignatories(graphInfo, signers, innerTransaction)))
                                : observableOf(signers.find((s) => s === _.account.publicKey) !== undefined),
                        ),
                    ),
                ),
                toArray(),
            )
            .pipe(
                flatMap((results) => {
                    return observableOf(results.every((isComplete) => isComplete));
                }),
            );
    }

    /**
     * Validate cosignatories against multisig Account(s)
     * @param graphInfo - multisig account graph info
     * @param cosignatories - array of cosignatories extracted from aggregated transaction
     * @param innerTransaction - the inner transaction of the aggregated transaction
     * @returns {boolean}
     */
    private validateCosignatories(
        graphInfo: MultisigAccountGraphInfo,
        cosignatories: string[],
        innerTransaction: InnerTransaction,
    ): boolean {
        /**
         *  Validate cosignatories from bottom level to top
         */
        const sortedKeys = Array.from(graphInfo.multisigAccounts.keys()).sort((a, b) => b - a);
        const cosignatoriesReceived = cosignatories;
        let validationResult = false;

        let isMultisigRemoval = false;

        /**
         * Check inner transaction. If remove cosigner from multisig account,
         * use minRemoval instead of minApproval for cosignatories validation.
         */
        if (innerTransaction.type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION) {
            if ((innerTransaction as MultisigAccountModificationTransaction).publicKeyDeletions.length) {
                isMultisigRemoval = true;
            }
        }

        sortedKeys.forEach((key) => {
            const multisigInfo = graphInfo.multisigAccounts.get(key);
            if (multisigInfo && !validationResult) {
                multisigInfo.forEach((multisig) => {
                    if (multisig.minApproval >= 1 && multisig.minRemoval) {
                        // To make sure it is multisig account
                        const matchedCosignatories = this.compareArrays(
                            cosignatoriesReceived,
                            multisig.cosignatories.map((cosig) => cosig.publicKey),
                        );

                        /**
                         * if minimal signature requirement met at current level, push the multisig account
                         * into the received signatories array for next level validation.
                         * Otherwise return validation failed.
                         */
                        if (
                            (matchedCosignatories.length >= multisig.minApproval && !isMultisigRemoval) ||
                            (matchedCosignatories.length >= multisig.minRemoval && isMultisigRemoval)
                        ) {
                            if (cosignatoriesReceived.indexOf(multisig.account.publicKey) === -1) {
                                cosignatoriesReceived.push(multisig.account.publicKey);
                            }
                            validationResult = true;
                        } else {
                            validationResult = false;
                        }
                    }
                });
            }
        });

        return validationResult;
    }

    /**
     * Compare two string arrays
     * @param array1 - base array
     * @param array2 - array to be matched
     * @returns {string[]} - array of matched elements
     */
    private compareArrays(array1: string[], array2: string[]): string[] {
        const results: string[] = [];
        array1.forEach((a1) =>
            array2.forEach((a2) => {
                if (a1 === a2) {
                    results.push(a1);
                }
            }),
        );

        return results;
    }
}
