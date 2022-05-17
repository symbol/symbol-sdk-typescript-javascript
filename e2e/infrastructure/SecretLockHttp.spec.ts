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

import { sha3_256 } from '@noble/hashes/sha3';
import { bytesToHex } from '@noble/hashes/utils';
import { deepEqual } from 'assert';
import { expect } from 'chai';
import { firstValueFrom } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { Crypto } from '../../src/core/crypto';
import { Order, SecretLockPaginationStreamer } from '../../src/infrastructure';
import { SecretLockRepository } from '../../src/infrastructure/SecretLockRepository';
import { Account } from '../../src/model/account/Account';
import { LockHashAlgorithm } from '../../src/model/lock/LockHashAlgorithm';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('SecretLockHttp', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let secretLockRepository: SecretLockRepository;
    let generationHash: string;
    let networkType: NetworkType;
    let secret: string;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            networkType = helper.networkType;
            generationHash = helper.generationHash;
            secretLockRepository = helper.repositoryFactory.createSecretLockRepository();
            secret = bytesToHex(sha3_256(Crypto.randomBytes(20)));
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

    describe('Create a hash lock', () => {
        it('Announce SecretLockTransaction', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = secretLockTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Tests
     * =========================
     */

    describe('searchSecretLock using secret', () => {
        it('should return hash lock info given hash', async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const page = await firstValueFrom(secretLockRepository.search({ address: account.address, secret }));
            expect(page.data.length).eq(1);
            expect(page.pageNumber).eq(1);

            const info = page.data[0];
            expect(info.ownerAddress.plain()).to.be.equal(account.address.plain());
            expect(info.recipientAddress.plain()).to.be.equal(account2.address.plain());
            expect(info.amount.toString()).to.be.equal('10');

            const infoFromId = await firstValueFrom(secretLockRepository.getSecretLock(info.compositeHash));
            expect(infoFromId).deep.eq(info);
            const merkleInfo = await firstValueFrom(secretLockRepository.getSecretLockMerkle(info.compositeHash));
            expect(merkleInfo.raw).to.not.be.undefined;
        });
    });

    describe('searchSecretLock', () => {
        it('should return hash lock page info', async () => {
            const info = await firstValueFrom(secretLockRepository.search({ address: account.address }));
            expect(info.data.length).to.be.greaterThan(0);
        });
    });

    describe('searchSecretLock with streamer', () => {
        it('should return hash lock page info', async () => {
            const streamer = new SecretLockPaginationStreamer(secretLockRepository);
            const infoStreamer = await firstValueFrom(
                streamer.search({ address: account.address, pageSize: 20, order: Order.Asc }).pipe(take(20), toArray()),
            );
            const info = await firstValueFrom(
                secretLockRepository.search({
                    address: account.address,
                    secret: undefined,
                    pageSize: 20,
                    order: Order.Asc,
                }),
            );
            expect(infoStreamer.length).to.be.greaterThan(0);
            deepEqual(infoStreamer[0], info.data[0]);
        });
    });
});
