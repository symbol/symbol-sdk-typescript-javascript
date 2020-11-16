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
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('MultisigAccounts', () => {
    const helper = new IntegrationTestHelper();
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let generationHash: string;
    let networkType: NetworkType;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            multisigAccount = helper.multisigAccount;
            cosignAccount1 = helper.cosignAccount1;
            cosignAccount2 = helper.cosignAccount2;
            cosignAccount3 = helper.cosignAccount3;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
        });
    });

    after(() => {
        return helper.close();
    });

    describe('Setup test multisig account', () => {
        it('Announce MultisigAccountModificationTransaction', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                2,
                1,
                [cosignAccount1.address, cosignAccount2.address, cosignAccount3.address],
                [],
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(
                multisigAccount,
                [cosignAccount1, cosignAccount2, cosignAccount3],
                generationHash,
            );
            return helper.announce(signedTransaction);
        });
    });

    describe('getMultisigAccountInfo from address', () => {
        it('should return multisig account infro from address', async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const multisigRepository = helper.repositoryFactory.createMultisigRepository();

            const infoFromId = await multisigRepository.getMultisigAccountInfo(multisigAccount.address).toPromise();
            expect(infoFromId).to.not.be.undefined;
            expect(infoFromId.accountAddress).to.deep.eq(multisigAccount.address);
            expect(infoFromId.cosignatoryAddresses).to.deep.eq([cosignAccount1.address, cosignAccount3.address, cosignAccount2.address]);
            const merkleInfo = await multisigRepository.getMultisigAccountInfoMerkle(multisigAccount.address).toPromise();
            expect(merkleInfo.raw).to.not.be.undefined;
        });
    });
});
