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
import http = require('http');
import {
    BlockRoutesApi,
    TransactionRoutesApi,
    TransactionPage,
    TransactionMetaDTO,
    Pagination,
    TransferTransactionDTO,
    NetworkTypeEnum,
    TransactionInfoDTO,
    BlockDTO,
    BlockMetaDTO,
    BlockInfoDTO,
    AnnounceTransactionInfoDTO,
} from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, when } from 'ts-mockito';

import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Address } from '../../src/model/account/Address';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { NIS2_URL, TestingAccount } from '../conf/conf.spec';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { UInt64 } from '../../src/model/UInt64';
import { CosignatureSignedTransaction } from '../../src/model/transaction/CosignatureSignedTransaction';

describe('TransactionHttp', () => {
    const account = TestingAccount;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    let clientResponse: http.ClientResponse;
    let transactionRoutesApi: TransactionRoutesApi;
    let transactionHttp: TransactionHttp;
    let blockRoutesApi: BlockRoutesApi;

    before(() => {
        transactionRoutesApi = mock();
        blockRoutesApi = mock();
        clientResponse = mock();
        transactionHttp = new TransactionHttp(NIS2_URL);
        (transactionHttp as object)['transactionRoutesApi'] = instance(transactionRoutesApi);
        (transactionHttp as object)['blockRoutesApi'] = instance(blockRoutesApi);
    });

    it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );
        const aggTx = AggregateTransaction.createComplete(
            Deadline.create(),
            [tx.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTx = account.sign(aggTx, generationHash);
        const trnsHttp = new TransactionHttp(NIS2_URL);
        expect(() => {
            trnsHttp.announceAggregateBonded(signedTx).toPromise().then();
        }).to.throw(Error, 'Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
    });

    it('Test searchTransaction method', async () => {
        const page = new TransactionPage();
        const paginationDto = new Pagination();
        paginationDto.pageNumber = 1;
        paginationDto.pageSize = 1;
        paginationDto.totalEntries = 1;
        paginationDto.totalPages = 1;

        const transactionInfoDto = new TransactionInfoDTO();
        const metaDto = new TransactionMetaDTO();
        metaDto.hash = 'hash';
        metaDto.height = '1';
        metaDto.index = 0;
        metaDto.merkleComponentHash = 'merkleHash';

        const transactionDto = new TransferTransactionDTO();
        transactionDto.deadline = '1';
        transactionDto.maxFee = '1';
        transactionDto.mosaics = [];
        transactionDto.network = NetworkTypeEnum.NUMBER_104;
        transactionDto.recipientAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
        transactionDto.type = TransactionType.TRANSFER.valueOf();
        transactionDto.version = 1;

        transactionInfoDto.id = 'id';
        transactionInfoDto.meta = metaDto;
        transactionInfoDto.transaction = transactionDto;

        page.data = [transactionInfoDto];
        page.pagination = paginationDto;

        when(
            transactionRoutesApi.searchConfirmedTransactions(
                deepEqual(account.address.plain()),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve({ response: instance(clientResponse), body: page }));

        when(
            transactionRoutesApi.searchPartialTransactions(
                deepEqual(account.address.plain()),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve({ response: instance(clientResponse), body: page }));

        when(
            transactionRoutesApi.searchUnconfirmedTransactions(
                deepEqual(account.address.plain()),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve({ response: instance(clientResponse), body: page }));

        let transactions = await transactionHttp.search({ group: TransactionGroup.Confirmed, address: account.address }).toPromise();

        expect(transactions.data.length).to.be.equal(1);
        expect(transactions.data[0].type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transactions.data[0] as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transactions.data[0].transactionInfo?.id).to.be.equal('id');
        expect(transactions.data[0].transactionInfo?.hash).to.be.equal('hash');

        expect(transactions.pageNumber).to.be.equal(1);
        expect(transactions.pageSize).to.be.equal(1);
        expect(transactions.totalEntries).to.be.equal(1);
        expect(transactions.totalPages).to.be.equal(1);

        transactions = await transactionHttp.search({ group: TransactionGroup.Unconfirmed, address: account.address }).toPromise();

        expect(transactions.data.length).to.be.equal(1);
        expect(transactions.data[0].type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transactions.data[0] as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transactions.data[0].transactionInfo?.id).to.be.equal('id');
        expect(transactions.data[0].transactionInfo?.hash).to.be.equal('hash');

        expect(transactions.pageNumber).to.be.equal(1);
        expect(transactions.pageSize).to.be.equal(1);
        expect(transactions.totalEntries).to.be.equal(1);
        expect(transactions.totalPages).to.be.equal(1);

        transactions = await transactionHttp.search({ group: TransactionGroup.Partial, address: account.address }).toPromise();

        expect(transactions.data.length).to.be.equal(1);
        expect(transactions.data[0].type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transactions.data[0] as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transactions.data[0].transactionInfo?.id).to.be.equal('id');
        expect(transactions.data[0].transactionInfo?.hash).to.be.equal('hash');

        expect(transactions.pageNumber).to.be.equal(1);
        expect(transactions.pageSize).to.be.equal(1);
        expect(transactions.totalEntries).to.be.equal(1);
        expect(transactions.totalPages).to.be.equal(1);
    });

    it('Test getTransaction method', async () => {
        const transactionInfoDto = new TransactionInfoDTO();
        const metaDto = new TransactionMetaDTO();
        metaDto.hash = 'hash';
        metaDto.height = '1';
        metaDto.index = 0;
        metaDto.merkleComponentHash = 'merkleHash';

        const transactionDto = new TransferTransactionDTO();
        transactionDto.deadline = '1';
        transactionDto.maxFee = '1';
        transactionDto.mosaics = [];
        transactionDto.network = NetworkTypeEnum.NUMBER_104;
        transactionDto.recipientAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
        transactionDto.type = TransactionType.TRANSFER.valueOf();
        transactionDto.version = 1;

        transactionInfoDto.id = 'id';
        transactionInfoDto.meta = metaDto;
        transactionInfoDto.transaction = transactionDto;

        when(transactionRoutesApi.getConfirmedTransaction(generationHash)).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: transactionInfoDto }),
        );

        when(transactionRoutesApi.getPartialTransaction(generationHash)).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: transactionInfoDto }),
        );
        when(transactionRoutesApi.getUnconfirmedTransaction(generationHash)).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: transactionInfoDto }),
        );

        let transaction = await transactionHttp.getTransaction(generationHash, TransactionGroup.Confirmed).toPromise();

        expect(transaction.type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transaction as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transaction.transactionInfo?.id).to.be.equal('id');
        expect(transaction.transactionInfo?.hash).to.be.equal('hash');

        transaction = await transactionHttp.getTransaction(generationHash, TransactionGroup.Partial).toPromise();

        expect(transaction.type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transaction as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transaction.transactionInfo?.id).to.be.equal('id');
        expect(transaction.transactionInfo?.hash).to.be.equal('hash');

        transaction = await transactionHttp.getTransaction(generationHash, TransactionGroup.Unconfirmed).toPromise();

        expect(transaction.type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transaction as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transaction.transactionInfo?.id).to.be.equal('id');
        expect(transaction.transactionInfo?.hash).to.be.equal('hash');
    });

    it('Test getTransactionsById method', async () => {
        const transactionInfoDto = new TransactionInfoDTO();
        const metaDto = new TransactionMetaDTO();
        metaDto.hash = 'hash';
        metaDto.height = '1';
        metaDto.index = 0;
        metaDto.merkleComponentHash = 'merkleHash';

        const transactionDto = new TransferTransactionDTO();
        transactionDto.deadline = '1';
        transactionDto.maxFee = '1';
        transactionDto.mosaics = [];
        transactionDto.network = NetworkTypeEnum.NUMBER_104;
        transactionDto.recipientAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
        transactionDto.type = TransactionType.TRANSFER.valueOf();
        transactionDto.version = 1;

        transactionInfoDto.id = 'id';
        transactionInfoDto.meta = metaDto;
        transactionInfoDto.transaction = transactionDto;

        when(transactionRoutesApi.getTransactionsById(deepEqual({ transactionIds: [generationHash] }))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: [transactionInfoDto] }),
        );

        const transaction = await transactionHttp.getTransactionsById([generationHash]).toPromise();

        expect(transaction.length).to.be.equal(1);
        expect(transaction[0].type.valueOf()).to.be.equal(TransactionType.TRANSFER.valueOf());
        expect(((transaction[0] as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
            Address.createFromEncoded('6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144').plain(),
        );
        expect(transaction[0].transactionInfo?.id).to.be.equal('id');
        expect(transaction[0].transactionInfo?.hash).to.be.equal('hash');
    });

    it('Test getEffectiveFees method', async () => {
        const transactionInfoDto = new TransactionInfoDTO();
        const metaDto = new TransactionMetaDTO();
        metaDto.hash = 'hash';
        metaDto.height = '1';
        metaDto.index = 0;
        metaDto.merkleComponentHash = 'merkleHash';

        const transactionDto = new TransferTransactionDTO();
        transactionDto.deadline = '1';
        transactionDto.maxFee = '1';
        transactionDto.mosaics = [];
        transactionDto.network = NetworkTypeEnum.NUMBER_104;
        transactionDto.recipientAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
        transactionDto.type = TransactionType.TRANSFER.valueOf();
        transactionDto.version = 1;

        transactionInfoDto.id = 'id';
        transactionInfoDto.meta = metaDto;
        transactionInfoDto.transaction = transactionDto;

        const blockDTO = new BlockDTO();
        blockDTO.version = 1;
        blockDTO.network = NetworkTypeEnum.NUMBER_152;
        blockDTO.difficulty = '2';
        blockDTO.feeMultiplier = 3;
        blockDTO.height = '4';
        blockDTO.previousBlockHash = '5';
        blockDTO.type = 6;
        blockDTO.signerPublicKey = '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7';
        blockDTO.timestamp = '7';
        blockDTO.beneficiaryAddress = Address.createFromPublicKey(
            '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A8',
            NetworkType.MIJIN_TEST,
        ).encoded();

        const blockMetaDTO = new BlockMetaDTO();
        blockMetaDTO.generationHash = 'abc';
        blockMetaDTO.hash = 'aHash';
        blockMetaDTO.numStatements = 10;
        blockMetaDTO.numTransactions = 20;
        blockMetaDTO.totalFee = '30';
        blockMetaDTO.stateHashSubCacheMerkleRoots = ['a', 'b', 'c'];

        const blockInfoDto = new BlockInfoDTO();
        blockInfoDto.block = blockDTO;
        blockInfoDto.meta = blockMetaDTO;

        when(transactionRoutesApi.getConfirmedTransaction(generationHash)).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: transactionInfoDto }),
        );
        when(blockRoutesApi.getBlockByHeight(deepEqual(UInt64.fromUint(1).toString()))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: blockInfoDto }),
        );

        const fees = await transactionHttp.getTransactionEffectiveFee(generationHash).toPromise();
        expect(fees).to.be.equal(483);
    });

    it('Test announce', async () => {
        const response = new AnnounceTransactionInfoDTO();
        response.message = 'done';

        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );

        const signedTx = account.sign(tx, generationHash);

        when(transactionRoutesApi.announceTransaction(deepEqual(signedTx))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: response }),
        );
        const announceResult = await transactionHttp.announce(signedTx).toPromise();

        expect(announceResult.message).to.be.equal(response.message);
    });

    it('Test announceAggregateBonded', async () => {
        const response = new AnnounceTransactionInfoDTO();
        response.message = 'done';

        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );

        const aggTx = AggregateTransaction.createBonded(
            Deadline.create(),
            [tx.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTx = account.sign(aggTx, generationHash);

        when(transactionRoutesApi.announcePartialTransaction(deepEqual(signedTx))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: response }),
        );
        const announceResult = await transactionHttp.announceAggregateBonded(signedTx).toPromise();

        expect(announceResult.message).to.be.equal(response.message);
    });

    it('Test announceAggregateBonded Cosignatures', async () => {
        const response = new AnnounceTransactionInfoDTO();
        response.message = 'done';

        const cosignTx = new CosignatureSignedTransaction('parentHash', 'signature', 'signerPubKey');

        when(transactionRoutesApi.announceCosignatureTransaction(deepEqual(cosignTx))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: response }),
        );
        const announceResult = await transactionHttp.announceAggregateBondedCosignature(cosignTx).toPromise();

        expect(announceResult.message).to.be.equal(response.message);
    });

    it('getTransaction - Error', async () => {
        when(transactionRoutesApi.getConfirmedTransaction(generationHash)).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .getTransaction(generationHash, TransactionGroup.Confirmed)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getTransactionById - Error', async () => {
        when(transactionRoutesApi.getTransactionsById(deepEqual({ transactionIds: [generationHash] }))).thenReject(
            new Error('Mocked Error'),
        );
        await transactionHttp
            .getTransactionsById([generationHash])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('announceAggregateBonded - Error', async () => {
        const cosignTx = new CosignatureSignedTransaction('parentHash', 'signature', 'signerPubKey');
        when(transactionRoutesApi.announceCosignatureTransaction(deepEqual(cosignTx))).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .announceAggregateBondedCosignature(cosignTx)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('announceAggregateBonded Cosignatures - Error', async () => {
        const cosignTx = new CosignatureSignedTransaction('parentHash', 'signature', 'signerPubKey');

        when(transactionRoutesApi.announceCosignatureTransaction(deepEqual(cosignTx))).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .announceAggregateBondedCosignature(cosignTx)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('Test getEffectiveFees method', async () => {
        when(transactionRoutesApi.getConfirmedTransaction(generationHash)).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .getTransactionEffectiveFee(generationHash)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getEffectiveFees - Error', async () => {
        when(blockRoutesApi.getBlockByHeight(deepEqual(UInt64.fromUint(1).toString()))).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .getTransactionEffectiveFee(generationHash)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('announce - Error', async () => {
        const response = new AnnounceTransactionInfoDTO();
        response.message = 'done';

        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );

        const signedTx = account.sign(tx, generationHash);

        when(transactionRoutesApi.announceTransaction(deepEqual(signedTx))).thenReject(new Error('Mocked Error'));
        await transactionHttp
            .announce(signedTx)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('announce - Error', async () => {
        const response = new AnnounceTransactionInfoDTO();
        response.message = 'done';

        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );

        const aggTx = AggregateTransaction.createBonded(
            Deadline.create(),
            [tx.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTx = account.sign(aggTx, generationHash);

        when(transactionRoutesApi.announceTransaction(deepEqual(signedTx))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: response }),
        );
        try {
            await transactionHttp.announce(signedTx).toPromise();
        } catch (error) {
            expect(error).not.to.be.undefined;
        }
    });
});
