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

import { expect } from 'chai';
import { toArray } from 'rxjs/operators';
import { ReceiptHttp } from '../../src/infrastructure/infrastructure';
import { ReceiptPaginationStreamer } from '../../src/infrastructure/paginationStreamer/ReceiptPaginationStreamer';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { ReceiptType, UInt64 } from '../../src/model/model';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('ReceiptHttp', () => {
    const helper = new IntegrationTestHelper();
    let receiptRepository: ReceiptRepository;

    before(() => {
        return helper.start().then(() => {
            receiptRepository = helper.repositoryFactory.createReceiptRepository();
        });
    });

    describe('searchReceipt with streamer and recipient type type', () => {
        async function searchByRecipientType(receiptTypes: ReceiptType[], empty: boolean) {
            const streamer = ReceiptPaginationStreamer.transactionStatements(receiptRepository);

            const infos = await streamer
                .search({ pageSize: 20, height: UInt64.fromUint(1), receiptTypes: receiptTypes })
                .pipe(toArray())
                .toPromise();

            infos.forEach((s) => {
                s.receipts.forEach((r) => {
                    expect(receiptTypes.indexOf(r.type)).to.not.eq(-1);
                });
            });
            if (empty) {
                expect(infos.length).to.be.eq(0);
            } else {
                expect(infos.length).to.not.eq(0);
            }
        }

        it('should return receipt info Harvest_Fee', async () => {
            await searchByRecipientType([ReceiptType.Harvest_Fee], false);
        });

        it('should return receipt info Namespace_Rental_Fee', async () => {
            await searchByRecipientType([ReceiptType.Namespace_Rental_Fee], false);
        });

        it('should return receipt info Harvest_Fee and Namespace_Rental_Fee', async () => {
            await searchByRecipientType([ReceiptType.Harvest_Fee, ReceiptType.Namespace_Rental_Fee], false);
        });

        it('should return receipt info LockHash_Completed and Namespace_Rental_Fee', async () => {
            await searchByRecipientType([ReceiptType.LockHash_Completed, ReceiptType.Namespace_Rental_Fee], false);
        });

        it('should return receipt info LockHash_Completed', async () => {
            await searchByRecipientType([ReceiptType.LockHash_Completed], true);
        });
    });
});
