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
import { NetworkRepository } from '../infrastructure/NetworkRepository';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { Address } from '../model/account/Address';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../model/account/MultisigAccountInfo';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { InnerTransaction } from '../model/transaction/InnerTransaction';
import { MultisigAccountModificationTransaction } from '../model/transaction/MultisigAccountModificationTransaction';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { TransactionType } from '../model/transaction/TransactionType';

/**
 * Aggregated Transaction service
 */
export class AggregateTransactionService {
    private readonly multisigRepository: MultisigRepository;
    private readonly networkRepository: NetworkRepository;
    /**
     * Constructor
     * @param repositoryFactory
     */
    constructor(repositoryFactory: RepositoryFactory) {
        this.multisigRepository = repositoryFactory.createMultisigRepository();
        this.networkRepository = repositoryFactory.createNetworkRepository();
    }

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
        const signers = aggregateTransaction.cosignatures.map((cosigner) => cosigner.signer.address);
        if (signedTransaction.signerPublicKey) {
            signers.push(Address.createFromPublicKey(signedTransaction.signerPublicKey, aggregateTransaction.networkType));
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
                                      .getMultisigAccountGraphInfo(_.accountAddress)
                                      .pipe(map((graphInfo) => this.validateCosignatories(graphInfo, signers, innerTransaction)))
                                : observableOf(signers.find((s) => s.equals(_.accountAddress)) !== undefined),
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
     * Get total multisig account cosigner count
     * @param address multisig account address
     * @returns {Observable<number>}
     */
    public getMaxCosignatures(address: Address): Observable<number> {
        return this.multisigRepository.getMultisigAccountGraphInfo(address).pipe(
            map((graph) => {
                const cosignatures = ([] as MultisigAccountInfo[])
                    .concat(...Array.from(graph.multisigEntries.values()))
                    .map((info) => info.cosignatoryAddresses.map((cosig) => cosig));
                return new Set(([] as Address[]).concat(...cosignatures)).size;
            }),
        );
    }

    /**
     * Get max cosignatures allowed per aggregate from network properties
     * @returns {Observable<number>}
     */
    public getNetworkMaxCosignaturesPerAggregate(): Observable<number> {
        return this.networkRepository.getNetworkProperties().pipe(
            map((properties) => {
                if (!properties.plugins.aggregate?.maxCosignaturesPerAggregate) {
                    throw new Error('Cannot get maxCosignaturesPerAggregate from network properties.');
                }
                return parseInt(properties.plugins.aggregate?.maxCosignaturesPerAggregate.replace(`'`, ''));
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
        cosignatories: Address[],
        innerTransaction: InnerTransaction,
    ): boolean {
        /**
         *  Validate cosignatories from bottom level to top
         */
        const sortedKeys = Array.from(graphInfo.multisigEntries.keys()).sort((a, b) => b - a);
        const cosignatoriesReceived = cosignatories.map((cosig) => cosig.plain());
        let validationResult = false;

        let isMultisigRemoval = false;

        /**
         * Check inner transaction. If remove cosigner from multisig account,
         * use minRemoval instead of minApproval for cosignatories validation.
         */
        if (innerTransaction.type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION) {
            if ((innerTransaction as MultisigAccountModificationTransaction).addressDeletions.length) {
                isMultisigRemoval = true;
            }
        }

        sortedKeys.forEach((key) => {
            const multisigInfo = graphInfo.multisigEntries.get(key);
            if (multisigInfo && !validationResult) {
                multisigInfo.forEach((multisig) => {
                    if (multisig.minApproval >= 1 && multisig.minRemoval) {
                        // To make sure it is multisig account
                        const matchedCosignatories = this.compareArrays(
                            cosignatoriesReceived,
                            multisig.cosignatoryAddresses.map((cosig) => cosig.plain()),
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
                            if (cosignatoriesReceived.indexOf(multisig.accountAddress.plain()) === -1) {
                                cosignatoriesReceived.push(multisig.accountAddress.plain());
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
