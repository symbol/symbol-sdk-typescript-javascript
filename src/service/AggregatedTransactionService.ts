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

import {from as observableFrom , Observable, of as observableOf} from 'rxjs';
import { map, mergeMap} from 'rxjs/operators';
import { TransactionMapping } from '../core/utils/TransactionMapping';
import { AccountHttp } from '../infrastructure/AccountHttp';
import { MultisigAccountGraphInfo } from '../model/account/MultisigAccountGraphInfo';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { InnerTransaction } from '../model/transaction/InnerTransaction';
import { ModifyMultisigAccountTransaction } from '../model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModificationType } from '../model/transaction/MultisigCosignatoryModificationType';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { TransactionType } from '../model/transaction/TransactionType';

/**
 * Aggregated Transaction service
 */
export class AggregatedTransactionService {

    /**
     * Constructor
     * @param accountHttp
     */
    constructor(private readonly accountHttp: AccountHttp) {
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
        const signers = (aggregateTransaction.cosignatures.map((cosigner) => cosigner.signer.publicKey));
        if (signedTransaction.signer) {
            signers.push(signedTransaction.signer);
        }

        return observableFrom(aggregateTransaction.innerTransactions).pipe(
            mergeMap((innerTransaction) => this.accountHttp.getMultisigAccountInfo(innerTransaction.signer.address)
                .pipe(
                    /**
                     * For multisig account, we need to get the graph info in case it has multiple levels
                     */
                    mergeMap((_) => _.minApproval !== 0 && _.minRemoval !== 0 ?
                        this.accountHttp.getMultisigAccountGraphInfo(_.account.address)
                        .pipe(
                            map((graphInfo) => this.validateCosignatories(graphInfo, signers, innerTransaction)),
                        ) : observableOf(true),
                        ),
                    ),
                ),
            );
    }

    /**
     * Validate cosignatories against multisig Account(s)
     * @param graphInfo - multisig account graph info
     * @param cosignatories - array of cosignatories extracted from aggregated transaction
     * @param innerTransaction - the inner transaction of the aggregated transaction
     * @returns {boolean}
     */
    private validateCosignatories(graphInfo: MultisigAccountGraphInfo,
                                  cosignatories: string[],
                                  innerTransaction: InnerTransaction): boolean {
        /**
         *  Validate cosignatories from bottom level to top
         */
        const sortedKeys = Array.from(graphInfo.multisigAccounts.keys()).sort((a, b) => b - a);
        const cosignatoriesReceived = cosignatories;
        let validationResult = true;

        let isMultisigRemoval = false;

        /**
         * Check inner transaction. If remove cosigner from multisig account,
         * use minRemoval instead of minApproval for cosignatories validation.
         */
        if (innerTransaction.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            if ((innerTransaction as ModifyMultisigAccountTransaction).modifications
                    .find((modification) => modification.type === MultisigCosignatoryModificationType.Remove) !== undefined) {
                        isMultisigRemoval = true;
            }
        }

        sortedKeys.forEach((key) => {
            const multisigInfo = graphInfo.multisigAccounts.get(key);
            if (multisigInfo && validationResult) {
                multisigInfo.forEach((multisig) => {
                    if (multisig.minApproval >= 1 && multisig.minRemoval) { // To make sure it is multisig account
                        const matchedCosignatories = this.compareArrays(cosignatoriesReceived,
                                        multisig.cosignatories.map((cosig) => cosig.publicKey));

                        /**
                         * if minimal signature requirement met at current level, push the multisig account
                         * into the received signatories array for next level validation.
                         * Otherwise return validation failed.
                         */
                        if ((matchedCosignatories.length >= multisig.minApproval && !isMultisigRemoval) ||
                            (matchedCosignatories.length >= multisig.minRemoval && isMultisigRemoval)) {
                            if (cosignatoriesReceived.indexOf(multisig.account.publicKey) === -1) {
                                cosignatoriesReceived.push(multisig.account.publicKey);
                              }
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
        array1.forEach((a1) => array2.forEach((a2) => {
            if (a1 === a2) {
                results.push(a1);
            }
        }));

        return results;
    }
}
