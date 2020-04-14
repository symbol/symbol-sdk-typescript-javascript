/*
 * Copyright 2020 NEM
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
import * as http from 'http';
import {
    AccountDTO,
    AccountIds,
    AccountInfoDTO,
    AccountRoutesApi,
    AccountTypeEnum,
    ActivityBucketDTO,
    Mosaic,
    TransactionTypeEnum,
} from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { QueryParams } from '../../src/infrastructure/QueryParams';
import { TransactionFilter } from '../../src/infrastructure/TransactionFilter';
import { AccountInfo } from '../../src/model/account/AccountInfo';
import { AccountType } from '../../src/model/account/AccountType';
import { Address } from '../../src/model/account/Address';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';

describe('AccountHttp', () => {
    const address = Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');

    const mosaic = new Mosaic();
    mosaic.amount = '777';
    mosaic.id = '941299B2B7E1291C';

    const activityBucketDTO = new ActivityBucketDTO();
    activityBucketDTO.beneficiaryCount = 1;
    activityBucketDTO.rawScore = 2;
    activityBucketDTO.startHeight = '3';
    activityBucketDTO.totalFeesPaid = 4;

    const accountDTO = new AccountDTO();
    accountDTO.accountType = AccountTypeEnum.NUMBER_1;
    accountDTO.address = address.encoded();
    accountDTO.addressHeight = '111';
    accountDTO.importance = '222';
    accountDTO.importanceHeight = '333';
    accountDTO.publicKeyHeight = '444';
    accountDTO.linkedAccountKey = 'abc';
    accountDTO.publicKey = 'AAA';
    accountDTO.activityBuckets = [];
    accountDTO.mosaics = [mosaic];
    accountDTO.activityBuckets = [activityBucketDTO];

    const accountInfoDto = new AccountInfoDTO();
    accountInfoDto.account = accountDTO;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const accountRoutesApi: AccountRoutesApi = mock();
    const accountRepository: AccountRepository = DtoMapping.assign(new AccountHttp(url), {
        accountRoutesApi: instance(accountRoutesApi),
    });

    const transactionInfoDTO = {
        meta: {
            hash: '671653C94E2254F2A23EFEDB15D67C38332AED1FBD24B063C0A8E675582B6A96',
            height: '18160',
            id: '5A0069D83F17CF0001777E55',
            index: 0,
            merkleComponentHash: '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7',
        },
        transaction: {
            deadline: '1000',
            maxFee: '0',
            signature:
                '939673209A13FF82397578D22CC96EB8516A6760C894D9B7535E3A1E0680' +
                '07B9255CFA9A914C97142A7AE18533E381C846B69D2AE0D60D1DC8A55AD120E2B606',
            signerPublicKey: '7681ED5023141D9CDCF184E5A7B60B7D466739918ED5DA30F7E71EA7B86EFF2D',
            minApprovalDelta: 1,
            minRemovalDelta: 1,
            modifications: [
                {
                    cosignatoryPublicKey: '589B73FBC22063E9AE6FBAC67CB9C6EA865EF556E5' + 'FB8B7310D45F77C1250B97',
                    modificationAction: 0,
                },
            ],
            type: 16725,
            version: 1,
            network: 144,
        },
    };

    before(() => {
        reset(response);
        reset(accountRoutesApi);
    });

    function assertAccountInfo(accountInfo: AccountInfo): void {
        expect(accountInfo).to.be.not.null;
        expect(accountInfo.accountType).to.be.equals(AccountType.Main);
        expect(accountInfo.addressHeight.toString()).to.be.equals(accountDTO.addressHeight);
        expect(accountInfo.importance.toString()).to.be.equals(accountDTO.importance);
        expect(accountInfo.importanceHeight.toString()).to.be.equals(accountDTO.importanceHeight);
        expect(accountInfo.publicKeyHeight.toString()).to.be.equals(accountDTO.publicKeyHeight);
        expect(accountInfo.publicKey).to.be.equals(accountDTO.publicKey);
        expect(accountInfo.linkedAccountKey).to.be.equals(accountDTO.linkedAccountKey);
        expect(accountInfo.mosaics.length).to.be.equals(1);
        expect(accountInfo.mosaics[0].id.id.toHex()).to.be.equals(mosaic.id);
        expect(accountInfo.mosaics[0].amount.toString()).to.be.equals(mosaic.amount);

        expect(accountInfo.activityBucket.length).to.be.equals(1);
        expect(accountInfo.activityBucket[0].beneficiaryCount).to.be.equals(activityBucketDTO.beneficiaryCount);
        expect(accountInfo.activityBucket[0].rawScore).to.be.equals(activityBucketDTO.rawScore);
        expect(accountInfo.activityBucket[0].startHeight).to.be.equals(activityBucketDTO.startHeight);
        expect(accountInfo.activityBucket[0].totalFeesPaid).to.be.equals(activityBucketDTO.totalFeesPaid);
    }

    function assertTransaction(transaction: Transaction): void {
        expect(transaction).to.be.not.null;
        expect(transaction.type).to.be.equals(transactionInfoDTO.transaction.type);
        expect(transaction.deadline.toString()).to.be.equals(transactionInfoDTO.transaction.deadline);
    }

    it('getAccountInfo', async () => {
        when(accountRoutesApi.getAccountInfo(address.plain())).thenReturn(Promise.resolve({ response, body: accountInfoDto }));
        const accountInfo = await accountRepository.getAccountInfo(address).toPromise();
        assertAccountInfo(accountInfo);
    });

    it('getAccountsInfo', async () => {
        const accountIds = new AccountIds();
        accountIds.addresses = [address.plain()];
        when(accountRoutesApi.getAccountsInfo(deepEqual(accountIds))).thenReturn(Promise.resolve({ response, body: [accountInfoDto] }));
        const accountInfos = await accountRepository.getAccountsInfo([address]).toPromise();
        assertAccountInfo(accountInfos[0]);
    });

    it('getAccountTransactions', async () => {
        when(
            accountRoutesApi.getAccountConfirmedTransactions(address.plain(), 1, 'a', '-id', deepEqual([TransactionTypeEnum.NUMBER_16725])),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountTransactions(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountTransactions', async () => {
        when(accountRoutesApi.getAccountConfirmedTransactions(address.plain(), undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository.getAccountTransactions(address).toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountIncomingTransactions', async () => {
        when(
            accountRoutesApi.getAccountIncomingTransactions(address.plain(), 1, 'a', '-id', deepEqual([TransactionTypeEnum.NUMBER_16725])),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountIncomingTransactions(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountOutgoingTransactions', async () => {
        when(
            accountRoutesApi.getAccountOutgoingTransactions(address.plain(), 1, 'a', '-id', deepEqual([TransactionTypeEnum.NUMBER_16725])),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountOutgoingTransactions(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountPartialTransactions', async () => {
        when(
            accountRoutesApi.getAccountPartialTransactions(address.plain(), 1, 'a', '-id', deepEqual([TransactionTypeEnum.NUMBER_16725])),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountPartialTransactions(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountUnconfirmedTransactions', async () => {
        when(
            accountRoutesApi.getAccountUnconfirmedTransactions(
                address.plain(),
                2,
                'b',
                '-id',
                deepEqual([TransactionTypeEnum.NUMBER_16725]),
            ),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountUnconfirmedTransactions(
                address,
                new QueryParams({
                    pageSize: 2,
                    id: 'b',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });

    it('getAccountPartialTransactions', async () => {
        when(
            accountRoutesApi.getAccountPartialTransactions(address.plain(), 1, 'a', '-id', deepEqual([TransactionTypeEnum.NUMBER_16725])),
        ).thenReturn(
            Promise.resolve({
                response,
                body: [transactionInfoDTO],
            }),
        );
        const transactions = await accountRepository
            .getAccountPartialTransactions(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
                new TransactionFilter({ types: [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] }),
            )
            .toPromise();
        assertTransaction(transactions[0]);
    });
});
