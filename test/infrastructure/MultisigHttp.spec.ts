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
import { MultisigAccountGraphInfoDTO, MultisigAccountInfoDTO, MultisigDTO, MultisigRoutesApi } from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MultisigHttp } from '../../src/infrastructure/MultisigHttp';
import { MultisigRepository } from '../../src/infrastructure/MultisigRepository';
import { Account } from '../../src/model/account/Account';
import { MultisigAccountInfo } from '../../src/model/account/MultisigAccountInfo';
import { NetworkType } from '../../src/model/network/NetworkType';

describe('MultisigHttp', () => {
    const networkType = NetworkType.MIJIN_TEST;
    const account = Account.generateNewAccount(networkType);
    const address = account.address;
    const accountInfoDto = new MultisigAccountInfoDTO();
    const multisigDTO = new MultisigDTO();

    const account1 = Account.generateNewAccount(networkType);
    const account2 = Account.generateNewAccount(networkType);
    const account3 = Account.generateNewAccount(networkType);
    const account4 = Account.generateNewAccount(networkType);

    multisigDTO.accountAddress = account.address.plain();
    multisigDTO.accountPublicKey = account.publicKey;
    multisigDTO.cosignatoryPublicKeys = [account1.publicKey, account2.publicKey];
    multisigDTO.minApproval = 2;
    multisigDTO.minRemoval = 3;
    multisigDTO.multisigPublicKeys = [account3.publicKey, account4.publicKey];

    accountInfoDto.multisig = multisigDTO;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const multisigRoutesApi: MultisigRoutesApi = mock();
    const accountRepository: MultisigRepository = DtoMapping.assign(new MultisigHttp(url, networkType), {
        multisigRoutesApi: instance(multisigRoutesApi),
    });

    before(() => {
        reset(response);
        reset(multisigRoutesApi);
    });

    function assertMultisigInfo(accountInfo: MultisigAccountInfo): void {
        expect(accountInfo).to.be.not.null;
        expect(accountInfo.isMultisig()).to.be.equals(true);
        expect(accountInfo.account).to.be.deep.equals(account.publicAccount);
        expect(accountInfo.cosignatories).to.deep.equals([account1.publicAccount, account2.publicAccount]);
        expect(accountInfo.minApproval).to.be.equals(multisigDTO.minApproval);
        expect(accountInfo.minRemoval).to.be.equals(multisigDTO.minRemoval);
        expect(accountInfo.multisigAccounts).to.deep.equals([account3.publicAccount, account4.publicAccount]);
    }

    it('getMultisigAccountInfo', async () => {
        when(multisigRoutesApi.getAccountMultisig(address.plain())).thenReturn(Promise.resolve({ response, body: accountInfoDto }));
        const accountInfo = await accountRepository.getMultisigAccountInfo(address).toPromise();
        assertMultisigInfo(accountInfo);
    });

    it('getMultisigAccountGraphInfo', async () => {
        const body = new MultisigAccountGraphInfoDTO();
        body.level = 10;
        body.multisigEntries = [accountInfoDto, accountInfoDto, accountInfoDto];

        const body2 = new MultisigAccountGraphInfoDTO();
        body2.level = 20;
        body2.multisigEntries = [accountInfoDto, accountInfoDto];
        when(multisigRoutesApi.getAccountMultisigGraph(address.plain())).thenReturn(Promise.resolve({ response, body: [body, body2] }));
        const graphInfo = await accountRepository.getMultisigAccountGraphInfo(address).toPromise();
        expect(graphInfo.multisigAccounts.size).to.be.eq(2);
        const list10: MultisigAccountInfo[] = graphInfo.multisigAccounts.get(10) as MultisigAccountInfo[];
        expect(list10.length).to.be.eq(3);
        assertMultisigInfo(list10[0]);
        assertMultisigInfo(list10[1]);
        assertMultisigInfo(list10[2]);

        const list20: MultisigAccountInfo[] = graphInfo.multisigAccounts.get(20) as MultisigAccountInfo[];
        expect(list20.length).to.be.eq(2);
        assertMultisigInfo(list20[0]);
        assertMultisigInfo(list20[1]);
    });
});
